import { BaseParser } from '../base.js';

export class BCITransferenciaParser extends BaseParser {
  constructor() {
    super('BCI.transferencia');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return (from.includes('bci.cl') || from.includes('banco.bci')) &&
           /transferencia/.test(html);
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

    let comercioRaw = this.extractTableValue($, tableRows, 'nombre');
    if (!comercioRaw) {
      const nombreMatch = bodyText.match(/Nombre\s+(?:del\s+)?(?:destinatario|remitente)[:\s]?(.*?)(?=\s*Monto|\s*Rut|\s*Email|\s*Banco|$)/i);
      if (nombreMatch) comercioRaw = nombreMatch[1].trim();
    }
    const comercio = this.simplifyComercio(comercioRaw || '');

    let tipo_transaccion = 'gasto';
    if (/recibida|abono por|depósito por|recibiste un depósito|monto recibido|has recibido/i.test(bodyText)) {
      tipo_transaccion = 'ingreso';
    }

    return {
      banco: 'BCI',
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
    let name = raw.trim();
    const words = name.split(' ');
    const suffixes = ['CALAMA', 'SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA', 'LIMITADA', 'SA', 'S.A.'];
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()));
    name = filtered.length > 0 ? filtered.join(' ') : name;
    return name.replace(/\s+/g, ' ').trim();
  }
}

export default BCITransferenciaParser;