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
    const bodyText = $.text().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
    const rows = $('table tr').toArray().filter(r => $(r).children('td').length >= 2);
    const tableRows = rows.length > 0 ? rows : $('tr').toArray().filter(r => $(r).children('td').length >= 2);

    let monto = 0;
    const montoRaw = this.extractTableValue($, tableRows, 'monto') || this.extractTableValue($, tableRows, 'monto recibido');
    if (montoRaw) monto = this.normalizarMonto(montoRaw);
    if (!monto) {
      const montoMatch = bodyText.match(/(?:Monto(?:\s+recibido)?|monto)[\s:]*\$?\s*([0-9.]{1,15})/i);
      if (montoMatch) monto = this.normalizarMonto(montoMatch[1]);
    }

    let fechaRaw = this.extractTableValue($, tableRows, 'fecha') || this.extractTableValue($, tableRows, 'fecha de la transferencia');
    let fecha = this.normalizarFecha(fechaRaw);
    if (!fecha) {
      const match = bodyText.match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
      if (match) fecha = `${match[3]}-${match[2]}-${match[1]}`;
    }

    let comercioRaw = '';

    const patronesNombre = [
      /Has recibido una transferencia de fondos de\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s*(?:hacia|hacia\s+tu\s+cuenta)/i,
      /transferencia de fondos de\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s*(?:hacia|hacia\s+tu\s+cuenta)/i,
      /Has\s+recibido.*de\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s+hacia/i,
      /de\s+([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)\s+hacia\s+tu\s+cuenta/i,
      /remitente[:\s]*([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)(?:\s*,|\s*$)/im,
      /Nombre\s+(?:del\s+)?(?:remitente|de\s+los?\s+fondos?)[:\s]*([A-ZÁÉÍÓÚÑa-záéíóúñ][A-ZÁÉÍÓÚÑa-záéíóúñ\s]{2,60}?)(?:\s*,|\s*$)/im,
    ];

    for (const patron of patronesNombre) {
      const match = bodyText.match(patron);
      if (match && match[1]) {
        comercioRaw = match[1].trim();
        break;
      }
    }

    if (!comercioRaw) {
      const tableNombre = this.extractTableValue($, tableRows, 'nombre') || this.extractTableValue($, tableRows, 'remitente');
      if (tableNombre && tableNombre.length > 2) {
        comercioRaw = tableNombre;
      }
    }

    const comercio = this.simplifyComercio(comercioRaw);

    let tipo_transaccion = 'gasto';
    if (/recibida|abono|depósito|recibiste|monto\s+recibido|has\s+recibido|transferencia.*recibida|a\s+tu\s+cuenta/i.test(bodyText)) {
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
    if (!raw || raw.length < 2) return '';
    let name = raw.trim();
    name = name.replace(/^(de|del|from)\s+/i, '');
    name = name.replace(/[,|.]+$/g, '');
    name = name.replace(/\s+/g, ' ').trim();

    const suffixes = ['CALAMA', 'SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA', 'LIMITADA', 'SA', 'S.A.', 'CHILE'];
    const words = name.split(/\s+/);
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()) && w.length > 1);
    name = filtered.join(' ');

    if (name.length < 2) return '';
    return name;
  }
}

export default BCITransferenciaParser;