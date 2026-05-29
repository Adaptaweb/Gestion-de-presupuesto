import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.resolve(__dirname, '../data/datos.db');
const OUTPUT_DIR = path.resolve(__dirname, 'export-data');

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`Base de datos no encontrada: ${DB_PATH}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const db = new DatabaseSync(DB_PATH);

  const tables = [
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

  const manifest = { exported_at: new Date().toISOString(), tables: {} };

  for (const table of tables) {
    try {
      const rows = db.prepare(`SELECT * FROM ${table}`).all();
      const filePath = path.join(OUTPUT_DIR, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(rows, null, 2));
      manifest.tables[table] = { rows: rows.length, file: `${table}.json` };
      console.log(`  ${table}: ${rows.length} registros exportados`);
    } catch (e) {
      console.log(`  ${table}: NO EXPORTADA (${e.message})`);
      manifest.tables[table] = { rows: 0, file: `${table}.json`, error: e.message };
    }
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, '_manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  db.close();

  const total = Object.values(manifest.tables).reduce((s, t) => s + t.rows, 0);
  console.log(`\nExportacion completada: ${total} registros en ${tables.length} tablas`);
  console.log(`Directorio: ${OUTPUT_DIR}`);
}

main().catch(console.error);
