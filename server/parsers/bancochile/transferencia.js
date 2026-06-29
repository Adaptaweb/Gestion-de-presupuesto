import { BaseParser } from '../base.js';

export class BancoChileTransferenciaParser extends BaseParser {
  constructor() {
    super('BancoChile.transferencia');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return from.includes('bancochile.cl') && /transferencia/.test(html);
  }

  extraer(html, headers) {
    const $ = this.loadHtml(html);
    const bodyText = $.text().replace(/\s+/g, ' ');

    let monto = 0;
    const montoMatch = bodyText.match(/Monto[\s:]*\$?\s*([0-9.]{1,15})/i);
    if (montoMatch) monto = this.normalizarMonto(montoMatch[1]);

    let fecha = null;
    const fechaMatch = bodyText.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
    if (fechaMatch) fecha = `${fechaMatch[3]}-${fechaMatch[2]}-${fechaMatch[1]}`;

    let comercioRaw = '';

    const boldTexts = [];
    $('b, strong').each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (text.length > 3) boldTexts.push(text);
    });

    for (const boldText of boldTexts) {
      const match = boldText.match(/^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)$/);
      if (match) {
        const potentialName = match[1].trim();
        if (potentialName.length > 5 && !potentialName.includes('@') && !/\d{5,}/.test(potentialName)) {
          comercioRaw = potentialName;
          break;
        }
      }
    }

    if (!comercioRaw) {
      const tableRows = $('table tr').toArray().filter(r => $(r).children('td').length >= 2);
      comercioRaw = this.extractTableValue($, tableRows, 'remitente');
    }

    if (!comercioRaw) {
      const nombreMatch = bodyText.match(/remitente[:\s]?(.*?)(?=\s*Monto|\s*Rut|$)/i);
      if (nombreMatch) comercioRaw = nombreMatch[1].trim();
    }

    const comercio = this.simplifyComercio(comercioRaw || '');

    let tipo_transaccion = 'gasto';
    if (/ha\s+efectuado\s+una\s+transferencia\s+a\s+tu\s+cuenta/i.test(bodyText) ||
        /ha\s+efectuado\s+una\s+transferencia\s+de\s+fondos\s+a\s+tu/i.test(bodyText) ||
        /recibida|abono|recibiste|has\s+recibido/i.test(bodyText)) {
      tipo_transaccion = 'ingreso';
    }

    return {
      banco: 'Banco de Chile',
      tipo_movimiento: 'Transferencia',
      tipo_tarjeta: '',
      monto,
      fecha,
      comercio,
      tipo_transaccion,
    };
  }

  simplifyComercio(raw) {
    if (!raw || raw.length < 2) return '';
    let name = raw.trim();
    name = name.replace(/^(de|del)\s+/i, '');
    name = name.replace(/[,|.]+$/g, '');
    name = name.replace(/\s+/g, ' ').trim();

    const suffixes = ['CALAMA', 'SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA', 'LIMITADA', 'SA', 'S.A.', 'CHILE', 'EMISORA', 'CUENTA'];
    const words = name.split(/\s+/);
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()) && w.length > 1);
    name = filtered.join(' ');

    if (name.length < 2) return '';
    return name;
  }
}

export default BancoChileTransferenciaParser;