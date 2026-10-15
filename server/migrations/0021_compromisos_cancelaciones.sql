-- Periodos en que una suscripcion estuvo cancelada: [{ desde, hasta }], con
-- hasta null mientras siga cancelada. Antes solo vivian en el cliente y se
-- perdian al recargar, asi que la suscripcion volvia a aparecer activa.
ALTER TABLE compromisos ADD COLUMN IF NOT EXISTS cancelaciones JSONB;
