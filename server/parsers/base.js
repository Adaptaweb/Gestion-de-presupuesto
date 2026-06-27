import * as cheerio from 'cheerio';

export class BaseParser {
  constructor(nombre) {
    this.nombre = nombre;
  }

  puedeParsear(html, headers) {
    return false;
  }

  extraer(html, headers) {
    return null;
  }

  normalizarFecha(raw) {
    if (!raw) return null;
    const match = raw.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    const matchDash = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (matchDash) return raw;
    return null;
  }

  normalizarMonto(raw) {
    if (!raw) return null;
    let cleaned = raw.replace(/[^0-9.,\-]/g, '');
    if (cleaned.includes(',') && cleaned.includes('.')) {
      const lastDot = cleaned.lastIndexOf('.');
      const lastComma = cleaned.lastIndexOf(',');
      if (lastComma > lastDot) {
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        cleaned = cleaned.replace(/,/g, '');
      }
    } else if (cleaned.includes(',')) {
      cleaned = cleaned.replace('.', '').replace(',', '.');
    } else if (cleaned.includes('.')) {
      if (/\.\d{3}$/.test(cleaned)) {
        cleaned = cleaned.replace(/\./g, '');
      } else if (/\.\d{1,2}$/.test(cleaned)) {
        cleaned = cleaned.replace(/\.(?=.*\.)/g, '');
      } else {
        cleaned = cleaned.replace(/\./g, '');
      }
    }
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }

  extractTableValue($, rows, label) {
    for (const row of rows) {
      const cells = $(row).children('td');
      const cellText = cells.first().text().trim().toLowerCase();
      if (cellText.includes(label.toLowerCase())) {
        return cells.eq(1).text().trim() || cells.eq(1).html()?.trim() || '';
      }
    }
    return '';
  }

  loadHtml(html) {
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, .footer, .navbar, .menu, [aria-hidden="true"], [hidden]').remove();
    $('br').replaceWith('\n');
    $('td, th, p, div, li, h1, h2, h3, h4, h5, h6, hr').each(function() {
      $(this).append(' ');
    });
    return $;
  }
}

export default BaseParser;