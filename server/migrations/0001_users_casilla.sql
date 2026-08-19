-- Casilla de correo por usuario (parse+<casilla>@adaptaweb.cl).
ALTER TABLE users ADD COLUMN IF NOT EXISTS "casilla" TEXT UNIQUE DEFAULT NULL;
