-- ============================================================
-- SCHEMA MIGRATION: SQLite -> PostgreSQL (Supabase)
-- Execute this in the Supabase SQL Editor
-- ============================================================

DROP TABLE IF EXISTS clasificacion_comercios CASCADE;
DROP TABLE IF EXISTS config_extraccion CASCADE;
DROP TABLE IF EXISTS filtros_correo CASCADE;
DROP TABLE IF EXISTS gmail_tokens CASCADE;
DROP TABLE IF EXISTS transacciones_extraidas CASCADE;
DROP TABLE IF EXISTS pagos_abonos CASCADE;
DROP TABLE IF EXISTS abonos CASCADE;
DROP TABLE IF EXISTS pagos_suscripciones CASCADE;
DROP TABLE IF EXISTS suscripciones CASCADE;
DROP TABLE IF EXISTS ahorros_data CASCADE;
DROP TABLE IF EXISTS cuentas_ahorro CASCADE;
DROP TABLE IF EXISTS sueldos CASCADE;
DROP TABLE IF EXISTS pagos_gastos CASCADE;
DROP TABLE IF EXISTS gastos_fijos CASCADE;
DROP TABLE IF EXISTS pagos_deudas CASCADE;
DROP TABLE IF EXISTS deudas CASCADE;
DROP TABLE IF EXISTS meses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  blocked INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (NOW())
);

CREATE TABLE meses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mes TEXT NOT NULL
);
CREATE INDEX idx_meses_user_id ON meses(user_id);

CREATE TABLE deudas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion TEXT,
  cuotasTotales INTEGER,
  valorCuota INTEGER,
  mesInicio TEXT,
  isContribuciones INTEGER,
  diaPago INTEGER DEFAULT 1,
  facturacionAuto INTEGER DEFAULT 0,
  banco TEXT DEFAULT '',
  bancoLogo TEXT DEFAULT '',
  tipoTarjeta TEXT DEFAULT '',
  iconType TEXT DEFAULT 'default',
  iconValue TEXT DEFAULT 'layout',
  iconUrl TEXT DEFAULT ''
);
CREATE INDEX idx_deudas_user_id ON deudas(user_id);

CREATE TABLE pagos_deudas (
  deuda_id TEXT NOT NULL REFERENCES deudas(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  estado TEXT,
  PRIMARY KEY (deuda_id, mes)
);

CREATE TABLE gastos_fijos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion TEXT,
  diaPago INTEGER DEFAULT 1,
  facturacionAuto INTEGER DEFAULT 0,
  iconType TEXT,
  iconValue TEXT,
  iconUrl TEXT
);
CREATE INDEX idx_gastos_fijos_user_id ON gastos_fijos(user_id);

CREATE TABLE pagos_gastos (
  gasto_id TEXT NOT NULL REFERENCES gastos_fijos(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  monto INTEGER,
  estado TEXT,
  PRIMARY KEY (gasto_id, mes)
);

CREATE TABLE sueldos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  monto INTEGER
);
CREATE INDEX idx_sueldos_user_id ON sueldos(user_id);

CREATE TABLE cuentas_ahorro (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nombre TEXT,
  banco TEXT
);
CREATE INDEX idx_cuentas_ahorro_user_id ON cuentas_ahorro(user_id);

CREATE TABLE ahorros_data (
  id TEXT PRIMARY KEY,
  cuenta_id TEXT REFERENCES cuentas_ahorro(id) ON DELETE CASCADE,
  mes TEXT,
  deposito INTEGER,
  gasto INTEGER
);
CREATE INDEX idx_ahorros_data_cuenta_id ON ahorros_data(cuenta_id);

CREATE TABLE suscripciones (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion TEXT,
  valor INTEGER,
  billingCycle TEXT,
  diaPago INTEGER,
  mesInicio TEXT,
  durationYears INTEGER,
  iconType TEXT,
  iconValue TEXT,
  iconUrl TEXT
);
CREATE INDEX idx_suscripciones_user_id ON suscripciones(user_id);

CREATE TABLE pagos_suscripciones (
  suscripcion_id TEXT NOT NULL REFERENCES suscripciones(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  monto INTEGER,
  estado TEXT,
  PRIMARY KEY (suscripcion_id, mes)
);

CREATE TABLE abonos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  descripcion TEXT,
  diaPago INTEGER DEFAULT 1,
  facturacionAuto INTEGER DEFAULT 0,
  iconType TEXT,
  iconValue TEXT,
  iconUrl TEXT
);
CREATE INDEX idx_abonos_user_id ON abonos(user_id);

CREATE TABLE pagos_abonos (
  abono_id TEXT NOT NULL REFERENCES abonos(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  monto INTEGER,
  estado TEXT,
  PRIMARY KEY (abono_id, mes)
);

CREATE TABLE transacciones_extraidas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  banco TEXT,
  tipo_movimiento TEXT,
  tipo_tarjeta TEXT DEFAULT '',
  monto DOUBLE PRECISION,
  comercio TEXT,
  fecha TEXT,
  categoria TEXT,
  asunto TEXT DEFAULT '',
  email_id TEXT UNIQUE,
  fecha_extraccion TEXT DEFAULT (NOW())
);
CREATE INDEX idx_transacciones_user_id ON transacciones_extraidas(user_id);
CREATE INDEX idx_transacciones_fecha ON transacciones_extraidas(fecha);
CREATE INDEX idx_transacciones_categoria ON transacciones_extraidas(categoria);

CREATE TABLE gmail_tokens (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  scope TEXT,
  token_type TEXT,
  expiry_date INTEGER
);

CREATE TABLE filtros_correo (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  remitente TEXT NOT NULL,
  asunto TEXT,
  created_at TEXT DEFAULT (NOW())
);
CREATE INDEX idx_filtros_correo_user_id ON filtros_correo(user_id);

CREATE TABLE config_extraccion (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  dias_atras INTEGER DEFAULT 3
);

CREATE TABLE clasificacion_comercios (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comercio TEXT NOT NULL,
  categoria TEXT NOT NULL,
  updated_at TEXT DEFAULT (NOW()),
  PRIMARY KEY (user_id, comercio)
);
