-- Marca de ultima escritura por compromiso, para escrituras por recurso.
ALTER TABLE compromisos ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ DEFAULT NOW();
