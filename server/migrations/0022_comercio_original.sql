-- Texto del comercio tal como lo trae el banco ("PAYU *UBER TRIP CL"). La
-- columna comercio pasa a ser el nombre legible ("Uber"). Las filas existentes
-- quedan con NULL hasta que se aplique la limpieza desde el panel de admin.
ALTER TABLE transacciones_extraidas ADD COLUMN IF NOT EXISTS comercio_original TEXT;

-- Nombres que cada usuario le puso a un texto del banco: se aplican solos a los
-- movimientos que lleguen despues con ese mismo texto (o uno casi igual).
CREATE TABLE IF NOT EXISTS alias_comercios (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clave TEXT NOT NULL,
  original TEXT NOT NULL,
  nombre TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, clave)
);
