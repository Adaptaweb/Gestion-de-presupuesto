import test from 'node:test';
import assert from 'node:assert/strict';
import { seleccionarParser, usarParser } from './parsers/index.js';

const headersMercadoPago = {
  from: 'Mercado Pago <info@mercadopago.cl>',
  subject: 'Ya enviamos tu transferencia',
  date: 'Wed, 03 Sep 2026 10:12:00 -0400',
};

const transferenciaEnviada = `
  <html><body>
    <h1>Ya enviamos tu transferencia de $ 70.000</h1>
    <p>Datos del beneficiario</p>
    <table>
      <tr><td>Nombre y apellido:</td><td>Paola Andrea Guzman Yapura</td></tr>
      <tr><td>Entidad:</td><td>Santander</td></tr>
      <tr><td>N&uacute;mero de cuenta:</td><td>000090223577</td></tr>
    </table>
  </body></html>`;

const transferenciaRecibida = `
  <html><body>
    <h1>Recibiste una transferencia de $ 25.500</h1>
    <table>
      <tr><td>Nombre y apellido:</td><td>Juan Perez Soto</td></tr>
      <tr><td>Entidad:</td><td>Banco de Chile</td></tr>
    </table>
  </body></html>`;

function parsear(html, headers = headersMercadoPago) {
  const parser = seleccionarParser(html, headers);
  assert.ok(parser, 'ningun parser reconocio el correo');
  return { parser, resultado: usarParser(parser, html, headers) };
}

test('una transferencia enviada por Mercado Pago es salida de dinero', () => {
  const { parser, resultado } = parsear(transferenciaEnviada);
  assert.equal(parser.nombre, 'MercadoPago.transferencia');
  assert.equal(resultado.banco, 'MercadoPago');
  assert.equal(resultado.tipo_movimiento, 'Transferencia');
  assert.equal(resultado.monto, 70000);
  assert.equal(resultado.tipo_transaccion, 'gasto');
});

test('el comercio es el destinatario, no la entidad', () => {
  const { resultado } = parsear(transferenciaEnviada);
  assert.equal(resultado.comercio, 'Paola Andrea Guzman Yapura');
});

test('sin fecha en el cuerpo se usa la del correo', () => {
  const { resultado } = parsear(transferenciaEnviada);
  assert.equal(resultado.fecha, '2026-09-03');
});

test('la fecha del correo se toma en su huso, no en UTC', () => {
  const headers = { ...headersMercadoPago, date: 'Wed, 03 Sep 2026 21:30:00 -0400' };
  const { resultado } = parsear(transferenciaEnviada, headers);
  assert.equal(resultado.fecha, '2026-09-03');
});

test('una transferencia recibida es entrada de dinero', () => {
  const { resultado } = parsear(transferenciaRecibida);
  assert.equal(resultado.monto, 25500);
  assert.equal(resultado.comercio, 'Juan Perez Soto');
  assert.equal(resultado.tipo_transaccion, 'ingreso');
});

test('un correo de Mercado Pago que no es transferencia no lo toma este parser', () => {
  const html = '<html><body><p>Tu resumen de puntos de este mes</p></body></html>';
  const parser = seleccionarParser(html, { ...headersMercadoPago, subject: 'Puntos' });
  assert.equal(parser, null);
});

test('la fecha escrita en palabras dentro del cuerpo gana a la del correo', () => {
  const html = `
    <html><body>
      <h1>Ya enviamos tu transferencia de $ 12.500</h1>
      <p>Fecha: 15 de agosto de 2026</p>
      <table><tr><td>Nombre y apellido:</td><td>Ana Rojas Diaz</td></tr>
      <tr><td>Entidad:</td><td>BCI</td></tr></table>
    </body></html>`;
  const { resultado } = parsear(html);
  assert.equal(resultado.fecha, '2026-08-15');
  assert.equal(resultado.comercio, 'Ana Rojas Diaz');
});
