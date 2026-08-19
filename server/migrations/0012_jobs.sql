-- Registro de trabajos. Antes se creaba en caliente desde jobQueue.js.
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  result TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  done_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_jobs_created ON jobs(created_at);
