-- Ahorro automatico: la cuenta recibe un deposito fijo cada mes desde
-- auto_desde (mes en formato "Octubre 2026"). Solo estas cuentas entran en la
-- proyeccion de ahorro del Resumen.
ALTER TABLE cuentas_ahorro ADD COLUMN IF NOT EXISTS automatico BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE cuentas_ahorro ADD COLUMN IF NOT EXISTS monto_automatico BIGINT NOT NULL DEFAULT 0;
ALTER TABLE cuentas_ahorro ADD COLUMN IF NOT EXISTS auto_desde TEXT;
