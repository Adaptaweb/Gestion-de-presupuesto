import PostalMime from 'postal-mime';

// Entrega de correo entrante al backend.
//
// Cloudflare Email Routing recibe el correo en parse+<casilla>@adaptaweb.cl y
// dispara este Worker. Todo lo que se usa aqui esta en el plan gratuito: Email
// Workers, KV y Cron Triggers. Queues no, por eso los reintentos diferidos se
// hacen a mano.
//
// Camino normal: se intenta entregar al webhook con unos pocos reintentos en
// linea. Si el backend esta caido, en vez de perder el correo se guarda en KV y
// un cron lo reintenta cada quince minutos hasta que entre o caduque.

const INLINE_RETRIES = 3;
const PENDING_PREFIX = 'pending:';
const PENDING_TTL_SECONDS = 7 * 24 * 60 * 60;
const MAX_DRAIN_PER_RUN = 50;

function postToWebhook(env, payload) {
  return fetch(`${env.VERCEL_URL}/api/webhook/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': env.WEBHOOK_SECRET,
    },
    body: JSON.stringify(payload),
  });
}

// Devuelve 'ok' si entro, 'descartado' si el backend lo rechaza por un problema
// del mensaje, o 'reintentar' si el fallo es del backend.
async function deliver(env, payload, retries = INLINE_RETRIES) {
  for (let intento = 1; intento <= retries; intento++) {
    let res;
    try {
      res = await postToWebhook(env, payload);
    } catch (err) {
      console.error(`[EmailWorker] Red caida en intento ${intento}: ${err.message}`);
      if (intento < retries) await new Promise(r => setTimeout(r, 2000 * intento));
      continue;
    }

    if (res.ok) return 'ok';

    // 4xx es un problema del propio mensaje: reintentar no lo arregla.
    if (res.status >= 400 && res.status < 500) {
      console.error(`[EmailWorker] Rechazado con ${res.status}: ${await res.text()}`);
      return 'descartado';
    }

    console.error(`[EmailWorker] Backend respondio ${res.status} en intento ${intento}`);
    if (intento < retries) await new Promise(r => setTimeout(r, 2000 * intento));
  }

  return 'reintentar';
}

async function guardarPendiente(env, payload) {
  if (!env.EMAIL_PENDING) {
    console.error('[EmailWorker] Sin binding EMAIL_PENDING: el correo se pierde');
    return;
  }
  const key = `${PENDING_PREFIX}${Date.now()}-${crypto.randomUUID()}`;
  await env.EMAIL_PENDING.put(key, JSON.stringify(payload), {
    expirationTtl: PENDING_TTL_SECONDS,
  });
  console.warn(`[EmailWorker] Backend inalcanzable: guardado en ${key} para reintento`);
}

export default {
  async email(message, env, ctx) {
    try {
      const recipient = message.to.toLowerCase();
      const match = recipient.match(/^parse\+([^@]+)@adaptaweb\.cl$/);
      if (!match) return;

      const parsed = await PostalMime.parse(message.raw);

      const payload = {
        userId: match[1],
        from: message.from,
        subject: parsed.subject || '',
        html: parsed.html || '',
        text: parsed.text || '',
        messageId: parsed.messageId || message.headers.get('message-id') || '',
      };

      const resultado = await deliver(env, payload);
      if (resultado === 'reintentar') {
        await guardarPendiente(env, payload);
      }
    } catch (err) {
      console.error('[EmailWorker] Error:', err.message, err.stack);
    }
  },

  // Cron: vacia los correos que no se pudieron entregar. Gratuito, a diferencia
  // de los reintentos de Queues.
  async scheduled(event, env, ctx) {
    if (!env.EMAIL_PENDING) return;

    const listado = await env.EMAIL_PENDING.list({ prefix: PENDING_PREFIX, limit: MAX_DRAIN_PER_RUN });
    if (listado.keys.length === 0) return;

    console.log(`[EmailWorker] Reintentando ${listado.keys.length} correo(s) pendiente(s)`);

    let entregados = 0;
    for (const { name } of listado.keys) {
      const raw = await env.EMAIL_PENDING.get(name);
      if (!raw) continue;

      // Un solo intento por ejecucion: si sigue caido, lo coge el cron
      // siguiente. Asi una tanda grande no agota el tiempo del Worker.
      const resultado = await deliver(env, JSON.parse(raw), 1);

      if (resultado === 'ok' || resultado === 'descartado') {
        await env.EMAIL_PENDING.delete(name);
        if (resultado === 'ok') entregados++;
      }
    }

    console.log(`[EmailWorker] Entregados ${entregados} de ${listado.keys.length}`);
  },
};
