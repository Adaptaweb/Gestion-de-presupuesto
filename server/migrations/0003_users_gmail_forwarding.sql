-- Marca si el usuario ya autorizo el reenvio desde Gmail.
ALTER TABLE users ADD COLUMN IF NOT EXISTS "gmail_forwarding_authorized" BOOLEAN DEFAULT FALSE;

-- Los usuarios que ya tienen filtros de correo configurados estaban autorizados
-- antes de que existiera la columna. Se salta el relleno si la tabla de filtros
-- todavia no existe.
DO $$
BEGIN
  IF to_regclass('public.filtros_correo') IS NOT NULL THEN
    UPDATE users SET gmail_forwarding_authorized = TRUE
    WHERE id IN (SELECT DISTINCT user_id FROM filtros_correo)
      AND (gmail_forwarding_authorized IS NULL OR gmail_forwarding_authorized = FALSE);
  END IF;
END $$;
