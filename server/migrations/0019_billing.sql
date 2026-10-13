-- Cobro con Mercado Pago: una suscripcion por usuario, los avisos ya enviados
-- (para no repetir correos) y los eventos del webhook ya procesados.
CREATE TABLE IF NOT EXISTS suscripciones_pago (
  user_id TEXT PRIMARY KEY,
  plan TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente', -- pendiente | activa | pago_fallido | cancelada
  mp_preapproval_id TEXT,
  periodo_hasta TIMESTAMPTZ,
  creada_en TIMESTAMPTZ DEFAULT NOW(),
  actualizada_en TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_suscripciones_pago_mp ON suscripciones_pago (mp_preapproval_id);

CREATE TABLE IF NOT EXISTS billing_avisos (
  user_id TEXT NOT NULL,
  clave TEXT NOT NULL,
  enviado_en TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, clave)
);

CREATE TABLE IF NOT EXISTS billing_eventos (
  id TEXT PRIMARY KEY,
  recibido_en TIMESTAMPTZ DEFAULT NOW()
);

-- Quienes ya terminaron la configuracion del correo antes de existir la
-- prueba parten sus 60 dias hoy, en vez de quedar con acceso libre para siempre.
UPDATE users SET trial_started_at = NOW()
WHERE gmail_forwarding_authorized = TRUE AND trial_started_at IS NULL;
