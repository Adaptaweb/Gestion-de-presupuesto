CREATE TABLE IF NOT EXISTS parsing_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  email_id TEXT,
  banco_detectado TEXT,
  fingerprint_hash TEXT,
  parsing_exitoso BOOLEAN DEFAULT FALSE,
  campos_extraidos JSONB,
  confianza_score REAL DEFAULT 0,
  metodo_extraccion TEXT,
  openrouter_fallback BOOLEAN DEFAULT FALSE,
  usuario_corrijo BOOLEAN DEFAULT FALSE,
  correccion_categoria TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parsing_logs_user ON parsing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_parsing_logs_fingerprint ON parsing_logs(fingerprint_hash);
