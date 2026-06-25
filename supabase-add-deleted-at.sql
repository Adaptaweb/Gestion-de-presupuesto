-- ============================================================
-- MIGRATION: Add soft delete (deleted_at) to all tables
-- Execute this in the Supabase SQL Editor
-- ============================================================

-- Add deleted_at column to all tables
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "meses" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "deudas" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "pagos_deudas" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "gastos_fijos" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "pagos_gastos" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "sueldos" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "cuentas_ahorro" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "ahorros_data" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "suscripciones" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "pagos_suscripciones" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "abonos" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "pagos_abonos" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "transacciones_extraidas" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "gmail_tokens" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "filtros_correo" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "config_extraccion" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "jobs" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE "clasificacion_comercios" ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ DEFAULT NULL;

-- Note: categorias table is created by the app, not in this schema
-- It will be handled when the app creates it

-- ============================================================
-- RLS POLICIES (already created in previous migration, but adding policies for deleted_at visibility)
-- ============================================================

-- Make sure RLS is enabled on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "meses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "deudas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pagos_deudas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gastos_fijos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pagos_gastos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sueldos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cuentas_ahorro" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ahorros_data" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "suscripciones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pagos_suscripciones" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "abonos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pagos_abonos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transacciones_extraidas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gmail_tokens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "filtros_correo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "config_extraccion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clasificacion_comercios" ENABLE ROW LEVEL SECURITY;

-- Force RLS for sensitive tables
ALTER TABLE "users" FORCE ROW LEVEL SECURITY;
ALTER TABLE "gmail_tokens" FORCE ROW LEVEL SECURITY;

-- ============================================================
-- UPDATE EXISTING POLICIES to filter deleted records
-- ============================================================

-- Drop existing policies and recreate with deleted_at filter

-- users policies
DROP POLICY IF EXISTS "users_select_own" ON "users";
CREATE POLICY "users_select_own" ON "users"
  FOR SELECT USING (auth.uid()::text = "id" AND "deleted_at" IS NULL);

DROP POLICY IF EXISTS "users_update_own" ON "users";
CREATE POLICY "users_update_own" ON "users"
  FOR UPDATE USING (auth.uid()::text = "id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "id");

DROP POLICY IF EXISTS "users_admin_all" ON "users";
CREATE POLICY "users_admin_all" ON "users"
  FOR ALL USING (auth.uid()::text = "id" AND "role" = 'admin' AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "id");

-- gmail_tokens policies
DROP POLICY IF EXISTS "gmail_tokens_owner" ON "gmail_tokens";
CREATE POLICY "gmail_tokens_owner" ON "gmail_tokens"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- meses policies
DROP POLICY IF EXISTS "meses_user_access" ON "meses";
CREATE POLICY "meses_user_access" ON "meses"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- deudas policies
DROP POLICY IF EXISTS "deudas_user_access" ON "deudas";
CREATE POLICY "deudas_user_access" ON "deudas"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- pagos_deudas policies
DROP POLICY IF EXISTS "pagos_deudas_user_access" ON "pagos_deudas";
CREATE POLICY "pagos_deudas_user_access" ON "pagos_deudas"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "deudas" d
      WHERE d."id" = "pagos_deudas"."deuda_id"
      AND d."user_id" = auth.uid()::text
      AND d."deleted_at" IS NULL
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM "deudas" d
      WHERE d."id" = "pagos_deudas"."deuda_id"
      AND d."user_id" = auth.uid()::text
      AND d."deleted_at" IS NULL
    )
  );

-- gastos_fijos policies
DROP POLICY IF EXISTS "gastos_fijos_user_access" ON "gastos_fijos";
CREATE POLICY "gastos_fijos_user_access" ON "gastos_fijos"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- pagos_gastos policies
DROP POLICY IF EXISTS "pagos_gastos_user_access" ON "pagos_gastos";
CREATE POLICY "pagos_gastos_user_access" ON "pagos_gastos"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "gastos_fijos" g
      WHERE g."id" = "pagos_gastos"."gasto_id"
      AND g."user_id" = auth.uid()::text
      AND g."deleted_at" IS NULL
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM "gastos_fijos" g
      WHERE g."id" = "pagos_gastos"."gasto_id"
      AND g."user_id" = auth.uid()::text
      AND g."deleted_at" IS NULL
    )
  );

