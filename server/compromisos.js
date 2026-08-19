// Lectura y escritura de compromisos: deudas (cuotas), gastos fijos,
// suscripciones y abonos, ahora en una sola tabla.
//
// Sustituye a las cuatro ramas paralelas de /api/sync, que recorrian cada
// elemento con un SELECT y un INSERT o UPDATE por fila dentro de una
// transaccion. Marcar una cuota como pagada lanzaba decenas de consultas y
// retenia un cliente del pool (que tiene un maximo de 2) durante todo el
// recorrido.
//
// Aqui cada tipo se resuelve con sentencias en bloque: un upsert masivo, un
// borrado logico por diferencia y dos sentencias para los pagos.

const TIPOS = {
  deudas: 'cuota',
  gastosFijos: 'fijo',
  suscripciones: 'suscripcion',
  abonos: 'abono',
};

// Columnas de compromisos en el orden en que se insertan.
const COLUMNAS = [
  'id', 'user_id', 'tipo', 'descripcion', 'diaPago', 'facturacionAuto',
  'iconType', 'iconValue', 'iconUrl', 'cuotasTotales', 'valorCuota',
  'isContribuciones', 'banco', 'bancoLogo', 'tipoTarjeta', 'valor',
  'billingCycle', 'durationYears', 'mesInicio',
];

// Postgres admite 65535 parametros por sentencia. Con 19 columnas caben de
// sobra 500 filas por lote.
const LOTE = 500;

function fila(item, userId, tipo) {
  return [
    item.id,
    userId,
    tipo,
    item.descripcion ?? null,
    item.diaPago ?? 1,
    Boolean(item.facturacionAuto),
    item.iconType ?? 'default',
    item.iconValue ?? 'layout',
    item.iconUrl ?? '',
    item.cuotasTotales ?? null,
    item.valorCuota ?? null,
    Boolean(item.isContribuciones),
    item.banco ?? '',
    item.bancoLogo ?? '',
    item.tipoTarjeta ?? '',
    item.valor ?? null,
    item.billingCycle ?? null,
    item.durationYears ?? null,
    item.mesInicio ?? null,
  ];
}

function trocear(lista, tamano) {
  const trozos = [];
  for (let i = 0; i < lista.length; i += tamano) trozos.push(lista.slice(i, i + tamano));
  return trozos;
}

function marcadores(numFilas, numColumnas, desde = 0) {
  const grupos = [];
  for (let f = 0; f < numFilas; f++) {
    const cols = [];
    for (let c = 0; c < numColumnas; c++) cols.push(`$${desde + f * numColumnas + c + 1}`);
    grupos.push(`(${cols.join(', ')})`);
  }
  return grupos.join(', ');
}

const COLUMNAS_CITADAS = COLUMNAS.map(c => `"${c}"`).join(', ');
const ACTUALIZABLES = COLUMNAS
  .filter(c => c !== 'id' && c !== 'user_id' && c !== 'tipo')
  .map(c => `"${c}" = EXCLUDED."${c}"`)
  .join(', ');

/** Devuelve el estado completo del usuario con la forma que espera el cliente. */
export async function cargarCompromisos(db, userId) {
  const items = await db.all(
    `SELECT * FROM compromisos WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at`,
    userId
  );

  const pagosRows = await db.all(
    `SELECT p.compromiso_id, p.mes, p.monto, p.estado
     FROM pagos p
     JOIN compromisos c ON c.id = p.compromiso_id
     WHERE c.user_id = ? AND c.deleted_at IS NULL`,
    userId
  );

  const pagosPorItem = new Map();
  for (const p of pagosRows) {
    let mapa = pagosPorItem.get(p.compromiso_id);
    if (!mapa) { mapa = {}; pagosPorItem.set(p.compromiso_id, mapa); }
    // Las cuotas no llevan monto: su valor sale de valorCuota.
    mapa[p.mes] = p.monto === null ? { estado: p.estado } : { monto: p.monto, estado: p.estado };
  }

  const salida = { deudas: [], gastosFijos: [], suscripciones: [], abonos: [] };
  const porTipo = { cuota: 'deudas', fijo: 'gastosFijos', suscripcion: 'suscripciones', abono: 'abonos' };

  for (const item of items) {
    const destino = porTipo[item.tipo];
    if (!destino) continue;
    const { tipo, user_id, deleted_at, created_at, ...campos } = item;
    salida[destino].push({ ...campos, pagos: pagosPorItem.get(item.id) || {} });
  }

  return salida;
}

/**
 * Guarda el estado enviado por el cliente.
 *
 * Sigue recibiendo la lista completa por tipo: cambiarlo a operaciones sueltas
 * exige tocar el cliente y va en la tarea siguiente. Lo que cambia aqui es el
 * numero de consultas, de decenas por guardado a unas pocas.
 */
export async function guardarCompromisos(tx, userId, payload) {
  for (const [clave, tipo] of Object.entries(TIPOS)) {
    const lista = payload[clave];
    if (!Array.isArray(lista)) continue;

    const ids = lista.map(i => i.id);

    // 1. Borrado logico de lo que ya no viene.
    await tx.run(
      `UPDATE compromisos SET deleted_at = NOW()
       WHERE user_id = $1 AND tipo = $2 AND deleted_at IS NULL AND NOT (id = ANY($3))`,
      userId, tipo, ids
    );

    if (lista.length === 0) continue;

    // 2. Alta o actualizacion en bloque. deleted_at vuelve a NULL para
    //    resucitar un elemento que se habia borrado y se reenvia.
    for (const lote of trocear(lista, LOTE)) {
      const valores = lote.flatMap(item => fila(item, userId, tipo));
      await tx.run(
        `INSERT INTO compromisos (${COLUMNAS_CITADAS})
         VALUES ${marcadores(lote.length, COLUMNAS.length)}
         ON CONFLICT (id) DO UPDATE SET ${ACTUALIZABLES}, deleted_at = NULL`,
        ...valores
      );
    }

    // 3. Pagos: se reemplazan por completo. El cliente siempre manda el mapa
    //    entero, asi que borrar y reinsertar es equivalente y cuesta dos
    //    sentencias en vez de una por mes.
    await tx.run(`DELETE FROM pagos WHERE compromiso_id = ANY($1)`, ids);

    const filasPago = [];
    for (const item of lista) {
      for (const [mes, pago] of Object.entries(item.pagos || {})) {
        if (!pago) continue;
        filasPago.push([item.id, mes, pago.monto ?? null, pago.estado ?? null]);
      }
    }

    for (const lote of trocear(filasPago, LOTE)) {
      await tx.run(
        `INSERT INTO pagos (compromiso_id, mes, monto, estado)
         VALUES ${marcadores(lote.length, 4)}
         ON CONFLICT (compromiso_id, mes) DO UPDATE SET monto = EXCLUDED.monto, estado = EXCLUDED.estado`,
        ...lote.flat()
      );
    }
  }
}
