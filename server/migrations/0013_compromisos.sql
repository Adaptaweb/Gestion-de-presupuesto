-- Tabla unica para deudas, gastos fijos, suscripciones y abonos.
--
-- Las cuatro eran estructuras casi identicas con su propia tabla de pagos.
-- Esa duplicacion es la razon de que /api/sync y el Dashboard tengan cuatro
-- caminos paralelos para la misma operacion.
--
-- Las tablas antiguas NO se tocan en esta migracion. La copia de datos va en
-- 0014 y el borrado, si llega, en una migracion posterior una vez verificado.

CREATE TABLE IF NOT EXISTS compromisos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('cuota', 'fijo', 'suscripcion', 'abono')),

  descripcion TEXT,
  "diaPago" INTEGER DEFAULT 1,
  "facturacionAuto" BOOLEAN DEFAULT FALSE,
  "iconType" TEXT DEFAULT 'default',
  "iconValue" TEXT DEFAULT 'layout',
  "iconUrl" TEXT DEFAULT '',

  -- Solo cuotas
  "cuotasTotales" INTEGER,
  "valorCuota" INTEGER,
  "isContribuciones" BOOLEAN DEFAULT FALSE,
  banco TEXT DEFAULT '',
  "bancoLogo" TEXT DEFAULT '',
  "tipoTarjeta" TEXT DEFAULT '',

  -- Solo suscripciones
  valor INTEGER,
  "billingCycle" TEXT,
  "durationYears" INTEGER,

  -- Cuotas y suscripciones
  "mesInicio" TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS pagos (
  compromiso_id TEXT NOT NULL REFERENCES compromisos(id) ON DELETE CASCADE,
  mes TEXT NOT NULL,
  monto INTEGER,
  estado TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (compromiso_id, mes)
);

CREATE INDEX IF NOT EXISTS idx_compromisos_user ON compromisos(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_compromisos_user_tipo ON compromisos(user_id, tipo) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_pagos_mes ON pagos(mes);

-- meses se sincronizaba borrando todo y reinsertando por (user_id, mes), con un
-- id derivado de la posicion en el array. Al pasar a upsert hace falta una
-- clave real sobre (user_id, mes); antes se limpian los duplicados que ese
-- esquema pudiera haber dejado, conservando la fila viva.
DELETE FROM meses a
USING meses b
WHERE a.user_id = b.user_id
  AND a.mes = b.mes
  AND a.id <> b.id
  AND (a.deleted_at IS NOT NULL AND b.deleted_at IS NULL
       OR a.deleted_at IS NOT DISTINCT FROM b.deleted_at AND a.id > b.id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_meses_user_mes ON meses(user_id, mes);
