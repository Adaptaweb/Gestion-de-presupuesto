import { BaseParser } from '../base.js';

export class ItauTransferenciaParser extends BaseParser {
  constructor() {
    super('Itau.transferencia');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return (from.includes('itau') || from.includes('itau.cl')) &&
           /transferencia|ha\s+instruido|nuestro.*cliente/i.test(html);
  }

  extraer(html, headers) {
    const $ = this.loadHtml(html);
    const bodyText = $.text().replace(/\s+/g, ' ');

    let monto = 0;
    const montoMatch = bodyText.match(/Monto[\s:]*\$?\s*([0-9.]{1,15})/i);
    if (montoMatch) monto = this.normalizarMonto(montoMatch[1]);

    let fecha = null;
    const fechaMatch = bodyText.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
    if (fechaMatch) fecha = `${fechaMatch[3]}-${fechaMatch[2]}-${fechaMatch[1]}`;

    let comercioRaw = '';

    const boldTexts = [];
    $('b, strong').each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (text.length > 3) boldTexts.push(text);
    });

    for (const boldText of boldTexts) {
      const match = boldText.match(/^([A-ZÁÉÍÓÚÑ\s]{3,60}?)$/);
      if (match) {
        const potentialName = match[1].trim();
        if (potentialName.length > 5 && !potentialName.includes('@') && !/\d{5,}/.test(potentialName)) {
          comercioRaw = potentialName;
          break;
        }
      }
    }

    if (!comercioRaw) {
      const patrones = [
        /nuestro\s*\(?\s*a\s*\)?\s*cliente\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s*,?\s*ha\s+(?:instruido|efectuado)/i,
        /cliente\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s*,?\s*ha\s+(?:instruido|efectuado)/i,
      ];

      for (const patron of patrones) {
        const match = bodyText.match(patron);
        if (match && match[1]) {
          comercioRaw = match[1].trim().replace(/\s+/g, ' ');
          break;
        }
      }
    }

    const comercio = this.simplifyComercio(comercioRaw);

    let tipo_transaccion = 'gasto';
    if (/a\s+su\s+cuenta|a\s+tu\s+cuenta|ha\s+instruido.*a\s+tu\s|transferencia\s+a\s+su\s/i.test(bodyText)) {
      tipo_transaccion = 'ingreso';
    }
    if (tipo_transaccion === 'gasto' && /ha\s+instruido\s+una\s+transferencia\s+de\s+fondos/i.test(bodyText)) {
      tipo_transaccion = 'ingreso';
    }

    return {
      banco: 'Itau',
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

    const suffixes = ['CALAMA', 'SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA', 'LIMITADA', 'SA', 'S.A.', 'CHILE', 'EMISORA'];
    const words = name.split(/\s+/);
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()) && w.length > 1);
    name = filtered.join(' ');

    if (name.length < 2) return '';
    return name;
  }
}

export default ItauTransferenciaParser;