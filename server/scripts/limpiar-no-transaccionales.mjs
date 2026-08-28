// Marca como borradas las transacciones que venian de correos no
// transaccionales (estados de cuenta, cartolas, resumenes). Esas filas se
// crearon antes de que existiera el filtro de server/emailFilters.js y traen el
// total facturado del periodo, no un movimiento.
//
// Solo lectura por defecto:
//   node server/scripts/limpiar-no-transaccionales.mjs
// Aplicar el borrado suave (deleted_at = NOW(), reversible):
//   node server/scripts/limpiar-no-transaccionales.mjs --apply

import db from '../db.js';
import { esCorreoNoTransaccional } from '../emailFilters.js';

const aplicar = process.argv.includes('--apply');

const filas = await db.all(
  `SELECT id, user_id, banco, monto, fecha, comercio, asunto, revisado
     FROM transacciones_extraidas
    WHERE deleted_at IS NULL
    ORDER BY fecha DESC`
);

// El filtro se evalua en JS, no con LIKE, para usar la misma normalizacion que
// la ingesta: los bancos meten caracteres invisibles y acentos en el asunto.
const objetivo = filas
  .map(f => ({ ...f, motivo: esCorreoNoTransaccional(f.asunto) }))
  .filter(f => f.motivo);

console.log(`transacciones activas: ${filas.length}`);
console.log(`no transaccionales:    ${objetivo.length}`);

if (objetivo.length === 0) {
  process.exit(0);
}

const revisadas = objetivo.filter(f => f.revisado);
console.log(`  de esas, revisadas por el usuario: ${revisadas.length}`);

const porUsuario = {};
for (const f of objetivo) {
  porUsuario[f.user_id] = (porUsuario[f.user_id] || 0) + 1;
}
console.log('por usuario:', porUsuario);

console.log('\ndetalle:');
for (const f of objetivo) {
  console.log(`  ${f.fecha}  ${String(f.monto).padStart(10)}  ${f.banco}  rev=${f.revisado}  ${f.asunto}`);
}

if (!aplicar) {
  console.log('\nSimulacion: no se modifico nada. Repetir con --apply para marcarlas como borradas.');
  process.exit(0);
}

const ids = objetivo.map(f => f.id);
const res = await db.run(
  'UPDATE transacciones_extraidas SET deleted_at = NOW() WHERE id = ANY($1) AND deleted_at IS NULL',
  ids
);
console.log(`\nfilas marcadas como borradas: ${res.changes}`);
console.log('Para revertir: UPDATE transacciones_extraidas SET deleted_at = NULL WHERE id = ANY(...);');
