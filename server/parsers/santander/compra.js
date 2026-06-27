import { BaseParser } from '../base.js';

export class SantanderCompraParser extends BaseParser {
  constructor() {
    super('Santander.compra');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return from.includes('santander.cl') &&
           (/compra|d[eé]bito|cr[eé]dito/i.test(html));
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
      const strongTags = $('strong').toArray();
      for (const tag of strongTags) {
        const text = $(tag).text().trim();
        if (text.length > 3 && !/@/.test(text) && !/tarjeta/i.test(text) && !/santander/i.test(text.toLowerCase())) {
          comercioRaw = text;
          break;
        }
      }
    }
    const comercio = this.simplifyComercio(comercioRaw || '');

    const tipo_tarjeta = /d[eé]bito/.test(bodyText) ? 'Débito' : 'Crédito';

    return {
      banco: 'Santander',
      tipo_movimiento: 'Compra',
      tipo_tarjeta,
      monto,
      fecha,
      comercio,
    };
  }

  simplifyComercio(raw) {
    if (!raw) return '';
    let name = raw.trim();
    name = name.replace(/[\s,]+(?:US|USA|MEX|COL|ARG|PER|BRA|CHL)\s*$/i, '');
    const prefixes = ['ALMACENES ', 'TIENDAS ', 'SUPERMERCADO ', 'FARMACIAS ', 'BANCO ', 'CINE '];
    for (const p of prefixes) {
      if (name.startsWith(p)) { name = name.slice(p.length); break; }
    }
    const words = name.split(' ');
    const suffixes = ['SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA'];
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()));
    return filtered.join(' ').replace(/\s+/g, ' ').trim();
  }
}

export default SantanderCompraParser;