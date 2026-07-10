import { google } from 'googleapis';
import { getAuthenticatedClient, hasValidTokens, clearTokens } from './gmailAuth.js';
import { parseHTML } from './transactionParser.js';
import { generarFingerprint } from './fingerprint.js';
import db from './db.js';
import { sendPushToUser } from './push.js';
import { extractWithTemplateSystem, saveTemplateFromExtraction } from './templateEngine.js';
import { detectBankFromSender } from './bankMapping.js';

async function fetchLatestTransactions(userId) {
  if (!(await hasValidTokens(userId))) {
    return { success: false, needsReauth: true, message: 'Token de Gmail expirado o no autenticado. Ve a Configuración → Gmail para re-autenticar.', error: 'Gmail no autenticado' };
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
    const subject = (headers['subject'] || '').slice(0, 200);
    const from = headers['from'] || '';

    const NO_TX_SUBJECT_PATTERNS = [
      /cartola mensual/i,
      /estado de cuenta/i,
      /resumen mensual/i,
      /tips para tu salud financiera/i,
    ];
    if (NO_TX_SUBJECT_PATTERNS.some(p => p.test(subject))) {
      console.log(`[GmailService] Skipping non-transaction email: "${subject}"`);
      return;
    }

    const body = getEmailBody(payload);
    if (!body) return;

    let parsed = await extractWithTemplateSystem(body, headers, userId);
    console.log(`[GmailService] extractWithTemplateSystem result:`, JSON.stringify({ monto: parsed?.monto, fecha: parsed?.fecha, comercio: parsed?.comercio, is_template: parsed?.is_template }));

    if (!parsed || !parsed.monto || !parsed.fecha || !parsed.comercio?.trim()) {
      console.log(`[GmailService] Falling back to parseHTML`);
      parsed = await parseHTML(body, headers, userId);
    }

    if (!parsed || !parsed.monto || !parsed.fecha) {
      try {
        const fingerprint = generarFingerprint(body, subject);
        const bancoDetectado = parsed?.banco || detectBankFromSender(headers?.from || '');
        await db.run(
          `INSERT INTO parsing_logs (user_id, email_id, banco_detectado, fingerprint_hash, parsing_exitoso, campos_extraidos, confianza_score, metodo_extraccion, openrouter_fallback)
           VALUES ($1, $2, $3, $4, FALSE, $5, 0, 'fallido', TRUE)
           ON CONFLICT DO NOTHING`,
          userId, emailId, bancoDetectado, fingerprint,
          JSON.stringify({ monto: !!parsed?.monto, fecha: !!parsed?.fecha, comercio: !!parsed?.comercio })
        );
      } catch (logErr) {
        console.warn('[GmailService] Error logging failed parse:', logErr.message);
      }
      return;
    }

    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const bancoFinal = parsed.banco || 'Otros';

    const esNuevo = !(await db.get(
      'SELECT 1 FROM transacciones_extraidas WHERE email_id = $1 AND user_id = $2',
      emailId, userId
    ));

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
      id, userId, bancoFinal, parsed.tipo_movimiento, parsed.tipo_tarjeta || '', parsed.monto, parsed.comercio, parsed.fecha, parsed.categoria, subject, emailId, parsed.tipo_transaccion_auto || 'gasto', msgId
    );

    try {
      const fingerprint = parsed.fingerprint || generarFingerprint(body, subject);
      const tipoCorreo = parsed.tipo_movimiento?.toLowerCase() || 'compra';
      const metodo = parsed.is_template ? 'template' : ((parsed.confianza || 0) > 0.6 ? 'especializado' : 'generico');
      await db.run(
        `INSERT INTO parsing_logs (user_id, email_id, banco_detectado, fingerprint_hash, parsing_exitoso, campos_extraidos, confianza_score, metodo_extraccion, openrouter_fallback)
         VALUES ($1, $2, $3, $4, TRUE, $5, $6, $7, FALSE)
         ON CONFLICT DO NOTHING`,
        userId, emailId, bancoFinal, fingerprint,
        JSON.stringify({ monto: true, fecha: true, comercio: !!parsed.comercio }),
        parsed.confianza || 0,
        metodo
      );

      if (parsed.is_template) {
        if (parsed.comercio && parsed.comercio.trim().length >= 2) {
          await saveTemplateFromExtraction(parsed, body, headers, subject, userId);
        } else {
          console.log(`[GmailService] Skipping saveTemplateFromExtraction - comercio empty: "${parsed.comercio}"`);
        }
      } else {
        if (parsed.comercio && parsed.comercio.trim().length >= 2) {
          await db.run(
            `INSERT INTO plantillas_email (banco, tipo_correo, fingerprint_hash, asunto_normalizado, parser_nombre, ejemplo_html, count_uso, count_exitoso, ultimo_uso)
             VALUES ($1, $2, $3, $4, $5, $6, 1, 1, NOW())
             ON CONFLICT (banco, fingerprint_hash) DO UPDATE SET
               count_uso = plantillas_email.count_uso + 1,
               count_exitoso = plantillas_email.count_exitoso + 1,
               ultimo_uso = NOW()`,
            bancoFinal, tipoCorreo, fingerprint, subject,
            (parsed.confianza || 0) > 0.6 ? 'especializado' : 'generico',
            body.substring(0, 2000)
          );
        } else {
          console.log(`[GmailService] Skipping plantilla save - comercio empty: "${parsed.comercio}"`);
        }
      }
    } catch (logErr) {
      console.warn('[GmailService] Error logging to parsing_logs/plantillas:', logErr.message);
    }

    if (esNuevo) {
      results.new++;
      results.transactions.push(parsed);

      sendPushToUser(userId, 'Nueva transacción detectada',
        `${parsed.comercio || 'Transacción'} — $${Number(parsed.monto).toLocaleString('es-CL')}`,
        '/'
      ).catch(err => console.error(`[GmailService] Push error: ${err.message}`));
    }
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

async function reprocessPendingTransactions(userId) {
  const results = { total: 0, processed: 0, errors: 0, skipped: 0, updates: [], errors_detail: [], needsReauth: false };

  if (!(await hasValidTokens(userId))) {
    results.errors_detail.push('Gmail no autenticado');
    return results;
  }

  const auth = await getAuthenticatedClient(userId);
  if (!auth) { results.errors_detail.push('No se pudo autenticar con Gmail'); return results; }

  const gmail = google.gmail({ version: 'v1', auth });

  // Validate token with a lightweight Gmail API call
  try {
    await gmail.users.getProfile({ userId: 'me' });
  } catch (e) {
    if (e.message?.includes('invalid_grant') || e.message?.includes('Invalid Credentials')) {
      await clearTokens(userId);
      results.needsReauth = true;
      results.errors_detail.push('Token de Gmail expirado. Necesitas re-autenticar.');
      return results;
    }
  }

  const pending = await db.all(
    `SELECT * FROM transacciones_extraidas
     WHERE user_id = $1
       AND (revisado = FALSE OR revisado IS NULL)
       AND gmail_msg_id IS NOT NULL AND gmail_msg_id != ''
       AND deleted_at IS NULL`,
    userId
  );

  results.total = pending.length;

  for (const tx of pending) {
    let gmailId = tx.gmail_msg_id;

    // Webhook transactions have fake gmail_msg_id (wb-...), search by email_id instead
    if (gmailId.startsWith('wb-') && tx.email_id) {
      try {
        const searchRes = await gmail.users.messages.list({
          userId: 'me',
          q: `rfc822msgid:${tx.email_id}`,
          maxResults: 1,
        });
        if (searchRes.data.messages?.[0]) {
          gmailId = searchRes.data.messages[0].id;
        } else {
          results.skipped++;
          results.errors_detail.push(`${tx.id}: email no encontrado en Gmail (rfc822msgid:${tx.email_id})`);
          continue;
        }
      } catch (e) {
        if (e.message?.includes('invalid_grant')) {
          await clearTokens(userId);
          results.needsReauth = true;
          results.errors_detail.push('Token de Gmail expirado. Necesitas re-autenticar.');
          return results;
        }
        results.skipped++;
        results.errors_detail.push(`${tx.id}: error buscando en Gmail: ${e.message}`);
        continue;
      }
    }

    try {
      const fullMsg = await gmail.users.messages.get({
        userId: 'me',
        id: gmailId,
        format: 'full',
      });

      const headers = {};
      for (const h of fullMsg.data.payload.headers || []) {
        headers[h.name.toLowerCase()] = h.value;
      }

      const body = getEmailBody(fullMsg.data.payload);
      if (!body) { results.errors++; results.errors_detail.push(`${tx.id}: sin cuerpo HTML`); continue; }

      const parsed = await parseHTML(body, headers, userId);
      if (!parsed || !parsed.monto || !parsed.fecha) { results.errors++; results.errors_detail.push(`${tx.id}: parseo fallido`); continue; }

      await db.run(
        `UPDATE transacciones_extraidas SET
          banco = $1, tipo_movimiento = $2, tipo_tarjeta = $3, monto = $4,
          comercio = CASE WHEN transacciones_extraidas.revisado = FALSE THEN $5 ELSE transacciones_extraidas.comercio END,
          fecha = $6,
          categoria = CASE WHEN transacciones_extraidas.revisado = FALSE THEN $7 ELSE transacciones_extraidas.categoria END,
          tipo_transaccion = CASE WHEN transacciones_extraidas.revisado = FALSE THEN CAST($8 AS TEXT) ELSE transacciones_extraidas.tipo_transaccion END
         WHERE id = $9 AND user_id = $10 AND (revisado = FALSE OR revisado IS NULL)`,
        parsed.banco || 'Otros', parsed.tipo_movimiento, parsed.tipo_tarjeta || '', parsed.monto,
        parsed.comercio, parsed.fecha, parsed.categoria, parsed.tipo_transaccion_auto || 'gasto',
        tx.id, userId
      );

      results.processed++;
      results.updates.push({ id: tx.id, comercio: parsed.comercio, categoria: parsed.categoria, tipo: parsed.tipo_transaccion_auto });
      await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
      if (e.message?.includes('invalid_grant')) {
        await clearTokens(userId);
        results.needsReauth = true;
        results.errors_detail.push('Token de Gmail expirado. Necesitas re-autenticar.');
        return results;
      }
      results.errors++;
      results.errors_detail.push(`${tx.id}: ${e.message}`);
      console.error(`[Reprocess] Error en ${tx.id}: ${e.message}`);
    }
  }

  return results;
}

export { fetchLatestTransactions, getLastCheckTime, buildGmailQuery, reprocessPendingTransactions };
