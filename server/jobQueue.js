import db from './db.js';

let jobIdCounter = 0;
let tableEnsured = false;

async function ensureTable() {
  if (tableEnsured) return;
  try {
    await db.run(`CREATE TABLE IF NOT EXISTS "jobs" (
      "id" TEXT PRIMARY KEY,
      "type" TEXT NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "result" TEXT,
      "error" TEXT,
      "created_at" TIMESTAMP DEFAULT NOW(),
      "done_at" TIMESTAMP
    )`);
    tableEnsured = true;
  } catch (err) {
    console.error('[JobQueue] Table init error:', err.message);
  }
}

setInterval(async () => {
  try {
    await ensureTable();
    await db.run(`DELETE FROM "jobs" WHERE "done_at" IS NOT NULL AND "done_at" < NOW() - INTERVAL '5 minutes'`);
    await db.run(`DELETE FROM "jobs" WHERE "created_at" < NOW() - INTERVAL '1 hour'`);
  } catch (err) {
    console.error('[JobQueue] Cleanup error:', err.message);
  }
}, 60000);

export async function createJob(type, asyncFn) {
  await ensureTable();
  const id = `job-${Date.now()}-${++jobIdCounter}`;

  await db.run(
    `INSERT INTO "jobs" ("id", "type", "status") VALUES ($1, $2, $3)`,
    id, type, 'pending'
  );

  await db.run(`UPDATE "jobs" SET "status" = $1 WHERE "id" = $2`, 'running', id);

  asyncFn()
    .then(async (result) => {
      try {
        await db.run(
          `UPDATE "jobs" SET "status" = $1, "result" = $2, "done_at" = NOW() WHERE "id" = $3`,
          'done', JSON.stringify(result), id
        );
      } catch (err) {
        console.error('[JobQueue] Error saving job result:', err.message);
      }
    })
    .catch(async (err) => {
      try {
        await db.run(
          `UPDATE "jobs" SET "status" = $1, "error" = $2, "done_at" = NOW() WHERE "id" = $3`,
          'error', err.message || String(err), id
        );
      } catch (dbErr) {
        console.error('[JobQueue] Error saving job error:', dbErr.message);
      }
    });

  return { id };
}

export async function getJob(jobId) {
  await ensureTable();
  const row = await db.get(`SELECT * FROM "jobs" WHERE "id" = $1`, jobId);
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
