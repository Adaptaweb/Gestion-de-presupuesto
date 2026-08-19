// Comprueba que compromisos y pagos contienen exactamente lo mismo que las
// cuatro tablas de origen. Solo lectura. Ejecutar con:
//   node server/scripts/verify-compromisos.mjs
//
// Sirve para decidir cuando es seguro retirar deudas, gastos_fijos,
// suscripciones y abonos, que la migracion 0014 deja intactas a proposito.

import db from '../db.js';

let fallos = 0;
const ok = (t, c) => console.log(`  ${c ? 'ok ' : 'FALLA'}  ${t}`) || (fallos += c ? 0 : 1);

const origenes = [
  ['deudas', 'cuota', 'pagos_deudas', 'deuda_id'],
  ['gastos_fijos', 'fijo', 'pagos_gastos', 'gasto_id'],
  ['suscripciones', 'suscripcion', 'pagos_suscripciones', 'suscripcion_id'],
  ['abonos', 'abono', 'pagos_abonos', 'abono_id'],
];

console.log('conteos por tipo:');
for (const [tabla, tipo, tpagos, fk] of origenes) {
  const a = await db.get(`SELECT COUNT(*)::int n FROM "${tabla}"`);
  const b = await db.get('SELECT COUNT(*)::int n FROM compromisos WHERE tipo = ?', tipo);
  ok(`${tabla}: ${a.n} -> compromisos(${tipo}): ${b.n}`, a.n === b.n);

  const pa = await db.get(`SELECT COUNT(*)::int n FROM "${tpagos}"`);
  const pb = await db.get(
    `SELECT COUNT(*)::int n FROM pagos p JOIN compromisos c ON c.id = p.compromiso_id WHERE c.tipo = ?`, tipo);
  ok(`${tpagos}: ${pa.n} -> pagos: ${pb.n}`, pa.n === pb.n);
}

console.log('\nintegridad de campos:');
const desc = await db.get(`
  SELECT COUNT(*)::int n FROM deudas d JOIN compromisos c ON c.id = d.id
  WHERE d.descripcion IS DISTINCT FROM c.descripcion
     OR d."valorCuota" IS DISTINCT FROM c."valorCuota"
     OR d."cuotasTotales" IS DISTINCT FROM c."cuotasTotales"
     OR d."mesInicio" IS DISTINCT FROM c."mesInicio"
     OR d.banco IS DISTINCT FROM c.banco`);
ok(`deudas: 0 discrepancias en campos propios (${desc.n})`, desc.n === 0);

const bools = await db.get(`
  SELECT COUNT(*)::int n FROM deudas d JOIN compromisos c ON c.id = d.id
  WHERE (d."facturacionAuto"::text IN ('1','true','t')) IS DISTINCT FROM c."facturacionAuto"`);
ok(`deudas: booleanos convertidos sin perdida (${bools.n} fallos)`, bools.n === 0);

const estados = await db.get(`
  SELECT COUNT(*)::int n FROM pagos_deudas pd
  JOIN pagos p ON p.compromiso_id = pd.deuda_id AND p.mes = pd.mes
  WHERE pd.estado IS DISTINCT FROM p.estado`);
ok(`pagos_deudas: estados identicos (${estados.n} fallos)`, estados.n === 0);

const montos = await db.get(`
  SELECT COUNT(*)::int n FROM pagos_gastos pg
  JOIN pagos p ON p.compromiso_id = pg.gasto_id AND p.mes = pg.mes
  WHERE pg.monto IS DISTINCT FROM p.monto`);
ok(`pagos_gastos: montos identicos (${montos.n} fallos)`, montos.n === 0);

console.log('\nestado posterior:');
const dup = await db.get(`SELECT COUNT(*)::int n FROM (SELECT user_id, mes FROM meses GROUP BY user_id, mes HAVING COUNT(*)>1) d`);
ok(`meses sin duplicados (${dup.n})`, dup.n === 0);
const meses = await db.get('SELECT COUNT(*)::int n FROM meses');
console.log(`  meses: 116 -> ${meses.n}`);
const sv = await db.get('SELECT COUNT(*)::int n FROM users WHERE sync_version IS NOT NULL');
ok(`sync_version presente en ${sv.n} usuarios`, sv.n === 4);
const rl = await db.get(`SELECT to_regclass('public.rate_limits') r`);
ok('rate_limits creada', Boolean(rl.r));

console.log(fallos === 0 ? '\nTODO CORRECTO' : `\n${fallos} COMPROBACIONES FALLIDAS`);
await db.pool.end();
process.exit(fallos === 0 ? 0 : 1);
