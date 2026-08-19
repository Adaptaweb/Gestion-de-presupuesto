// Registro de trabajos.
//
// Sustituye a jobQueue.js, que lanzaba la funcion sin esperarla y respondia de
// inmediato. En un servidor con proceso vivo eso funciona; en Vercel la
// instancia se congela al devolver la respuesta y el trabajo quedaba en
// "running" para siempre. Su setInterval de limpieza tenia el mismo problema.
//
// Aqui el trabajo se ejecuta y se espera dentro de la peticion. La fila queda
// para que el cliente que consulta el estado reciba un resultado ya terminado.
//
// La ingesta de correo, que si es asincrona de verdad, va por Cloudflare Queues
// (ver cloudflare/email-worker.js), no por aqui.

import db from './db.js';
import { logDebug } from './logger.js';

let counter = 0;

export async function runJob(type, fn) {
  const id = `job-${Date.now()}-${++counter}`;

  try {
    const result = await fn();
    await db.run(
      `INSERT INTO jobs (id, type, status, result, done_at) VALUES (?, ?, 'done', ?, NOW())`,
      id, type, JSON.stringify(result ?? null)
    );
    logDebug(`[Jobs] ${type} ${id} completado`);
    return { id, status: 'done', result };
  } catch (err) {
    await db.run(
      `INSERT INTO jobs (id, type, status, error, done_at) VALUES (?, ?, 'error', ?, NOW())`,
      id, type, err.message || String(err)
    ).catch(() => {});
    throw err;
  } finally {
    // Purga oportunista en lugar de un temporizador que en serverless no corre.
    if (Math.random() < 0.05) {
      db.run(`DELETE FROM jobs WHERE created_at < NOW() - INTERVAL '1 day'`).catch(() => {});
    }
  }
}

export async function getJob(jobId) {
  const row = await db.get('SELECT * FROM jobs WHERE id = ?', jobId);
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    result: row.result ? JSON.parse(row.result) : null,
    error: row.error,
    doneAt: row.done_at ? new Date(row.done_at).getTime() : null,
  };
}
