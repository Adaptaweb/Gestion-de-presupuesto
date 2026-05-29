import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

if (!process.env.DATABASE_URL) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL no definida');
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
      const result = await callback(client);
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
