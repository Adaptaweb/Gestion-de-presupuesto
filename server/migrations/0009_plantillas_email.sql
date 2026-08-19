CREATE TABLE IF NOT EXISTS plantillas_email (
  id SERIAL PRIMARY KEY,
  banco TEXT NOT NULL,
  tipo_correo TEXT NOT NULL,
  fingerprint_hash TEXT NOT NULL,
  asunto_normalizado TEXT,
  estructura_html_hash TEXT,
  parser_nombre TEXT,
  count_uso INT DEFAULT 0,
  count_exitoso INT DEFAULT 0,
  count_fallido INT DEFAULT 0,
  ultimo_uso TIMESTAMP,
  ejemplo_html TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  extraccion_json TEXT DEFAULT '{}',
  from_pattern TEXT DEFAULT '%',
  prioridad INT DEFAULT 0,
  UNIQUE(banco, fingerprint_hash)
);

-- Columnas añadidas despues de la creacion original de la tabla.
ALTER TABLE plantillas_email ADD COLUMN IF NOT EXISTS extraccion_json TEXT DEFAULT '{}';
ALTER TABLE plantillas_email ADD COLUMN IF NOT EXISTS from_pattern TEXT DEFAULT '%';
ALTER TABLE plantillas_email ADD COLUMN IF NOT EXISTS prioridad INT DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_plantillas_banco ON plantillas_email(banco);
CREATE INDEX IF NOT EXISTS idx_plantillas_fingerprint ON plantillas_email(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_plantillas_lookup ON plantillas_email(banco, activo) INCLUDE (from_pattern, prioridad);
