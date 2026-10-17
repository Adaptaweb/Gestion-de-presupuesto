import test from 'node:test';
import assert from 'node:assert/strict';
import { limpiarComercio, claveComercio } from './comercios.js';

const casos = [
  ['PAYU *UBER TRIP CL', 'Uber', 'marca'],
  ['payu uber trip cl', 'Uber', 'marca'],
  ['UBER *EATS', 'Uber Eats', 'marca'],
  ['PAYU *UBER EATS CL', 'Uber Eats', 'marca'],
  ['DLO*DIDI SANTIAGO', 'DiDi', 'marca'],
  ['MERPAGO*RAPPI', 'Rappi', 'marca'],
  ['NETFLIX.COM', 'Netflix', 'marca'],
  ['GOOGLE *YouTubePremium', 'YouTube', 'marca'],
  ['GOOGLE *YOUTUBE PREMIUM', 'YouTube', 'marca'],
  ['APPLE.COM/BILL', 'Apple', 'marca'],
  ['AMAZON PRIME VIDEO', 'Amazon Prime Video', 'marca'],
  ['SUPERMERCADO LIDER 123', 'Líder', 'marca'],
  ['MERPAGO*TIENDA EL PERRO', 'Tienda el Perro', 'limpieza'],
  ['SUMUP *CAFE ALTO SANTIAGO', 'Cafe Alto', 'limpieza'],
  ['FERRETERIA LOS ANDES SPA', 'Ferreteria los Andes', 'limpieza'],
  ['PANADERIA SAN JOSE #45', 'Panaderia San Jose', 'limpieza'],
  ['WWW.TIENDAX.CL', 'Tiendax', 'limpieza'],
  ['Paola Andrea Guzman Yapura', 'Paola Andrea Guzman Yapura', 'sin_cambio'],
  ['JUAN PEREZ SOTO', 'Juan Perez Soto', 'limpieza'],
  ['KFC', 'KFC', 'marca'],
  ['', '', 'sin_cambio'],
];

for (const [original, nombre, regla] of casos) {
  test(`"${original}" se muestra como "${nombre}"`, () => {
    const r = limpiarComercio(original);
    assert.equal(r.nombre, nombre);
    assert.equal(r.regla, regla);
  });
}

test('la clave ignora mayusculas, tildes y simbolos', () => {
  assert.equal(claveComercio('PAYU *Ubér Trip, CL'), claveComercio('payu uber trip cl'));
});
