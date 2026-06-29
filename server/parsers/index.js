import { BaseParser } from './base.js';
import { BCIDebitoParser } from './bci/debito.js';
import { BCICreditoParser } from './bci/credito.js';
import { BCITransferenciaParser } from './bci/transferencia.js';
import { ItauTransferenciaParser } from './itau/transferencia.js';
import { FalabellaTransferenciaParser } from './falabella/transferencia.js';
import { SantanderCompraParser } from './santander/compra.js';
import { SantanderTransferenciaParser } from './santander/transferencia.js';
import { BancoChileCompraParser } from './bancochile/compra.js';
import { BancoChileTransferenciaParser } from './bancochile/transferencia.js';
import { BancoEstadoDebitoParser } from './bancoestado/debito.js';
import { MachCompraParser } from './mach/compra.js';

const parsers = [
  new BCIDebitoParser(),
  new BCICreditoParser(),
  new BCITransferenciaParser(),
  new ItauTransferenciaParser(),
  new BancoChileTransferenciaParser(),
  new FalabellaTransferenciaParser(),
  new SantanderCompraParser(),
  new SantanderTransferenciaParser(),
  new BancoChileCompraParser(),
  new BancoEstadoDebitoParser(),
  new MachCompraParser(),
];

export function seleccionarParser(html, headers) {
  for (const parser of parsers) {
    try {
      if (parser.puedeParsear(html, headers)) {
        return parser;
      }
    } catch (e) {
      console.warn(`[ParserRouter] Error en ${parser.nombre}: ${e.message}`);
    }
  }
  return null;
}

export function usarParser(parser, html, headers) {
  if (!parser) return null;
  try {
    return parser.extraer(html, headers);
  } catch (e) {
    console.warn(`[ParserRouter] Error al usar ${parser.nombre}: ${e.message}`);
    return null;
  }
}

export { BaseParser };
export default { seleccionarParser, usarParser, BaseParser };