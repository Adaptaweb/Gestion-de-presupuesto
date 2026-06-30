import db from './db.js';
import { detectBankFromSender, normalizeBankName } from './bankMapping.js';
import { generarFingerprint } from './fingerprint.js';

const templateCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function decodeQuotedPrintable(text) {
  if (!text) return text;
  try {
    const decoded = text
      .replace(/=\r?\n/g, '')
      .replace(/=([0-9A-Fa-f]{2})/g, (match, hex) => {
        return Buffer.from(hex, 'hex').toString('utf8');
      });
    return decoded;
  } catch {
    return text;
  }
}

function loadHtml(html) {
  if (typeof html !== 'string') return null;
  try {
    const { load } = require('cheerio');
    const decoded = decodeQuotedPrintable(html);
    return load(decoded);
  } catch {
    return null;
  }
}

function extractWithRegex(text, pattern, group = 1) {
  if (!text || !pattern) return null;
  try {
    const regex = new RegExp(pattern, 'i');
    const match = text.match(regex);
    if (match && match[group]) {
      return match[group].trim();
    }
  } catch {
    return null;
  }
  return null;
}

function extractWithSelector($, selector, attr = 'text') {
  try {
    const el = $(selector).first();
    if (el.length === 0) return null;
    if (attr === 'text') {
      return el.text().trim();
    }
    return el.attr(attr) || null;
  } catch {
    return null;
  }
}

function extractField($, bodyText, field, extraccion) {
  if (!extraccion || !extraccion[field]) return null;
  const config = extraccion[field];
  const { type, pattern, group, groups, format: formatStr, selectors, default: defaultVal } = config;

  try {
    if (type === 'regex' && pattern) {
      const result = extractWithRegex(bodyText, pattern, group || 1);
      return result || defaultVal || null;
    }

    if (type === 'selector' && selectors) {
      for (const selector of selectors) {
        const result = extractWithSelector($, selector, config.attr || 'text');
        if (result) return result;
      }
      return defaultVal || null;
    }

    if (type === 'conditional') {
      for (const cond of config.patterns || []) {
        if (bodyText.includes(cond.match)) {
          return cond.value;
        }
      }
      return config.default || null;
    }

    if (type === 'static') {
      return config.value || defaultVal || null;
    }
  } catch {
    return null;
  }

  return defaultVal || null;
}

