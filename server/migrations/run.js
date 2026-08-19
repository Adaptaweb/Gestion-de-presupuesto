// Ejecutor de migraciones.
//
// Sustituye a los runOnce() que corrian al importar server/app.js. Aquel
// esquema tenia dos problemas: se disparaba en cada arranque en frio de la
// funcion serverless, varios a la vez y sin esperarse entre si, y registraba la
// migracion como aplicada ANTES de ejecutarla, asi que un fallo la marcaba como
// hecha para siempre.
//
// Aqui las migraciones se aplican en orden, una a una, cada una en su propia
// transaccion, y solo se registran despues de completarse. Todo el DDL es
// idempotente, asi que volver a pasar el ejecutor sobre una base de datos ya
// migrada es seguro y repara las migraciones que el sistema anterior dio por
// aplicadas sin llegar a ejecutar.
//
// Uso: npm run migrate

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const { default: db } = await import('../db.js');

async function ensureTable() {
  await db.run(`CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_ms INTEGER
  )`);
}

async function appliedNames() {
  const rows = await db.all('SELECT name FROM schema_migrations');
  return new Set(rows.map(r => r.name));
}

async function listMigrations() {
  const entries = await fs.readdir(__dirname);
  return entries
    .filter(f => (f.endsWith('.sql') || f.endsWith('.js')) && f !== 'run.js')
    .sort();
}

async function applySql(name) {
  const sql = await fs.readFile(path.join(__dirname, name), 'utf8');
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function applyJs(name) {
  const mod = await import(pathToFileURL(path.join(__dirname, name)).href);
  if (typeof mod.default !== 'function') {
    throw new Error(`${name} no exporta una funcion por defecto`);
  }
  return mod.default(db);
}

async function main() {
  await ensureTable();

  const done = await appliedNames();
  const all = await listMigrations();
  const pending = all.filter(n => !done.has(n));

  if (pending.length === 0) {
    console.log(`[migrate] Sin migraciones pendientes (${all.length} aplicadas).`);
    return;
  }

  console.log(`[migrate] ${pending.length} migracion(es) pendiente(s) de ${all.length}.`);

  for (const name of pending) {
    const started = Date.now();
    process.stdout.write(`[migrate] ${name} ... `);
    try {
      const note = name.endsWith('.sql') ? await applySql(name) : await applyJs(name);
      const ms = Date.now() - started;
      await db.run(
        'INSERT INTO schema_migrations (name, duration_ms) VALUES (?, ?) ON CONFLICT (name) DO NOTHING',
        name, ms
      );
      console.log(`ok (${ms} ms)${note ? ` — ${note}` : ''}`);
    } catch (err) {
      console.log('FALLO');
      console.error(`[migrate] ${name}: ${err.message}`);
      throw err;
    }
  }

  console.log('[migrate] Completado.');
}

try {
  await main();
  await db.pool.end();
  process.exit(0);
} catch (err) {
  console.error('[migrate] Abortado:', err.message);
  await db.pool.end().catch(() => {});
  process.exit(1);
}
