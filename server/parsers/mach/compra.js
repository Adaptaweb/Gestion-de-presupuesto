import { BaseParser } from '../base.js';

export class MachCompraParser extends BaseParser {
  constructor() {
    super('Mach.compra');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return from.includes('machbank.cl') || from.includes('mach.cl');
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

    let comercioRaw = this.extractTableValue($, tableRows, 'comercio');
    if (!comercioRaw) {
      const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
      const comercioLine = lines.find(l => l.toLowerCase().includes('comercio'));
      if (comercioLine) comercioRaw = comercioLine.replace(/comercio/i, '').replace(/:/, '').trim();
    }
    const comercio = this.simplifyComercio(comercioRaw || '');

    return {
      banco: 'Mach',
      tipo_movimiento: 'Compra',
      tipo_tarjeta: '',
      monto,
      fecha,
      comercio,
    };
  }

  simplifyComercio(raw) {
    if (!raw) return '';
    let name = raw.trim();
    name = name.replace(/[\s,]+(?:US|USA|MEX|COL|ARG|PER|BRA|CHL)\s*$/i, '');
    const words = name.split(' ');
    const suffixes = ['SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA'];
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()));
    return filtered.join(' ').replace(/\s+/g, ' ').trim();
  }
}

export default MachCompraParser;