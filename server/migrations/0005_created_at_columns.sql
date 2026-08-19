-- created_at en las tablas de dominio. Se salta las que no existan todavia.
DO $$
DECLARE
  t TEXT;
  tablas TEXT[] := ARRAY[
    'meses', 'deudas', 'gastos_fijos', 'pagos_deudas', 'pagos_gastos', 'sueldos',
    'cuentas_ahorro', 'ahorros_data', 'suscripciones', 'pagos_suscripciones',
    'abonos', 'pagos_abonos', 'transacciones_extraidas', 'config_extraccion'
  ];
BEGIN
  FOREACH t IN ARRAY tablas LOOP
    IF to_regclass('public.' || quote_ident(t)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()', t);
    END IF;
  END LOOP;
END $$;
