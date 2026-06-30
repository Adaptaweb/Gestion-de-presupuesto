import { BaseParser } from '../base.js';

export class SantanderTransferenciaParser extends BaseParser {
  constructor() {
    super('Santander.transferencia');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return from.includes('santander.cl') && /transferencia/.test(html);
  }

  extraer(html, headers) {
    const $ = this.loadHtml(html);
    const bodyText = $.text();
    const rows = $('table tr').toArray().filter(r => $(r).children('td').length >= 2);
    const tableRows = rows.length > 0 ? rows : $('tr').toArray().filter(r => $(r).children('td').length >= 2);

    const montoRaw = this.extractTableValue($, tableRows, 'monto');
    const monto = this.normalizarMonto(montoRaw);

    let fechaRaw = this.extractTableValue($, tableRows, 'fecha');
    let fecha = this.normalizarFecha(fechaRaw);
    if (!fecha) {
      const match = bodyText.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
      if (match) fecha = `${match[3]}-${match[2]}-${match[1]}`;
    }

    let comercioRaw = this.extractTableValue($, tableRows, 'destinatario');
    if (!comercioRaw) {
      const nombreMatch = bodyText.match(/Nombre\s+(?:del\s+)?destinatario[:\s]?(.*?)(?=\s*Monto|\s*Rut|\s*Banco|$)/i);
      if (nombreMatch) comercioRaw = nombreMatch[1].trim();
    }
    if (!comercioRaw) {
      const clienteMatch = bodyText.match(/nuestro cliente\s+([A-ZÁÉÍÓÚÑ\s]+?)\s+realiz[óo]?/i);
      if (clienteMatch) comercioRaw = clienteMatch[1].trim();
    }
    const comercio = this.simplifyComercio(comercioRaw || '');

    let tipo_transaccion = 'gasto';
    if (/recibida|abono|recibiste|has recibido|a tu cuenta/i.test(bodyText)) {
      tipo_transaccion = 'ingreso';
    }

    return {
      banco: 'Santander',
      tipo_movimiento: 'Transferencia',
      tipo_tarjeta: '',
      monto,
      fecha,
      comercio,
      tipo_transaccion,
    };
  }

  simplifyComercio(raw) {
    if (!raw) return '';
    return raw.trim().replace(/\s+/g, ' ').trim();
  }
}

export default SantanderTransferenciaParser;