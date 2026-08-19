// Ejecutar con: npm test
//
// guardarCompromisos construye SQL con marcadores numerados a mano. Un
// desajuste entre marcadores y parametros no lo detecta el linter y solo
// aparece al guardar en produccion, asi que se comprueba aqui.

import test from 'node:test';
import assert from 'node:assert/strict';
import { guardarCompromisos } from './compromisos.js';

function txEspia() {
  const consultas = [];
  return {
    consultas,
    run: async (sql, ...params) => {
      consultas.push({ sql: sql.replace(/\s+/g, ' ').trim(), params });
    },
  };
}

function marcadoresDe(sql) {
  const nums = [...sql.matchAll(/\$(\d+)/g)].map(m => Number(m[1]));
  return nums.length ? Math.max(...nums) : 0;
}

const payloadEjemplo = {
  deudas: [
    {
      id: 'debt-1', descripcion: 'Auto', cuotasTotales: 24, valorCuota: 150000,
      mesInicio: 'Enero 2026', isContribuciones: 0, diaPago: 5, facturacionAuto: 1,
      banco: 'BCI',
      pagos: { 'Enero 2026': { estado: 'PAGADA' }, 'Febrero 2026': { estado: 'PENDIENTE' } },
    },
    { id: 'debt-2', descripcion: 'Tele', cuotasTotales: 12, valorCuota: 40000, pagos: {} },
  ],
  gastosFijos: [
    { id: 'fixed-1', descripcion: 'Luz', diaPago: 10, pagos: { 'Enero 2026': { monto: 32000, estado: 'PAGADA' } } },
  ],
  suscripciones: [],
  abonos: [{ id: 'abono-1', descripcion: 'Sueldo extra', pagos: {} }],
};

test('cada sentencia recibe tantos parametros como marcadores declara', async () => {
  const tx = txEspia();
  await guardarCompromisos(tx, 'u1', payloadEjemplo);

  assert.ok(tx.consultas.length > 0, 'no se genero ninguna consulta');
  for (const { sql, params } of tx.consultas) {
    assert.equal(marcadoresDe(sql), params.length, `desajuste en: ${sql.slice(0, 70)}`);
  }
});

test('el numero de consultas no crece con el numero de elementos', async () => {
  const pocos = txEspia();
  await guardarCompromisos(pocos, 'u1', payloadEjemplo);

  const muchos = txEspia();
  await guardarCompromisos(muchos, 'u1', {
    ...payloadEjemplo,
    deudas: Array.from({ length: 200 }, (_, i) => ({
      id: `debt-${i}`, descripcion: `Deuda ${i}`, valorCuota: 1000,
      pagos: { 'Enero 2026': { estado: 'PAGADA' } },
    })),
  });

  assert.equal(muchos.consultas.length, pocos.consultas.length);
});

test('los booleanos heredados de SQLite se normalizan', async () => {
  const tx = txEspia();
  await guardarCompromisos(tx, 'u1', payloadEjemplo);

  const upsert = tx.consultas.find(c => c.sql.startsWith('INSERT INTO compromisos'));
  // Orden de columnas: id, user_id, tipo, descripcion, diaPago, facturacionAuto
  assert.equal(upsert.params[5], true, 'facturacionAuto: 1 deberia ser true');
  // isContribuciones es la duodecima columna
  assert.equal(upsert.params[11], false, 'isContribuciones: 0 deberia ser false');
});

test('las cuotas guardan el pago sin monto', async () => {
  const tx = txEspia();
  await guardarCompromisos(tx, 'u1', payloadEjemplo);

  const pagos = tx.consultas.find(c => c.sql.startsWith('INSERT INTO pagos'));
  // (compromiso_id, mes, monto, estado)
  assert.equal(pagos.params[0], 'debt-1');
  assert.equal(pagos.params[2], null, 'una cuota no lleva monto propio');
  assert.equal(pagos.params[3], 'PAGADA');
});

test('una lista vacia solo borra, no inserta', async () => {
  const tx = txEspia();
  await guardarCompromisos(tx, 'u1', { suscripciones: [] });

  assert.equal(tx.consultas.length, 1);
  assert.match(tx.consultas[0].sql, /^UPDATE compromisos SET deleted_at/);
});

test('un tipo ausente no genera ninguna consulta', async () => {
  const tx = txEspia();
  await guardarCompromisos(tx, 'u1', {});
  assert.equal(tx.consultas.length, 0);
});
