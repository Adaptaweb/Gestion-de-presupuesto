// Prueba gratuita y cobro con Mercado Pago (suscripciones / preapproval).
//
// Reglas:
//  - La prueba (40 dias; 60 si partio antes del cambio) parte al terminar la configuracion del correo.
//  - El estado de acceso se calcula aqui, desde trial_started_at y la tabla
//    suscripciones_pago. El navegador nunca decide si alguien pagó: solo el
//    webhook, y aun asi se vuelve a consultar el recurso a Mercado Pago.
//  - Sin pago ni prueba vigente la cuenta queda en solo lectura: se puede ver
//    y exportar todo, no escribir. Nada se borra.
//
// Sin MP_ACCESS_TOKEN todo funciona salvo crear el cobro: el endpoint responde
// 503 y la app muestra "pagos no disponibles". Ver docs/pagos-mercadopago.md.

import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { diasDePrueba, READ_ONLY_DAYS, TRIAL_REMINDER_DAYS, PLANS } from '../src/constants/pricing.js';
import { enviarCorreo } from './billingEmails.js';

const DAY = 24 * 60 * 60 * 1000;
const MP_API = 'https://api.mercadopago.com';
const GRACIA_RENOVACION_DIAS = 5;
const ACCESO_TTL_S = 30;

const appUrl = () => (process.env.APP_URL || 'https://gastos.adaptaweb.cl').replace(/\/$/, '');
const mpListo = () => !!process.env.MP_ACCESS_TOKEN;

// --- Estado de acceso -------------------------------------------------------

export function calcularAcceso(user, sub, ahora = new Date()) {
  const now = ahora.getTime();
  const base = { plan: sub?.plan || null, periodoHasta: sub?.periodo_hasta || null, mpDisponible: mpListo() };

  if (user.role === 'admin') return { ...base, estado: 'exento', puedeEscribir: true };

  const hasta = sub?.periodo_hasta ? new Date(sub.periodo_hasta).getTime() : null;

  if (sub?.estado === 'activa' && (hasta === null || hasta + GRACIA_RENOVACION_DIAS * DAY > now)) {
    return { ...base, estado: 'activa', puedeEscribir: true };
  }
  if (sub?.estado === 'pago_fallido' && hasta !== null && hasta + GRACIA_RENOVACION_DIAS * DAY > now) {
    return { ...base, estado: 'pago_fallido', puedeEscribir: true };
  }
  if (sub?.estado === 'cancelada' && hasta !== null && hasta > now) {
    return { ...base, estado: 'cancelada_vigente', puedeEscribir: true, venceEl: new Date(hasta).toISOString() };
  }

  const inicio = user.trial_started_at ? new Date(user.trial_started_at).getTime() : null;
  if (inicio === null) {
    // Aun no termina de configurar el correo: la prueba no ha partido.
    return { ...base, estado: 'sin_iniciar', puedeEscribir: true };
  }
  const finPrueba = inicio + diasDePrueba(inicio) * DAY;
  if (now < finPrueba) {
    return {
      ...base, estado: 'prueba', puedeEscribir: true,
      diasRestantes: Math.max(1, Math.ceil((finPrueba - now) / DAY)),
      venceEl: new Date(finPrueba).toISOString(),
    };
  }

  const fin = Math.max(finPrueba, hasta ?? 0);
  const suspendeEl = fin + READ_ONLY_DAYS * DAY;
  return {
    ...base,
    estado: now < suspendeEl ? 'solo_lectura' : 'suspendida',
    puedeEscribir: false,
    venceEl: new Date(fin).toISOString(),
    suspendeEl: new Date(suspendeEl).toISOString(),
    diasParaSuspender: Math.max(0, Math.ceil((suspendeEl - now) / DAY)),
  };
}

async function cargarAcceso(db, cache, userId) {
  const key = `acc:${userId}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const user = await db.get('SELECT id, role, email, trial_started_at FROM users WHERE id = ?', userId);
  if (!user) return null;
  const sub = await db.get('SELECT * FROM suscripciones_pago WHERE user_id = ?', userId);
  const acceso = calcularAcceso(user, sub);
  cache.set(key, acceso, ACCESO_TTL_S);
  return acceso;
}

// --- Mercado Pago -----------------------------------------------------------

async function mp(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${MP_API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || `Mercado Pago respondió ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

function firmaValida(req, dataId) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true; // el recurso se vuelve a consultar con nuestro token: no se confia en el cuerpo
  const header = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];
  if (!header || !requestId) return false;
  const partes = Object.fromEntries(String(header).split(',').map((p) => p.trim().split('=')));
  if (!partes.ts || !partes.v1) return false;
  const id = /^[a-z0-9]+$/i.test(String(dataId)) ? String(dataId).toLowerCase() : String(dataId);
  const manifest = `id:${id};request-id:${requestId};ts:${partes.ts};`;
  const esperado = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  const a = Buffer.from(esperado);
  const b = Buffer.from(String(partes.v1));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// --- Registro de rutas ------------------------------------------------------

