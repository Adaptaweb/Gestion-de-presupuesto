import { google } from 'googleapis';
import { getAuthenticatedClient, hasValidTokens, clearTokens } from './gmailAuth.js';
import { parseHTML } from './transactionParser.js';
import db from './db.js';

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

    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 20,
    });

    const messages = listRes.data.messages || [];
    results.fetched = messages.length;

    for (const msg of messages) {
      try {
        const fullMsg = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });

        const headers = {};
        const payload = fullMsg.data.payload;
        for (const h of payload.headers || []) {
          headers[h.name.toLowerCase()] = h.value;
        }

        const emailId = headers['message-id'] || headers['message_id'] || msg.id;

        const body = getEmailBody(payload);
        if (!body) continue;

        const parsed = await parseHTML(body, headers, userId);
        if (!parsed || !parsed.monto || !parsed.fecha) continue;

        const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const subject = (headers['subject'] || '').slice(0, 200);

        const existing = await db.get('SELECT id FROM transacciones_extraidas WHERE email_id = $1 AND user_id = $2', emailId, userId);
        if (existing) {
          await db.run("UPDATE transacciones_extraidas SET asunto = $1, tipo_tarjeta = $2, fecha_extraccion = NOW() WHERE id = $3",
            subject, parsed.tipo_tarjeta || '', existing.id);
          results.transactions.push(parsed);
        } else {
          await db.run(
            "INSERT INTO transacciones_extraidas (id, user_id, banco, tipo_movimiento, tipo_tarjeta, monto, comercio, fecha, categoria, asunto, email_id, fecha_extraccion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())",
            id, userId, parsed.banco, parsed.tipo_movimiento, parsed.tipo_tarjeta || '', parsed.monto, parsed.comercio, parsed.fecha, parsed.categoria, subject, emailId);
          results.new++;
          results.transactions.push(parsed);
        }
      } catch (msgErr) {
        results.errors++;
        console.error('[GmailService] Error processing message:', msgErr.message);
      }
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
