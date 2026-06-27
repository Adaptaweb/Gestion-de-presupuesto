import { BaseParser } from '../base.js';

export class BCICreditoParser extends BaseParser {
  constructor() {
    super('BCI.credito');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return (from.includes('bci.cl') || from.includes('banco.bci')) &&
           /cr[eé]dito/.test(html);
  }

  extraer(html, headers) {
    const $ = this.loadHtml(html);
    const bodyText = $.text();
    const rows = $('table tr').toArray().filter(r => $(r).children('td').length >= 2);
    const tableRows = rows.length > 0 ? rows : $('tr').toArray().filter(r => $(r).children('td').length >= 2);

    const montoRaw = this.extractTableValue($, tableRows, 'monto');
    const monto = this.normalizarMonto(montoRaw);

    let fechaRaw = this.extractTableValue($, tableRows, 'fecha');
    if (!fechaRaw) fechaRaw = this.extractTableValue($, tableRows, 'fecha y hora');
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
      banco: 'BCI',
      tipo_movimiento: 'Compra',
      tipo_tarjeta: 'Crédito',
      monto,
      fecha,
      comercio,
    };
  }

  simplifyComercio(raw) {
    if (!raw) return '';
    let name = raw.trim();
    name = name.replace(/[\s,]+(?:US|USA|MEX|COL|ARG|PER|BRA|CHL)\s*$/i, '');
    name = name.replace(/[\s]+\d{3}-\d{3}-\d{4}\s*$/, '');
    name = name.replace(/[\s]+\d{7,}\s*$/, '');
    const prefixes = ['ALMACENES ', 'TIENDAS ', 'SUPERMERCADO ', 'FARMACIAS ', 'BANCO ', 'CINE '];
    for (const p of prefixes) {
      if (name.startsWith(p)) { name = name.slice(p.length); break; }
    }
    const words = name.split(' ');
    const suffixes = ['CALAMA', 'SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA', 'LIMITADA', 'SA', 'S.A.'];
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()));
    name = filtered.length > 0 ? filtered.join(' ') : name;
    name = name.replace(/\s+/g, ' ').trim();
    if (name.length === 0) return raw.trim();
    return name;
  }
}

export default BCICreditoParser;