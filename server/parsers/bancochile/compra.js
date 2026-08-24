import { BaseParser } from '../base.js';

export class BancoChileCompraParser extends BaseParser {
  constructor() {
    super('BancoChile.compra');
  }

  puedeParsear(html, headers) {
    const from = (headers?.from || '').toLowerCase();
    return (from.includes('bancochile.cl') || from.includes('enviodigital@bancochile')) &&
           /compra|tarjeta/.test(html);
  }

  extraer(html, headers) {
    const $ = this.loadHtml(html);
    const rawText = $.text();
    const bodyText = rawText.replace(/\s+/g, ' ').trim();
    const rows = $('table tr').toArray().filter(r => $(r).children('td').length >= 2);
    const tableRows = rows.length > 0 ? rows : $('tr').toArray().filter(r => $(r).children('td').length >= 2);

    // Formato "sentencia" (notificaciones tipo "Te informamos que se ha realizado
    // una compra/giro por $X con Tarjeta de Crédito/Débito ****NNNN en COMERCIO
    // el DD/MM/YYYY HH:MM") — usado por Banco de Chile en vez de una tabla de datos.
    const sentenceMatch = bodyText.match(
      /se\s+ha\s+realizado\s+(?:un|una)\s+(?:compra|giro|pago)\s+por\s+\$?\s*([\d.,]+)\s+con\s+Tarjeta\s+de\s+(Cr[eé]dito|D[eé]bito)\s+\*+\d*\s+en\s+(.+?)\s+el\s+(\d{2}\/\d{2}\/\d{4})/i
    );

    let monto, fecha, comercioRaw, tipo_tarjeta;

    if (sentenceMatch) {
      monto = this.normalizarMonto(sentenceMatch[1]);
      tipo_tarjeta = /d[eé]bito/i.test(sentenceMatch[2]) ? 'Débito' : 'Crédito';
      comercioRaw = sentenceMatch[3];
      fecha = this.normalizarFecha(sentenceMatch[4]);
    }

    if (!monto) {
      const montoRaw = this.extractTableValue($, tableRows, 'monto');
      monto = this.normalizarMonto(montoRaw);
    }

    if (!fecha) {
      let fechaRaw = this.extractTableValue($, tableRows, 'fecha');
      fecha = this.normalizarFecha(fechaRaw);
    }
    if (!fecha) {
      const match = bodyText.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
      if (match) fecha = `${match[3]}-${match[2]}-${match[1]}`;
    }

    if (!comercioRaw) {
      comercioRaw = this.extractTableValue($, tableRows, 'establecimiento') ||
                    this.extractTableValue($, tableRows, 'comercio');
    }
    if (!comercioRaw) {
      const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
      const comercioLine = lines.find(l => l.toLowerCase().includes('establecimiento'));
      if (comercioLine) comercioRaw = comercioLine.replace(/establecimiento/i, '').replace(/:/, '').trim();
    }
    let comercio = this.simplifyComercio(comercioRaw || '');
    if (this.esTextoPromocional(comercio)) comercio = '';

    if (!tipo_tarjeta) {
      tipo_tarjeta = /d[eé]bito/.test(bodyText) ? 'Débito' : 'Crédito';
    }

    return {
      banco: 'Banco de Chile',
      tipo_movimiento: 'Compra',
      tipo_tarjeta,
      monto,
      fecha,
      comercio,
    };
  }

  // Filtra frases de marketing/pie de página que a veces terminan en la celda
  // contigua al label "establecimiento" cuando el correo no usa formato tabla.
  esTextoPromocional(texto) {
    if (!texto) return false;
    return /realiza todo de forma|revisa saldos|banco en l[ií]nea|app mi banco|descarga (?:la )?app|t[ée]rminos y condiciones/i.test(texto)
      || texto.length > 60;
  }

  simplifyComercio(raw) {
    if (!raw) return '';
    let name = raw.trim();
    const words = name.split(' ');
    const suffixes = ['SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA'];
    const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()));
    return filtered.join(' ').replace(/\s+/g, ' ').trim();
  }
}

export default BancoChileCompraParser;