import PostalMime from 'postal-mime';

// Limite duro de Cloudflare Queues por mensaje. Se deja margen para la
// sobrecarga de la serializacion.
const MAX_MESSAGE_BYTES = 120 * 1024;

function byteLength(value) {
  return new TextEncoder().encode(JSON.stringify(value)).length;
}

async function postToWebhook(env, payload) {
  return fetch(`${env.VERCEL_URL}/api/webhook/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': env.WEBHOOK_SECRET,
    },
    body: JSON.stringify(payload),
  });
}

export default {
  // Productor: Cloudflare entrega el correo, nosotros lo dejamos en la cola y
  // devolvemos el control. Antes se llamaba al webhook aqui mismo con
  // reintentos en linea: si el backend estaba caido o lento, el correo se
  // perdia al agotarse los tres intentos.
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

      // Los correos muy grandes no caben en un mensaje de cola. Se prueba sin
      // la version en texto plano, que es redundante cuando hay HTML, y si
      // sigue sin caber se entrega directo al webhook.
      let toQueue = payload;
      if (byteLength(toQueue) > MAX_MESSAGE_BYTES && payload.html) {
        toQueue = { ...payload, text: '' };
      }

      if (byteLength(toQueue) > MAX_MESSAGE_BYTES) {
        console.warn(`[EmailWorker] Mensaje demasiado grande para la cola (${byteLength(toQueue)} bytes): entrega directa`);
        const res = await postToWebhook(env, payload);
        if (!res.ok) {
          console.error(`[EmailWorker] Entrega directa fallida: ${res.status}`);
        }
        return;
      }

      await env.EMAIL_QUEUE.send(toQueue);
    } catch (err) {
      console.error('[EmailWorker] Error encolando:', err.message, err.stack);
      throw err;
    }
  },

  // Consumidor: entrega al backend. Los reintentos y la cola de mensajes
  // muertos los gestiona Cloudflare segun wrangler.toml, con espera
  // exponencial entre intentos.
  async queue(batch, env, ctx) {
    for (const message of batch.messages) {
      try {
        const res = await postToWebhook(env, message.body);

        if (res.ok) {
          message.ack();
          continue;
        }

        // 4xx es un problema del mensaje, no del backend: reintentarlo no lo
        // arregla y solo consume la cola.
        if (res.status >= 400 && res.status < 500) {
          console.error(`[EmailWorker] Rechazado con ${res.status}, se descarta: ${await res.text()}`);
          message.ack();
          continue;
        }

        console.error(`[EmailWorker] Backend respondio ${res.status}, se reintenta`);
        message.retry();
      } catch (err) {
        console.error('[EmailWorker] Error entregando:', err.message);
        message.retry();
      }
    }
  },
};
