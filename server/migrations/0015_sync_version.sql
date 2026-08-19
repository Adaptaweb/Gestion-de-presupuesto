-- Control de concurrencia optimista para /api/sync.
--
-- El cliente envia la version que tenia al cargar. Si otra pestana o dispositivo
-- guardo mientras tanto, la version ya no coincide y el guardado se rechaza en
-- vez de pisar los cambios del otro en silencio.
ALTER TABLE users ADD COLUMN IF NOT EXISTS "sync_version" INTEGER NOT NULL DEFAULT 0;
