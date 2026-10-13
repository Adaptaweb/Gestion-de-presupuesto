-- Inicio de la prueba gratuita de 60 dias: se fija al terminar la configuracion
-- del correo (cuando la app ya puede traer movimientos), no al crear la cuenta.
ALTER TABLE users ADD COLUMN IF NOT EXISTS "trial_started_at" TIMESTAMPTZ;
