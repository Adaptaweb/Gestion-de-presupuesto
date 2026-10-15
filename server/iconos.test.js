// Ejecutar con: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { ipPrivada, validarDestino } from './iconos.js';

test('las IPs internas no se pueden descargar', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '172.20.0.1', '192.168.1.10', '169.254.169.254', '0.0.0.0', '100.64.0.1', '::1', 'fd00::1', 'fe80::1', '::ffff:127.0.0.1']) {
    assert.equal(ipPrivada(ip), true, ip);
  }
  for (const ip of ['8.8.8.8', '104.16.1.1', '2606:4700::1111']) {
    assert.equal(ipPrivada(ip), false, ip);
  }
});

test('solo se aceptan URLs http(s) hacia IPs publicas', async () => {
  await assert.rejects(validarDestino('file:///etc/passwd'));
  await assert.rejects(validarDestino('ftp://example.com/a.png'));
  await assert.rejects(validarDestino('http://127.0.0.1/a.png'));
  await assert.rejects(validarDestino('http://[::1]/a.png'));
  await assert.rejects(validarDestino('http://169.254.169.254/latest/meta-data'));
  await assert.rejects(validarDestino('no es url'));
  await validarDestino('https://8.8.8.8/logo.png');
});
