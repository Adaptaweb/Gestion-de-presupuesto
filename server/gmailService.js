import { google } from 'googleapis';
import { getAuthenticatedClient, hasValidTokens, clearTokens } from './gmailAuth.js';
import { parseHTML } from './transactionParser.js';
import db from './db.js';
import { sendPushToUser } from './push.js';

async function fetchLatestTransactions(userId) {
  if (!(await hasValidTokens(userId))) {
    return { success: false, error: 'Gmail no autenticado. Ejecuta primero la autenticación OAuth.' };
  }

  const results = { fetched: 0, new: 0, errors: 0, transactions: [] };

  try {
    const auth = await getAuthenticatedClient(userId);
    if (!auth) throw new Error('No se pudo autenticar con Gmail');

    const gmail = google.gmail({ version: 'v1', auth });

    const query = await buildGmailQuery(userId);

    const allIds = [];
    let pageToken = undefined;
    do {
      const listRes = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 100,
        pageToken: pageToken,
      });
      for (const msg of listRes.data.messages || []) {
        allIds.push(msg.id);
      }
      pageToken = listRes.data.nextPageToken || null;
    } while (pageToken && allIds.length < 500);

    results.fetched = allIds.length;

    const existingRows = await db.all(
      'SELECT gmail_msg_id FROM transacciones_extraidas WHERE user_id = $1 AND gmail_msg_id = ANY($2)',
      userId, allIds
    );
    const existingIds = new Set(existingRows.map(r => r.gmail_msg_id));
    const newIds = allIds.filter(id => !existingIds.has(id));

    const CONCURRENCY = 5;
    for (let i = 0; i < newIds.length; i += CONCURRENCY) {
      const chunk = newIds.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(id => processEmail(id, gmail, userId, results)));
    }
  } catch (err) {
    console.error('[GmailService] Error:', err.message);
    if (err.message?.includes('invalid_grant')) {
      await clearTokens(userId);
      results.error = 'invalid_grant';
      results.needsReauth = true;
      results.message = 'La autorización de Gmail ha expirado o fue revocada. Vuelve a autorizar el acceso.';
    } else {
      results.error = err.message;
    }
  }

  return results;
}

async function processEmail(msgId, gmail, userId, results) {
  try {
    const fullMsg = await gmail.users.messages.get({
      userId: 'me',
      id: msgId,
      format: 'full',
    });

    const headers = {};
    const payload = fullMsg.data.payload;
    for (const h of payload.headers || []) {
      headers[h.name.toLowerCase()] = h.value;
    }

    const emailId = headers['message-id'] || headers['message_id'] || msgId;

    const body = getEmailBody(payload);
    if (!body) return;

    const parsed = await parseHTML(body, headers, userId);
    if (!parsed || !parsed.monto || !parsed.fecha) return;

    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const subject = (headers['subject'] || '').slice(0, 200);

    await db.run(
      `INSERT INTO transacciones_extraidas (id, user_id, banco, tipo_movimiento, tipo_tarjeta, monto, comercio, fecha, categoria, asunto, email_id, fecha_extraccion, revisado, tipo_transaccion, gmail_msg_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), FALSE, $12, $13)
       ON CONFLICT (email_id) DO UPDATE SET
         asunto = EXCLUDED.asunto,
         tipo_tarjeta = EXCLUDED.tipo_tarjeta,
         gmail_msg_id = EXCLUDED.gmail_msg_id,
         fecha_extraccion = NOW(),
         comercio = CASE WHEN transacciones_extraidas.revisado = FALSE AND EXCLUDED.comercio != '' THEN EXCLUDED.comercio ELSE transacciones_extraidas.comercio END,
         tipo_transaccion = CASE WHEN transacciones_extraidas.revisado = FALSE AND EXCLUDED.tipo_transaccion IS NOT NULL THEN EXCLUDED.tipo_transaccion ELSE transacciones_extraidas.tipo_transaccion END`,
      id, userId, parsed.banco, parsed.tipo_movimiento, parsed.tipo_tarjeta || '', parsed.monto, parsed.comercio, parsed.fecha, parsed.categoria, subject, emailId, parsed.tipo_transaccion_auto || 'gasto', msgId
    );

    results.new++;
    results.transactions.push(parsed);

    sendPushToUser(userId, 'Nueva transacción detectada',
      `${parsed.comercio || 'Transacción'} — $${Number(parsed.monto).toLocaleString('es-CL')}`,
      '/'
    ).catch(err => console.error(`[GmailService] Push error: ${err.message}`));
  } catch (msgErr) {
    results.errors++;
    console.error('[GmailService] Error processing message:', msgErr.message);
  }
}

function getEmailBody(payload) {
  if (!payload) return null;

  if (payload.mimeType === 'text/html' && payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }

  if (payload.mimeType === 'multipart/alternative' || payload.mimeType === 'multipart/mixed' || payload.mimeType === 'multipart/related') {
    for (const part of payload.parts || []) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
      if (part.parts) {
        const nested = getEmailBody(part);
        if (nested) return nested;
      }
    }
  }

  return null;
}

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function getLastCheckTime() {
  return 0;
}

async function getLookbackDays(userId) {
  const config = await db.get('SELECT dias_atras FROM config_extraccion WHERE user_id = $1', userId);
  return config?.dias_atras ?? 3;
}

async function buildGmailQuery(userId) {
  const filters = await db.all('SELECT remitente, asunto FROM filtros_correo WHERE user_id = $1', userId);
  const days = await getLookbackDays(userId);

  if (filters.length === 0) {
    return `after:${getDateDaysAgo(days)} (from:@bci.cl OR from:@bancochile.cl OR from:@santander.cl OR from:@bancoestado.cl)`;
  }

  const parts = filters.map(f => {
    let q = `from:${f.remitente}`;
    if (f.asunto && f.asunto.trim()) {
      q += ` subject:"${f.asunto.trim()}"`;
    }
    return `(${q})`;
  });

  return `(${parts.join(' OR ')}) after:${getDateDaysAgo(days)}`;
}

export { fetchLatestTransactions, getLastCheckTime, buildGmailQuery };
