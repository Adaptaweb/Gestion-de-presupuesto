// Copia deudas, gastos_fijos, suscripciones y abonos a compromisos, y sus
// tablas de pagos a pagos.
//
// En JavaScript y no en SQL porque el esquema real de produccion no coincide
// con supabase-schema.sql: deleted_at se anadio despues, y los booleanos vienen
// de SQLite como INTEGER en unas tablas y como BOOLEAN en otras. Aqui se lee
// information_schema y se adapta la consulta a lo que hay.
//
// Idempotente: usa ON CONFLICT DO NOTHING, asi que reejecutarla no duplica ni
// pisa nada. No borra ni modifica las tablas de origen.

const ORIGENES = [
  {
    tabla: 'deudas',
    tipo: 'cuota',
    pagos: { tabla: 'pagos_deudas', fk: 'deuda_id', tieneMonto: false },
    propias: ['cuotasTotales', 'valorCuota', 'isContribuciones', 'banco', 'bancoLogo', 'tipoTarjeta', 'mesInicio'],
  },
  {
    tabla: 'gastos_fijos',
    tipo: 'fijo',
    pagos: { tabla: 'pagos_gastos', fk: 'gasto_id', tieneMonto: true },
    propias: [],
  },
  {
    tabla: 'suscripciones',
    tipo: 'suscripcion',
    pagos: { tabla: 'pagos_suscripciones', fk: 'suscripcion_id', tieneMonto: true },
    propias: ['valor', 'billingCycle', 'durationYears', 'mesInicio'],
  },
  {
    tabla: 'abonos',
    tipo: 'abono',
    pagos: { tabla: 'pagos_abonos', fk: 'abono_id', tieneMonto: true },
    propias: [],
  },
];

const COMUNES = ['descripcion', 'diaPago', 'facturacionAuto', 'iconType', 'iconValue', 'iconUrl'];

const BOOLEANAS = new Set(['facturacionAuto', 'isContribuciones']);

async function columnasDe(db, tabla) {
  const rows = await db.all(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = ?`,
    tabla
  );
  return new Set(rows.map(r => r.column_name));
}

async function existeTabla(db, tabla) {
  const row = await db.get(`SELECT to_regclass(?) AS reg`, `public.${tabla}`);
  return Boolean(row?.reg);
}

// Devuelve la expresion SELECT para una columna, o NULL si la tabla no la tiene.
function expresion(columna, columnas) {
  if (!columnas.has(columna)) return 'NULL';
  if (BOOLEANAS.has(columna)) {
    // INTEGER 0/1 en las tablas heredadas de SQLite, BOOLEAN en las nuevas.
    return `CASE WHEN "${columna}"::text IN ('1', 'true', 't') THEN TRUE ELSE FALSE END`;
  }
  return `"${columna}"`;
}

export default async function run(db) {
  const resumen = [];

  for (const origen of ORIGENES) {
    if (!(await existeTabla(db, origen.tabla))) {
      resumen.push(`${origen.tabla}: no existe`);
      continue;
    }

    const columnas = await columnasDe(db, origen.tabla);
    const campos = [...COMUNES, ...origen.propias];

    const destino = ['id', 'user_id', 'tipo', ...campos.map(c => `"${c}"`)];
    const seleccion = ['id', 'user_id', `'${origen.tipo}'`, ...campos.map(c => expresion(c, columnas))];

    if (columnas.has('created_at')) {
      destino.push('created_at');
      seleccion.push('created_at');
    }
    if (columnas.has('deleted_at')) {
      destino.push('deleted_at');
      seleccion.push('deleted_at');
    }

    const res = await db.run(
      `INSERT INTO compromisos (${destino.join(', ')})
       SELECT ${seleccion.join(', ')} FROM "${origen.tabla}"
       ON CONFLICT (id) DO NOTHING`
    );
    resumen.push(`${origen.tabla} -> compromisos: ${res.changes}`);

    if (!(await existeTabla(db, origen.pagos.tabla))) continue;

    const montoExpr = origen.pagos.tieneMonto ? 'p.monto' : 'NULL';
    const resPagos = await db.run(
      `INSERT INTO pagos (compromiso_id, mes, monto, estado)
       SELECT p."${origen.pagos.fk}", p.mes, ${montoExpr}, p.estado
       FROM "${origen.pagos.tabla}" p
       JOIN compromisos c ON c.id = p."${origen.pagos.fk}"
       ON CONFLICT (compromiso_id, mes) DO NOTHING`
    );
    resumen.push(`${origen.pagos.tabla} -> pagos: ${resPagos.changes}`);
  }

  // Comprobacion: ninguna fila de origen debe quedarse fuera.
  const faltantes = [];
  for (const origen of ORIGENES) {
    if (!(await existeTabla(db, origen.tabla))) continue;
    const row = await db.get(
      `SELECT COUNT(*)::int AS n FROM "${origen.tabla}" o
       WHERE NOT EXISTS (SELECT 1 FROM compromisos c WHERE c.id = o.id)`
    );
    if (row.n > 0) faltantes.push(`${origen.tabla}: ${row.n}`);
  }

  if (faltantes.length > 0) {
    throw new Error(`Filas sin migrar: ${faltantes.join(', ')}`);
  }

  return resumen.join(' | ');
}