function formatDate(dateStr, formatStr) {
  if (!dateStr || !formatStr) return dateStr;
  try {
    const parts = dateStr.match(/(\d+)/g);
    if (!parts || parts.length < 3) return dateStr;
    const [a, b, c] = parts;
    if (formatStr === 'YYYY-MM-DD') {
      return `${c}-${b}-${a}`;
    }
    if (formatStr === 'DD/MM/YYYY') {
      return `${a}/${b}/${c}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

function simplifyComercio(name) {
  if (!name) return '';
  let n = name.trim();
  n = n.replace(/^(de|del|from)\s+/i, '');
  n = n.replace(/[,|.]+$/g, '');
  n = n.replace(/\s+/g, ' ').trim();
  const suffixes = ['CALAMA', 'SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA', 'LIMITADA', 'SA', 'S.A.', 'CHILE', 'EMISORA', 'CUENTA'];
  const words = n.split(/\s+/);
  const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()) && w.length > 1);
  return filtered.join(' ') || n;
}

function normalizeMonto(montoStr) {
  if (!montoStr) return 0;
  const cleaned = String(montoStr).replace(/[$.]/g, '').replace(/,/g, '.').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num);
}

function extractWithTemplate(html, headers, template) {
  const $ = loadHtml(html);
  const bodyText = $ ? $.text().replace(/\s+/g, ' ') : html.replace(/\s+/g, ' ');
  const extraccion = template.extraccion_json || {};

  const montoRaw = extractField($, bodyText, 'monto', extraccion);
  const monto = montoRaw ? normalizeMonto(montoRaw) : 0;

  let fechaRaw = extractField($, bodyText, 'fecha', extraccion);
  let fecha = null;
  if (fechaRaw) {
    const formatted = formatDate(fechaRaw, extraccion.fecha?.format);
    if (formatted && /^\d{4}-\d{2}-\d{2}$/.test(formatted)) {
      fecha = formatted;
    } else {
      const match = formatted.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) {
        fecha = `${match[1]}-${match[2]}-${match[3]}`;
      }
    }
  }

  let comercioRaw = extractField($, bodyText, 'comercio', extraccion);
  if (comercioRaw) {
    comercioRaw = simplifyComercio(comercioRaw);
  }

  const tipo_transaccion = extractField($, bodyText, 'tipo_transaccion', extraccion) || 'gasto';
  const tipo_movimiento = extractField($, bodyText, 'tipo_movimiento', extraccion) || 'Transferencia';

  return {
    banco: template.banco,
    tipo_movimiento,
    tipo_tarjeta: '',
    monto,
    fecha,
    comercio: comercioRaw || '',
    tipo_transaccion,
    confianza: 0.9,
    fingerprint: template.fingerprint_hash,
    parser_nombre: template.parser_nombre || 'template',
  };
}

function matchFromPattern(from, fromPattern) {
  if (!fromPattern || fromPattern === '%') return true;
  const normalizedFrom = from.toLowerCase().replace(/^["'<]|["'>]$/g, '');
  if (fromPattern.startsWith('%') && fromPattern.endsWith('%')) {
    const domain = fromPattern.slice(1, -1);
    return normalizedFrom.includes(domain);
  }
  if (fromPattern.startsWith('%')) {
    const suffix = fromPattern.slice(1);
    return normalizedFrom.endsWith(suffix);
  }
  if (fromPattern.endsWith('%')) {
    const prefix = fromPattern.slice(0, -1);
    return normalizedFrom.startsWith(prefix);
  }
  return normalizedFrom.includes(fromPattern.toLowerCase());
}

export async function extractWithTemplateSystem(html, headers, userId = null) {
  const from = headers?.from || '';
  const subject = headers?.subject || '';
  const fingerprint = generarFingerprint(html, subject);
  const bank = detectBankFromSender(from);

  const cachedKey = `${bank}:${fingerprint}`;
  let template = templateCache.get(cachedKey);

  if (!template) {
    const rows = await db.all(
      `SELECT * FROM plantillas_email WHERE activo = TRUE AND (banco = $1 OR banco = $2) ORDER BY prioridad DESC, count_exitoso DESC LIMIT 10`,
      bank, normalizeBankName(bank)
    );

    for (const row of rows) {
      if (matchFromPattern(from, row.from_pattern)) {
        try {
          template = {
            ...row,
            extraccion_json: typeof row.extraccion_json === 'string' ? JSON.parse(row.extraccion_json) : row.extraccion_json,
          };
          break;
        } catch {
          continue;
        }
      }
    }
  }

  if (template) {
    templateCache.set(cachedKey, template);
    const result = extractWithTemplate(html, headers, template);

    if (result.monto && result.fecha) {
      return { ...result, template_id: template.id, is_template: true };
    }
  }

  return null;
}

export async function saveTemplateFromExtraction(parsed, html, headers, subject, userId) {
  const from = headers?.from || '';
  const fingerprint = generarFingerprint(html, subject);
  const bank = parsed.banco || detectBankFromSender(from);
  const tipoCorreo = parsed.tipo_movimiento?.toLowerCase() || 'transferencia';

  const existing = await db.get(
    'SELECT id FROM plantillas_email WHERE banco = $1 AND fingerprint_hash = $2',
    bank, fingerprint
  );

  if (existing) {
    await db.run(
      `UPDATE plantillas_email SET count_uso = count_uso + 1, count_exitoso = count_exitoso + 1, ultimo_uso = NOW() WHERE id = $1`,
      existing.id
    );
    return existing.id;
  }

  const fromPattern = `%${from.split('@')[1] || ''}%`;
  const extraccion = {
    monto: { type: 'regex', pattern: 'Monto[^$]*\\$([0-9.]+)', group: 1 },
    fecha: { type: 'regex', pattern: '(\\d{2})[\\/-](\\d{2})[\\/-](\\d{4})', groups: [3, 2, 1], format: 'YYYY-MM-DD' },
    comercio: { type: 'regex', pattern: 'cliente\\s+([^\\s]+)', group: 1 },
    tipo_transaccion: { type: 'conditional', patterns: [{ match: 'a tu cuenta', value: 'ingreso' }], default: 'gasto' },
  };

  await db.run(
    `INSERT INTO plantillas_email (banco, tipo_correo, fingerprint_hash, asunto_normalizado, from_pattern, extraccion_json, count_uso, count_exitoso, ultimo_uso, activo)
     VALUES ($1, $2, $3, $4, $5, $6, 1, 1, NOW(), TRUE)`,
    bank, tipoCorreo, fingerprint, subject.slice(0, 200), fromPattern, JSON.stringify(extraccion)
  );

  return null;
}

export async function markTemplateFailed(fingerprint, bank) {
  await db.run(
    `UPDATE plantillas_email SET count_fallido = count_fallido + 1 WHERE fingerprint_hash = $1 AND banco = $2`,
    fingerprint, bank
  );
}

export async function getActiveTemplatesForBank(bank) {
  return db.all(
    `SELECT * FROM plantillas_email WHERE banco = $1 AND activo = TRUE ORDER BY prioridad DESC, count_exitoso DESC`,
    bank
  );
}

export function invalidateCache() {
  templateCache.clear();
}

export { normalizeBankName };
