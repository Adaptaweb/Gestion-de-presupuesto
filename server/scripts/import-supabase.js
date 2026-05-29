import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DATA_DIR = path.resolve(__dirname, 'export-data');
let DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL no definida en .env');
  console.error('Agrega: DATABASE_URL=postgresql://...');
  process.exit(1);
}

DATABASE_URL = DATABASE_URL.replace(
  /(?<=:\/\/[^:]+:)([^@]*)(?=@)/,
  (pw) => encodeURIComponent(decodeURIComponent(pw))
);

async function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`No se encuentra el directorio de datos: ${DATA_DIR}`);
    console.error('Ejecuta primero: node server/scripts/export-sqlite.js');
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    max: 1,
    idleTimeoutMillis: 0,
  });

  const tablesOrdered = [
    'users',
    'meses',
    'deudas',
    'pagos_deudas',
    'gastos_fijos',
    'pagos_gastos',
    'sueldos',
    'cuentas_ahorro',
    'ahorros_data',
    'suscripciones',
    'pagos_suscripciones',
    'abonos',
    'pagos_abonos',
    'transacciones_extraidas',
    'gmail_tokens',
    'filtros_correo',
    'config_extraccion',
    'clasificacion_comercios',
  ];

  for (const table of tablesOrdered) {
    const filePath = path.join(DATA_DIR, `${table}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ${table}: archivo no encontrado, se omite`);
      continue;
    }

    const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (rows.length === 0) {
      console.log(`  ${table}: 0 registros, se omite`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const cols = columns.map(c => `"${c}"`).join(', ');

    const insertSQL = `INSERT INTO "${table}" (${cols}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`;

    const client = await pool.connect();
    try {
      let imported = 0;
      for (const row of rows) {
        const values = columns.map(c => row[c] ?? null);
        try {
          await client.query(insertSQL, values);
          imported++;
        } catch (e) {
          console.error(`    Error en ${table}: ${e.message.slice(0, 120)}`);
        }
      }
      console.log(`  ${table}: ${imported}/${rows.length} registros importados`);
    } finally {
      client.release();
    }
  }

  await pool.end();

  console.log('\nImportacion completada. Revisa los mensajes de error arriba si los hay.');
}

main().catch((e) => {
  console.error('Error fatal:', e.message || e);
  process.exit(1);
});
