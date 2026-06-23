import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

if (!process.env.DATABASE_URL) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

let DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL no definida');
}

// Supabase pooler: 5432 = session mode, 6543 = transaction mode
// Transaction mode libera la conexión tras cada query, esencial para serverless
DATABASE_URL = DATABASE_URL.replace(':5432/', ':6543/');
if (!DATABASE_URL.includes('pgbouncer=true')) {
  DATABASE_URL += (DATABASE_URL.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 5000,
});

function toPgParams(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

const db = {
  all: async (sql, ...params) => {
    const res = await pool.query(toPgParams(sql), params);
    return res.rows;
  },

  get: async (sql, ...params) => {
    const res = await pool.query(toPgParams(sql), params);
    return res.rows[0] || null;
  },

  run: async (sql, ...params) => {
    const res = await pool.query(toPgParams(sql), params);
    return { changes: res.rowCount };
  },

  exec: async (sql) => {
    await pool.query(sql);
  },

  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const tx = {
        run: async (sql, ...params) => {
          const res = await client.query(toPgParams(sql), params);
          return { changes: res.rowCount };
        },
        get: async (sql, ...params) => {
          const res = await client.query(toPgParams(sql), params);
          return res.rows[0] || null;
        },
        all: async (sql, ...params) => {
          const res = await client.query(toPgParams(sql), params);
          return res.rows;
        },
      };
      const result = await callback(tx);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  pool,
};

export default db;