-- sueldos policies
DROP POLICY IF EXISTS "sueldos_user_access" ON "sueldos";
CREATE POLICY "sueldos_user_access" ON "sueldos"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- cuentas_ahorro policies
DROP POLICY IF EXISTS "cuentas_ahorro_user_access" ON "cuentas_ahorro";
CREATE POLICY "cuentas_ahorro_user_access" ON "cuentas_ahorro"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- ahorros_data policies
DROP POLICY IF EXISTS "ahorros_data_user_access" ON "ahorros_data";
CREATE POLICY "ahorros_data_user_access" ON "ahorros_data"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "cuentas_ahorro" c
      WHERE c."id" = "ahorros_data"."cuenta_id"
      AND c."user_id" = auth.uid()::text
      AND c."deleted_at" IS NULL
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM "cuentas_ahorro" c
      WHERE c."id" = "ahorros_data"."cuenta_id"
      AND c."user_id" = auth.uid()::text
      AND c."deleted_at" IS NULL
    )
  );

-- suscripciones policies
DROP POLICY IF EXISTS "suscripciones_user_access" ON "suscripciones";
CREATE POLICY "suscripciones_user_access" ON "suscripciones"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- pagos_suscripciones policies
DROP POLICY IF EXISTS "pagos_suscripciones_user_access" ON "pagos_suscripciones";
CREATE POLICY "pagos_suscripciones_user_access" ON "pagos_suscripciones"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "suscripciones" s
      WHERE s."id" = "pagos_suscripciones"."suscripcion_id"
      AND s."user_id" = auth.uid()::text
      AND s."deleted_at" IS NULL
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM "suscripciones" s
      WHERE s."id" = "pagos_suscripciones"."suscripcion_id"
      AND s."user_id" = auth.uid()::text
      AND s."deleted_at" IS NULL
    )
  );

-- abonos policies
DROP POLICY IF EXISTS "abonos_user_access" ON "abonos";
CREATE POLICY "abonos_user_access" ON "abonos"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- pagos_abonos policies
DROP POLICY IF EXISTS "pagos_abonos_user_access" ON "pagos_abonos";
CREATE POLICY "pagos_abonos_user_access" ON "pagos_abonos"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "abonos" a
      WHERE a."id" = "pagos_abonos"."abono_id"
      AND a."user_id" = auth.uid()::text
      AND a."deleted_at" IS NULL
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM "abonos" a
      WHERE a."id" = "pagos_abonos"."abono_id"
      AND a."user_id" = auth.uid()::text
      AND a."deleted_at" IS NULL
    )
  );

-- transacciones_extraidas policies
DROP POLICY IF EXISTS "transacciones_extraidas_user_access" ON "transacciones_extraidas";
CREATE POLICY "transacciones_extraidas_user_access" ON "transacciones_extraidas"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- filtros_correo policies
DROP POLICY IF EXISTS "filtros_correo_user_access" ON "filtros_correo";
CREATE POLICY "filtros_correo_user_access" ON "filtros_correo"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- config_extraccion policies
DROP POLICY IF EXISTS "config_extraccion_user_access" ON "config_extraccion";
CREATE POLICY "config_extraccion_user_access" ON "config_extraccion"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");

-- jobs policies
DROP POLICY IF EXISTS "jobs_user_access" ON "jobs";
CREATE POLICY "jobs_user_access" ON "jobs"
  FOR SELECT USING ("deleted_at" IS NULL);

-- clasificacion_comercios policies
DROP POLICY IF EXISTS "clasificacion_comercios_user_access" ON "clasificacion_comercios";
CREATE POLICY "clasificacion_comercios_user_access" ON "clasificacion_comercios"
  FOR ALL USING (auth.uid()::text = "user_id" AND "deleted_at" IS NULL) WITH CHECK (auth.uid()::text = "user_id");