export function registerBilling(app, { db, cache, resend, authenticateToken, JWT_SECRET }) {
  const nombreDe = (u) => u?.nombre || u?.name || 'hola';

  // Un aviso por clave: si ya se envio, no se repite. Si el envio falla, se
  // libera la clave para que el siguiente pasaje del cron lo reintente.
  async function avisar(user, clave, tipo, datos = {}) {
    if (!resend) return false;
    const previo = await db.get('SELECT 1 AS ok FROM billing_avisos WHERE user_id = ? AND clave = ?', user.id, clave);
    if (previo) return false;
    await db.run('INSERT INTO billing_avisos (user_id, clave) VALUES (?, ?) ON CONFLICT DO NOTHING', user.id, clave);
    try {
      await enviarCorreo(resend, user.email, tipo, { nombre: nombreDe(user), ...datos });
      return true;
    } catch (err) {
      console.error(`[billing] no se pudo enviar ${tipo}:`, err.message);
      await db.run('DELETE FROM billing_avisos WHERE user_id = ? AND clave = ?', user.id, clave).catch(() => {});
      return false;
    }
  }

  // Bloquea escrituras de cuentas sin prueba ni plan. Va antes de las rutas.
  const LIBRES = ['/api/auth', '/api/billing', '/api/tutorial', '/api/push', '/api/webhook', '/api/cron', '/oauth2callback'];
  app.use('/api', async (req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
    if (LIBRES.some((p) => req.originalUrl.startsWith(p))) return next();
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (!token) return next();
    let payload;
    try { payload = jwt.verify(token, JWT_SECRET); } catch { return next(); }
    try {
      const acceso = await cargarAcceso(db, cache, payload.id);
      if (acceso && !acceso.puedeEscribir) {
        return res.status(402).json({
          error: 'solo_lectura',
          estado: acceso.estado,
          mensaje: 'Tu cuenta está en solo lectura. Elige un plan para volver a registrar cambios.',
        });
      }
    } catch (err) {
      // Si falla la consulta no se bloquea a nadie: es preferible dejar pasar.
      console.error('[billing] no se pudo calcular el acceso:', err.message);
    }
    next();
  });

  app.get('/api/billing/estado', authenticateToken, async (req, res) => {
    try {
      const user = await db.get('SELECT id, role, email, trial_started_at FROM users WHERE id = ?', req.user.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      const sub = await db.get('SELECT * FROM suscripciones_pago WHERE user_id = ?', req.user.id);
      const acceso = calcularAcceso(user, sub);
      cache.set(`acc:${req.user.id}`, acceso, ACCESO_TTL_S);
      res.json({ ...acceso, cancelaAlFinal: sub?.estado === 'cancelada', recordatorioDias: TRIAL_REMINDER_DAYS });
    } catch (err) {
      console.error('[billing] estado:', err.message);
      res.status(500).json({ error: 'No se pudo consultar tu plan' });
    }
  });

  app.post('/api/billing/checkout', authenticateToken, async (req, res) => {
    try {
      if (!mpListo()) return res.status(503).json({ error: 'pagos_no_disponibles', mensaje: 'Los pagos aún no están habilitados.' });
      const plan = PLANS[req.body?.plan];
      if (!plan || !plan.disponible) return res.status(400).json({ error: 'Plan no disponible' });

      const user = await db.get('SELECT id, email, nombre, name FROM users WHERE id = ?', req.user.id);
      const sub = await db.get('SELECT * FROM suscripciones_pago WHERE user_id = ?', req.user.id);
      if (sub?.estado === 'activa') return res.status(409).json({ error: 'Ya tienes un plan activo' });

      const pre = await mp('/preapproval', {
        method: 'POST',
        body: {
          reason: `Kuentas Klaras · Plan ${plan.name}`,
          external_reference: user.id,
          payer_email: user.email,
          auto_recurring: { frequency: plan.frequency, frequency_type: 'months', transaction_amount: plan.price, currency_id: 'CLP' },
          back_url: `${appUrl()}/app?pago=ok`,
          status: 'pending',
        },
      });

      await db.run(
        `INSERT INTO suscripciones_pago (user_id, plan, estado, mp_preapproval_id)
         VALUES (?, ?, 'pendiente', ?)
         ON CONFLICT (user_id) DO UPDATE SET plan = EXCLUDED.plan, estado = 'pendiente',
           mp_preapproval_id = EXCLUDED.mp_preapproval_id, actualizada_en = NOW()`,
        user.id, plan.id, pre.id
      );
      cache.del(`acc:${user.id}`);
      res.json({ url: pre.init_point });
    } catch (err) {
      console.error('[billing] checkout:', err.message);
      res.status(502).json({ error: 'No pudimos iniciar el pago. Intenta de nuevo en unos minutos.' });
    }
  });

  app.post('/api/billing/cancelar', authenticateToken, async (req, res) => {
    try {
      const sub = await db.get('SELECT * FROM suscripciones_pago WHERE user_id = ?', req.user.id);
      if (!sub || !['activa', 'pago_fallido'].includes(sub.estado)) return res.status(400).json({ error: 'No tienes una suscripción activa' });
      if (mpListo() && sub.mp_preapproval_id) {
        await mp(`/preapproval/${sub.mp_preapproval_id}`, { method: 'PUT', body: { status: 'cancelled' } });
      }
      await db.run(`UPDATE suscripciones_pago SET estado = 'cancelada', actualizada_en = NOW() WHERE user_id = ?`, req.user.id);
      cache.del(`acc:${req.user.id}`);
      const user = await db.get('SELECT id, email, nombre, name FROM users WHERE id = ?', req.user.id);
      await avisar(user, `cancelada:${sub.mp_preapproval_id || Date.now()}`, 'cancelada', {
        plan: PLANS[sub.plan]?.name || sub.plan, periodoHasta: sub.periodo_hasta,
      });
      res.json({ success: true, periodoHasta: sub.periodo_hasta });
    } catch (err) {
      console.error('[billing] cancelar:', err.message);
      res.status(502).json({ error: 'No pudimos cancelar la suscripción. Intenta de nuevo.' });
    }
  });

  // Webhook: la fuente de verdad del pago. Responde 200 siempre que el evento
  // sea legitimo para que Mercado Pago no lo reenvie sin fin.
  async function sincronizarPreapproval(preapprovalId) {
    const pre = await mp(`/preapproval/${preapprovalId}`);
    const userId = pre.external_reference;
    if (!userId) return null;
    const plan = Object.values(PLANS).find((p) => p.frequency === pre.auto_recurring?.frequency && p.price === pre.auto_recurring?.transaction_amount);

    let estado = null;
    let periodoHasta = null;
    if (pre.status === 'authorized') {
      estado = 'activa';
      periodoHasta = pre.next_payment_date || null;
    } else if (pre.status === 'paused') {
      estado = 'pago_fallido';
    } else if (pre.status === 'cancelled') {
      estado = 'cancelada';
    }
    if (!estado) return { userId, estado: null };

    await db.run(
      `UPDATE suscripciones_pago
         SET estado = ?, mp_preapproval_id = ?, periodo_hasta = COALESCE(?::timestamptz, periodo_hasta),
             plan = COALESCE(?, plan), actualizada_en = NOW()
       WHERE user_id = ?`,
      estado, pre.id, periodoHasta, plan?.id || null, userId
    );
    cache.del(`acc:${userId}`);
    return { userId, estado, periodoHasta };
  }

  app.post('/api/billing/webhook', async (req, res) => {
    try {
      const tipo = req.body?.type || req.query.type || req.query.topic;
      const dataId = req.body?.data?.id || req.query['data.id'] || req.query.id;
      if (!tipo || !dataId) return res.status(200).json({ ignorado: true });
      if (!firmaValida(req, dataId)) return res.status(401).json({ error: 'Firma inválida' });
      if (!mpListo()) return res.status(503).json({ error: 'pagos_no_disponibles' });

      const eventoId = `${tipo}:${dataId}:${req.headers['x-request-id'] || ''}`;
      const nuevo = await db.run('INSERT INTO billing_eventos (id) VALUES (?) ON CONFLICT DO NOTHING', eventoId);
      if (!nuevo.changes) return res.status(200).json({ duplicado: true });

      if (tipo === 'subscription_preapproval') {
        const r = await sincronizarPreapproval(dataId);
        if (r?.estado === 'cancelada') {
          // La cancelacion hecha desde Mercado Pago tambien se avisa.
          const user = await db.get('SELECT id, email, nombre, name FROM users WHERE id = ?', r.userId);
          const sub = await db.get('SELECT * FROM suscripciones_pago WHERE user_id = ?', r.userId);
          if (user && sub) await avisar(user, `cancelada:${sub.mp_preapproval_id}`, 'cancelada', { plan: PLANS[sub.plan]?.name || sub.plan, periodoHasta: sub.periodo_hasta });
        }
      } else if (tipo === 'subscription_authorized_payment') {
        const cobro = await mp(`/authorized_payments/${dataId}`);
        const r = cobro.preapproval_id ? await sincronizarPreapproval(cobro.preapproval_id) : null;
        const userId = r?.userId;
        if (userId) {
          const user = await db.get('SELECT id, email, nombre, name FROM users WHERE id = ?', userId);
          const sub = await db.get('SELECT * FROM suscripciones_pago WHERE user_id = ?', userId);
          const aprobado = cobro.status === 'processed' && (!cobro.payment || cobro.payment.status === 'approved');
          const rechazado = cobro.payment?.status === 'rejected' || cobro.status === 'recycling';
          const nombrePlan = PLANS[sub?.plan]?.name || sub?.plan;
          if (user && aprobado) {
            await avisar(user, `pago:${cobro.id}`, 'pago_ok', { plan: nombrePlan, monto: cobro.transaction_amount, periodoHasta: sub?.periodo_hasta });
          } else if (user && rechazado) {
            await db.run(`UPDATE suscripciones_pago SET estado = 'pago_fallido', actualizada_en = NOW() WHERE user_id = ? AND estado = 'activa'`, userId);
            cache.del(`acc:${userId}`);
            await avisar(user, `fallo:${cobro.id}`, 'pago_fallido', { plan: nombrePlan });
          }
        }
      }
      res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[billing] webhook:', err.message);
      // 500 hace que Mercado Pago reintente: es lo que se quiere ante un fallo transitorio.
      res.status(500).json({ error: 'No se pudo procesar el evento' });
    }
  });

  // Cron diario (Vercel): avisos de la prueba y del solo lectura.
  app.get('/api/cron/billing', async (req, res) => {
    const secreto = process.env.CRON_SECRET;
    if (!secreto || req.headers['authorization'] !== `Bearer ${secreto}`) return res.status(401).json({ error: 'No autorizado' });
    try {
      const usuarios = await db.all(
        `SELECT id, email, nombre, name, role, trial_started_at FROM users
         WHERE trial_started_at IS NOT NULL AND deleted_at IS NULL AND (email_verified IS TRUE)`
      );
      const subs = await db.all('SELECT * FROM suscripciones_pago');
      const porUsuario = new Map(subs.map((s) => [s.user_id, s]));
      const enviados = { trial_7d: 0, trial_1d: 0, periodo_fin: 0, suspension_5d: 0 };

      for (const u of usuarios) {
        const acceso = calcularAcceso(u, porUsuario.get(u.id));
        const datos = { venceEl: acceso.venceEl, suspendeEl: acceso.suspendeEl };
        const ciclo = new Date(u.trial_started_at).getTime();
        if (acceso.estado === 'prueba') {
          if (acceso.diasRestantes <= 1) { if (await avisar(u, `trial_1d:${ciclo}`, 'trial_1d', datos)) enviados.trial_1d++; }
          else if (acceso.diasRestantes <= TRIAL_REMINDER_DAYS) { if (await avisar(u, `trial_7d:${ciclo}`, 'trial_7d', datos)) enviados.trial_7d++; }
        } else if (acceso.estado === 'solo_lectura') {
          if (await avisar(u, `periodo_fin:${acceso.venceEl}`, 'periodo_fin', datos)) enviados.periodo_fin++;
          if (acceso.diasParaSuspender <= 5 && await avisar(u, `suspension_5d:${acceso.venceEl}`, 'suspension_5d', datos)) enviados.suspension_5d++;
        }
      }
      res.json({ ok: true, revisados: usuarios.length, enviados });
    } catch (err) {
      console.error('[billing] cron:', err.message);
      res.status(500).json({ error: 'Error al procesar los avisos' });
    }
  });

  return { avisar, cargarAcceso: (userId) => cargarAcceso(db, cache, userId) };
}
