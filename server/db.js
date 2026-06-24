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

const DEFAULT_CATEGORIES = [
  { nombre: 'Casa y cuentas', color_hex: '#d97706', emoji: '🏠', tipo: 'gasto', orden: 0 },
  { nombre: 'Mercadería', color_hex: '#ea580c', emoji: '🛒', tipo: 'gasto', orden: 1 },
  { nombre: 'Gustitos', color_hex: '#e11d48', emoji: '🍻', tipo: 'gasto', orden: 2 },
  { nombre: 'Transporte', color_hex: '#2563eb', emoji: '🚗', tipo: 'gasto', orden: 3 },
  { nombre: 'Compras', color_hex: '#db2777', emoji: '🛍️', tipo: 'gasto', orden: 4 },
  { nombre: 'Salud y deportes', color_hex: '#16a34a', emoji: '❤️', tipo: 'gasto', orden: 5 },
  { nombre: 'Educación', color_hex: '#7c3aed', emoji: '🎓', tipo: 'gasto', orden: 6 },
  { nombre: 'Suscripciones', color_hex: '#4f46e5', emoji: '📱', tipo: 'gasto', orden: 7 },
  { nombre: 'Viajes y vacaciones', color_hex: '#06b6d4', emoji: '🏖️', tipo: 'gasto', orden: 8 },
  { nombre: 'Donaciones y regalos', color_hex: '#c026d3', emoji: '🎁', tipo: 'gasto', orden: 9 },
  { nombre: 'Gastos bancarios', color_hex: '#78716c', emoji: '🏦', tipo: 'gasto', orden: 10 },
  { nombre: 'Créditos de consumo', color_hex: '#dc2626', emoji: '💸', tipo: 'gasto', orden: 11 },
  { nombre: 'Juegos', color_hex: '#9333ea', emoji: '🎮', tipo: 'gasto', orden: 12 },
  { nombre: 'Otros', color_hex: '#64748b', emoji: '👤', tipo: 'gasto', orden: 13 },
  { nombre: 'Sueldo', color_hex: '#65a30d', emoji: '💰', tipo: 'ingreso', orden: 0 },
  { nombre: 'Inversiones / Renta', color_hex: '#059669', emoji: '📈', tipo: 'ingreso', orden: 1 },
  { nombre: 'Otros ingresos', color_hex: '#0d9488', emoji: '💲', tipo: 'ingreso', orden: 2 },
  { nombre: 'Ahorro', color_hex: '#059669', emoji: '🐷', tipo: 'ambos', orden: 0 },
  { nombre: 'Intereses', color_hex: '#0284c7', emoji: '%', tipo: 'ambos', orden: 1 },
  { nombre: 'Sin categoría', color_hex: '#71717a', emoji: '➖', tipo: 'ambos', orden: 2 },
];

async function ensureCategoriasTable() {
  await db.run(`CREATE TABLE IF NOT EXISTS categorias (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    nombre TEXT NOT NULL,
    color_hex TEXT NOT NULL DEFAULT '#64748b',
    emoji TEXT NOT NULL DEFAULT '📦',
    tipo TEXT NOT NULL DEFAULT 'ambos',
    orden INTEGER NOT NULL DEFAULT 0,
    activo INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, nombre)
  )`);
}

async function seedDefaultCategorias(userId) {
  const existing = await db.get('SELECT 1 FROM categorias WHERE user_id = ? LIMIT 1', userId);
  if (existing) return;

  for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
    const cat = DEFAULT_CATEGORIES[i];
    const id = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}-${i}`;
    await db.run(
      `INSERT INTO categorias (id, user_id, nombre, color_hex, emoji, tipo, orden)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      id, userId, cat.nombre, cat.color_hex, cat.emoji, cat.tipo, cat.orden
    );
  }
}

async function normalizeUserOrden(userId) {
  const cats = await db.all(
    'SELECT id, orden FROM categorias WHERE user_id = ? ORDER BY orden ASC, nombre ASC',
    userId
  );
  let changed = false;
  for (let i = 0; i < cats.length; i++) {
    if (cats[i].orden !== i) {
      await db.run('UPDATE categorias SET orden = ? WHERE id = ?', i, cats[i].id);
      changed = true;
    }
  }
  if (changed) console.log(`[NORMALIZE] Global orden reassigned for user ${userId}`);
}

async function reassignOrphanTransactions(userId) {
  const txRows = await db.all(
    'SELECT DISTINCT categoria FROM transacciones_extraidas WHERE user_id = ? AND categoria IS NOT NULL',
    userId
  );
  const catRows = await db.all(
    'SELECT nombre FROM categorias WHERE user_id = ?',
    userId
  );
  const catNames = new Set(catRows.map(c => c.nombre));

  for (const { categoria } of txRows) {
    if (catNames.has(categoria)) continue;
    const firstWord = categoria.split(' ')[0];
    const match = catRows.find(c =>
      c.nombre.includes(categoria) ||
      categoria.includes(c.nombre) ||
      (c.nombre.includes(firstWord) && firstWord.length > 2)
    );
    if (match) {
      await db.run(
        'UPDATE transacciones_extraidas SET categoria = ? WHERE user_id = ? AND categoria = ?',
        match.nombre, userId, categoria
      );
      console.log(`[REASSIGN] user=${userId}: "${categoria}" → "${match.nombre}"`);
    }
  }
}

export { DEFAULT_CATEGORIES, ensureCategoriasTable, seedDefaultCategorias, normalizeUserOrden, reassignOrphanTransactions };
export default db;
