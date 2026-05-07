import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'datos.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA foreign_keys = ON;');

const initDb = () => {
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all().map(t => t.name);
  const needsMigration = tables.includes('deudas') && !tables.includes('users');

  if (needsMigration) {
    try {
      db.exec(`
        ALTER TABLE deudas RENAME TO deudas_old;
        ALTER TABLE pagos_deudas RENAME TO pagos_deudas_old;
        ALTER TABLE gastos_fijos RENAME TO gastos_fijos_old;
        ALTER TABLE pagos_gastos RENAME TO pagos_gastos_old;
        ALTER TABLE sueldos RENAME TO sueldos_old;
        ALTER TABLE cuentas_ahorro RENAME TO cuentas_ahorro_old;
        ALTER TABLE ahorros_data RENAME TO ahorros_data_old;
        ALTER TABLE meses RENAME TO meses_old;
      `);
    } catch(e) {}
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      blocked INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mes TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS deudas (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      descripcion TEXT,
      cuotasTotales INTEGER,
      valorCuota INTEGER,
      mesInicio TEXT,
      isContribuciones INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pagos_deudas (
      deuda_id TEXT,
      mes TEXT,
      estado TEXT,
      PRIMARY KEY (deuda_id, mes),
      FOREIGN KEY (deuda_id) REFERENCES deudas(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS gastos_fijos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      descripcion TEXT,
      iconType TEXT,
      iconValue TEXT,
      iconUrl TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pagos_gastos (
      gasto_id TEXT,
      mes TEXT,
      monto INTEGER,
      estado TEXT,
      PRIMARY KEY (gasto_id, mes),
      FOREIGN KEY (gasto_id) REFERENCES gastos_fijos(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sueldos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mes TEXT NOT NULL,
      monto INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cuentas_ahorro (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      nombre TEXT,
      banco TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ahorros_data (
      id TEXT PRIMARY KEY,
      cuenta_id TEXT,
      mes TEXT,
      deposito INTEGER,
      gasto INTEGER,
      FOREIGN KEY (cuenta_id) REFERENCES cuentas_ahorro(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS suscripciones (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      descripcion TEXT,
      valor INTEGER,
      billingCycle TEXT,
      diaPago INTEGER,
      mesInicio TEXT,
      durationYears INTEGER,
      iconType TEXT,
      iconValue TEXT,
      iconUrl TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pagos_suscripciones (
      suscripcion_id TEXT,
      mes TEXT,
      monto INTEGER,
      estado TEXT,
      PRIMARY KEY (suscripcion_id, mes),
      FOREIGN KEY (suscripcion_id) REFERENCES suscripciones(id) ON DELETE CASCADE
    );
  `);

  try {
    db.exec(`ALTER TABLE users ADD COLUMN blocked INTEGER DEFAULT 0;`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE deudas ADD COLUMN diaPago INTEGER DEFAULT 1;`);
    db.exec(`ALTER TABLE deudas ADD COLUMN facturacionAuto INTEGER DEFAULT 0;`);
    db.exec(`ALTER TABLE deudas ADD COLUMN banco TEXT DEFAULT '';`);
    db.exec(`ALTER TABLE deudas ADD COLUMN bancoLogo TEXT DEFAULT '';`);
    db.exec(`ALTER TABLE deudas ADD COLUMN tipoTarjeta TEXT DEFAULT '';`);
    db.exec(`ALTER TABLE deudas ADD COLUMN iconType TEXT DEFAULT 'default';`);
    db.exec(`ALTER TABLE deudas ADD COLUMN iconValue TEXT DEFAULT 'layout';`);
    db.exec(`ALTER TABLE deudas ADD COLUMN iconUrl TEXT DEFAULT '';`);
  } catch (e) {}

  try {
    db.exec(`ALTER TABLE gastos_fijos ADD COLUMN diaPago INTEGER DEFAULT 1;`);
    db.exec(`ALTER TABLE gastos_fijos ADD COLUMN facturacionAuto INTEGER DEFAULT 0;`);
  } catch (e) {}

  // Fix: Recreate gastos_fijos table if column count is wrong
  try {
    const gastosCols = db.prepare(`PRAGMA table_info(gastos_fijos)`).all();
    if (gastosCols.length !== 8) {
      console.log('Fixing gastos_fijos table schema. Current columns:', gastosCols.length);
      try {
        db.exec(`ALTER TABLE gastos_fijos RENAME TO gastos_fijos_old;`);
        
        db.exec(`
          CREATE TABLE gastos_fijos (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            descripcion TEXT,
            diaPago INTEGER DEFAULT 1,
            facturacionAuto INTEGER DEFAULT 0,
            iconType TEXT,
            iconValue TEXT,
            iconUrl TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          );
        `);
        
        try {
          db.exec(`
            INSERT INTO gastos_fijos SELECT id, user_id, descripcion, 
              COALESCE(diaPago, 1), COALESCE(facturacionAuto, 0), COALESCE(iconType, 'preset'), COALESCE(iconValue, 'layout'), COALESCE(iconUrl, '')
            FROM gastos_fijos_old;
          `);
        } catch(e) {
          console.log('Could not migrate old gastos_fijos data, starting fresh');
        }
        
        try {
          db.exec(`DROP TABLE gastos_fijos_old;`);
        } catch(e) {}
        
        console.log('gastos_fijos table fixed successfully');
      } catch(e) {
        console.error('Error fixing gastos_fijos table:', e);
      }
    }
  } catch(e) {
    console.log('gastos_fijos table does not exist yet');
  }

  if (needsMigration) {
    try {
      const adminId = 'admin-legacy-001';
      db.prepare("INSERT OR IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)").run(
        adminId, 'Administrador', 'admin@local.com', '$2b$10$X7JqZ9qZ9qZ9qZ9qZ9qZ9uX7JqZ9qZ9qZ9qZ9qZ9qZ9qZ9qZ9qZ9', 'admin'
      );

      const oldMonths = db.prepare('SELECT mes FROM meses_old').all();
      const insertMonth = db.prepare('INSERT OR IGNORE INTO meses (id, user_id, mes) VALUES (?, ?, ?)');
      oldMonths.forEach((m, i) => insertMonth.run(`legacy-month-${i}`, adminId, m.mes));

      const oldDeudas = db.prepare('SELECT * FROM deudas_old').all();
      const insertDeuda = db.prepare('INSERT INTO deudas (id, user_id, descripcion, cuotasTotales, valorCuota, mesInicio, isContribuciones) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const insertPagoDeuda = db.prepare('INSERT OR IGNORE INTO pagos_deudas (deuda_id, mes, estado) VALUES (?, ?, ?)');
      oldDeudas.forEach(d => {
        insertDeuda.run(d.id, adminId, d.descripcion, d.cuotasTotales, d.valorCuota, d.mesInicio, d.isContribuciones);
      });
      const oldPagosDeudas = db.prepare('SELECT * FROM pagos_deudas_old').all();
      oldPagosDeudas.forEach(p => insertPagoDeuda.run(p.deuda_id, p.mes, p.estado));

      const oldGastos = db.prepare('SELECT * FROM gastos_fijos_old').all();
      const insertGasto = db.prepare('INSERT INTO gastos_fijos (id, user_id, descripcion, iconType, iconValue, iconUrl) VALUES (?, ?, ?, ?, ?, ?)');
      const insertPagoGasto = db.prepare('INSERT OR IGNORE INTO pagos_gastos (gasto_id, mes, monto, estado) VALUES (?, ?, ?, ?)');
      oldGastos.forEach(g => {
        insertGasto.run(g.id, adminId, g.descripcion, g.iconType, g.iconValue, g.iconUrl);
      });
      const oldPagosGastos = db.prepare('SELECT * FROM pagos_gastos_old').all();
      oldPagosGastos.forEach(p => insertPagoGasto.run(p.gasto_id, p.mes, p.monto, p.estado));

      const oldSueldos = db.prepare('SELECT * FROM sueldos_old').all();
      const insertSueldo = db.prepare('INSERT INTO sueldos (id, user_id, mes, monto) VALUES (?, ?, ?, ?)');
      oldSueldos.forEach((s, i) => insertSueldo.run(`legacy-sueldo-${i}`, adminId, s.mes, s.monto));

      const oldCuentas = db.prepare('SELECT * FROM cuentas_ahorro_old').all();
      const insertCuenta = db.prepare('INSERT INTO cuentas_ahorro (id, user_id, nombre, banco) VALUES (?, ?, ?, ?)');
      oldCuentas.forEach(c => insertCuenta.run(c.id, adminId, c.nombre, c.banco));

      const oldAhorros = db.prepare('SELECT * FROM ahorros_data_old').all();
      const insertAhorro = db.prepare('INSERT INTO ahorros_data (id, cuenta_id, mes, deposito, gasto) VALUES (?, ?, ?, ?, ?)');
      oldAhorros.forEach((a, i) => insertAhorro.run(`legacy-ahorro-${i}`, a.cuenta_id, a.mes, a.deposito, a.gasto));

      db.exec(`
        DROP TABLE IF EXISTS meses_old;
        DROP TABLE IF EXISTS deudas_old;
        DROP TABLE IF EXISTS pagos_deudas_old;
        DROP TABLE IF EXISTS gastos_fijos_old;
        DROP TABLE IF EXISTS pagos_gastos_old;
        DROP TABLE IF EXISTS sueldos_old;
        DROP TABLE IF EXISTS cuentas_ahorro_old;
        DROP TABLE IF EXISTS ahorros_data_old;
      `);
    } catch(e) {
      console.error('Migration error:', e);
    }
  }
};

  initDb();

  // Fix: If there's a schema error, delete and recreate DB
  try {
    const deudasCols = db.prepare(`PRAGMA table_info(deudas)`).all();
    if (deudasCols.length !== 15) {
      console.log('Schema mismatch detected, deleting and recreating database...');
      db.close();
      fs.unlinkSync(dbPath);
      // Reinitialize
      const newDb = new DatabaseSync(dbPath);
      db = newDb;
      initDb();
      console.log('Database recreated successfully');
    }
  } catch(e) {
    console.log('Schema check failed, deleting and recreating database...');
    try { db.close(); } catch(e) {}
    try { fs.unlinkSync(dbPath); } catch(e) {}
    const newDb = new DatabaseSync(dbPath);
    db = newDb;
    initDb();
    console.log('Database recreated successfully');
  }

  export default db;
