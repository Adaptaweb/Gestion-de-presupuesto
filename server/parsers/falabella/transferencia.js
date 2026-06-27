import { BaseParser } from '../base.js';

export class FalabellaTransferenciaParser extends BaseParser {
  constructor() {
    super('Falabella.transferencia');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    const subject = (headers?.subject || '').toLowerCase();
    return (from.includes('falabella') || from.includes('falabella.cl') || subject.includes('transferencia')) &&
           /nuestro.*cliente|ha\s+instruido/i.test(html);
  }

  extraer(html, headers) {
    const $ = this.loadHtml(html);
    const bodyText = $.text().replace(/\s+/g, ' ');

    let monto = 0;
    const montoMatch = bodyText.match(/(?:Monto|Monto\s+transferencia)[\s:]*\$?\s*([0-9.]{1,15})/i);
    if (montoMatch) monto = this.normalizarMonto(montoMatch[1]);

    let fecha = null;
    const fechaMatch = bodyText.match(/(\d{2})[\-\/](\d{2})[\-\/](\d{4})/);
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
        /nuestro\s*\(?\s*a\s*\)?\s*cliente\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s*(?:ha\s+instruido|,)/i,
        /cliente\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s*ha\s+instruido/i,
      ];

      for (const patron of patrones) {
        const match = bodyText.match(patron);
        if (match && match[1]) {
          comercioRaw = match[1].trim().replace(/\s+/g, ' ');
          break;
        }
      }
    }

    if (!comercioRaw) {
      const lines = bodyText.split('.');
      for (const line of lines) {
        if (/nuestro.*cliente/i.test(line)) {
          const nameMatch = line.match(/cliente\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)/i);
          if (nameMatch && nameMatch[1]) {
            comercioRaw = nameMatch[1].trim();
            break;
          }
        }
      }
    }

    const comercio = this.simplifyComercio(comercioRaw);

    let tipo_transaccion = 'gasto';
    if (/a\s+su\s+cuenta|a\s+tu\s+cuenta|ha\s+instruido.*a\s+tu/i.test(bodyText)) {
      tipo_transaccion = 'ingreso';
    }

    return {
      banco: 'Falabella',
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

export default FalabellaTransferenciaParser;