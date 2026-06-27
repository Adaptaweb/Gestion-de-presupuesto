import * as cheerio from 'cheerio';
import db from './db.js';

const BANK_DOMAINS = {
  'bci.cl': 'BCI',
  'santander.cl': 'Santander',
  'bancochile.cl': 'Banco de Chile',
  'bancoestado.cl': 'Banco Estado',
  'scotiabank.cl': 'Scotiabank',
  'itau.cl': 'Itaú',
  'falabella.cl': 'Banco Falabella',
  'ripley.cl': 'Banco Ripley',
  'bancoparis.cl': 'Banco Paris',
  'machbank.cl': 'Mach',
  'mach.cl': 'Mach',
};

const CATEGORY_RULES = [
  { keywords: ['restaurant', 'restoran', 'cafetería', 'cafe', 'starbucks', 'hamburguesa', 'pizza', 'sushi', 'comida', 'almacen', 'supermercado', 'jumbo', 'lider', 'tottus', 'santa isabel', 'unimarc', 'aczent', 'te tin ka', 'mcdonald', 'kfc', 'delivery', 'pedidos ya', 'rapp', 'uber eats', 'docal', 'panader'], category: 'Mercadería' },
  { keywords: ['bar', 'cerveza', 'pubs', 'botilleria', 'botillería', 'licor', 'vino', 'pisco', 'ron', 'wisky', 'whisky', 'cervecería', 'restobar', 'karaoke', 'disco', 'club nocturno', 'happy hour', 'carrete', 'carretes'], category: 'Gustitos' },
  { keywords: ['copec', 'shell', 'petrobras', 'terpel', 'parra', 'bencinera', 'servicentro', 'metro de santiago', 'transporte', 'uber', 'cabify', 'did', 'taxi', 'bus', 'micro', 'colectivo', 'autopista', 'tag', 'peaje', 'pasaje', 'estacionamiento', 'parquimetro', 'parquímetro', 'valet'], category: 'Transporte' },
  { keywords: ['sodimac', 'easy', 'construcción', 'construccion', 'ferreteria', 'ferretería', 'hogar', 'mueble', 'deco', 'paris', 'falabella', 'ripley', 'la polar', 'abcdin', 'hites', 'corona', 'tricot', 'tienda', 'retail', 'mall', 'shop', 'shopping'], category: 'Compras' },
  { keywords: ['farmacia', 'farmacias', 'salud', 'clínica', 'clinica', 'hospital', 'médico', 'medico', 'doctor', 'dentista', 'óptica', 'optica', 'laboratorio', 'isapre', 'fonasa', 'bono', 'consulta', 'cruz verde', 'salco', 'ahumada', 'gimnasio', 'gym', 'crossfit', 'spinning', 'yoga', 'pilates', 'natación', 'fitness', 'deporte', 'cancha', 'clases deportivas'], category: 'Salud y deportes' },
  { keywords: ['colegio', 'universidad', 'instituto', 'preuniversitario', 'preu', 'matrícula', 'matricula', 'mensualidad colegio', 'arancel', 'cursos', 'capacitación', 'capacitacion', 'idiomas', 'inglés', 'ingles', 'toefl', 'ielts', 'certificación', 'certificacion', 'diplomado', 'magister', 'máster', 'master', 'postgrado', 'educación', 'educacion'], category: 'Educación' },
  { keywords: ['netflix', 'spotify', 'disney', 'hbo', 'max', 'prime video', 'star+', 'paramount', 'crunchyroll', 'playstation', 'xbox', 'nintendo', 'steam', 'twitch', 'youtube premium', 'youtube music', 'apple music', 'apple tv', 'icloud', 'apple.com/bill', 'microsoft 365', 'office 365', 'adobe', 'notion', 'figma', 'dropbox', 'google one', 'google storage', 'icloud+', 'chatgpt', 'openai', 'patreon', 'onlyfans', 'amazon prime', 'paramount+', 'apple one', 'zoom', 'github', 'notion ai', 'perplexity', 'cursor', 'membership', 'mensualidad', 'suscripc', 'subscription', 'recurring', 'plan mensual', 'plan anual', 'premium', 'linkedin premium'], category: 'Suscripciones' },
  { keywords: ['aerolínea', 'aerolinea', 'aerolineas', 'latam', 'sky airline', 'jetsmart', 'vuelo', 'vuelos', 'pasaje aereo', 'hotel', 'hostal', 'hostal', 'airbnb', 'booking', 'trivago', 'hospedaje', 'reserva', 'turismo', 'tour', 'paquete turistico', 'paquete turístico', 'vacaciones', 'viaje', 'viajes', 'europamundo', 'agencia de viaje'], category: 'Viajes y vacaciones' },
  { keywords: ['donación', 'donacion', 'donaciones', 'iglesia', 'templo', 'ofrenda', 'diezmo', 'caridad', 'teleton', 'teletón', 'fundación', 'fundacion', 'ong', 'regalo', 'regalos', 'presente', 'gift', 'crowdfunding', 'gofundme'], category: 'Donaciones y regalos' },
  { keywords: ['luz', 'chilquinta', 'enel', 'cge', 'aguas andinas', 'essbio', 'aguas nuevas', 'nuevosur', 'agua potable', 'gasco', 'lipigas', 'abastible', 'metrogas', 'gas', 'telefono', 'movistar', 'entel', 'claro', 'wom', 'vtr', 'internet', 'plan telef', 'agua', 'comunidad', 'gasto común', 'gasto comun', 'condominio', 'arriendo', 'rent', 'alquiler', 'hipoteca', 'dividendo', 'contribuciones', 'seguro', 'seguros', 'mutualidad', 'casa', 'hogar admin'], category: 'Casa y cuentas' },
  { keywords: ['interés', 'interes', 'intereses', 'comisión', 'comision', 'comisiones', 'mantención cuenta', 'mantencion cuenta', 'mantención', 'mantencion', 'cargo mensual', 'cobro banco', 'cobro bancario'], category: 'Intereses' },
  { keywords: ['cmr', 'falabella tarjeta', 'ripley tarjeta', 'presto', 'la polar tarjeta', 'abcdin tarjeta', 'hites tarjeta', 'cencosud', 'paris tarjeta', 'cuota', 'cuotas', 'credito consumo', 'crédito consumo', 'avance', 'avance en efectivo', 'super avance', 'superavance'], category: 'Créditos de consumo' },
  { keywords: ['comision transferencia', 'cobro transferencia', 'cobro uso', 'comision uso', 'mantención tarjeta', 'mantencion tarjeta', 'cobro administrativo', 'cobro mensual', 'administracion cuenta', 'comision bancaria'], category: 'Gastos bancarios' },
  { keywords: ['steam juego', 'playstation store', 'xbox store', 'nintendo eshop', 'epic games', 'gog.com', 'riot games', 'blizzard', 'riot', 'juego', 'videojuego', 'gaming', 'twitch subscription'], category: 'Juegos' },
  { keywords: ['depósito', 'deposito', 'abono', 'transferencia recibida', 'sueldo', 'salario', 'remuneracion', 'remuneración', 'pago empresa', 'nómina', 'nomina', 'finiquito', 'liquidacion', 'liquidación'], category: 'Sueldo' },
  { keywords: ['ahorro programado', 'ahorro cuenta', 'depósito ahorro', 'deposito ahorro', 'cuenta ahorro', 'transferencia a ahorro'], category: 'Ahorro' },
  { keywords: ['dividendo acción', 'dividendo accion', 'cupón', 'cupones', 'renta fija', 'renta variable', 'mutuo', 'fondo mutuo', 'apv', 'bolsa', 'acciones', 'cripto', 'bitcoin', 'ethereum', 'usdt', 'inversion', 'inversión'], category: 'Inversiones / Renta' },
  { keywords: ['devolución', 'devolucion', 'reembolso', 'reintegro', 'cashback', 'promocion', 'promoción', 'descuento', 'premio', 'regalo banco', 'ajuste'], category: 'Otros ingresos' },
  { keywords: ['giro', 'comision envio', 'transferencia enviada', 'pago a tercero', 'pago de deuda', 'movimiento interno', 'traspaso'], category: 'Sin categoría' },
  { keywords: ['mercado pago', 'mercadopago', 'transferencia', 'banco'], category: 'Otros' },
];

function detectBank(headers, html) {
  const fromHeader = headers?.from || headers?.From || '';
  for (const [domain, name] of Object.entries(BANK_DOMAINS)) {
    if (fromHeader.includes(domain) || html.includes(domain)) {
      return name;
    }
  }
  const lower = html.toLowerCase();
  if (lower.includes('bch.png') || lower.includes('banco de chile') || lower.includes('enviodigital@bancochile')) return 'Banco de Chile';
  if (lower.includes('bci') || lower.includes('banco crédito') || lower.includes('banco credito')) return 'BCI';
  if (lower.includes('santander')) return 'Santander';
  if (lower.includes('banco estado')) return 'Banco Estado';
  if (lower.includes('machbank') || lower.includes('mach ')) return 'Mach';
  return 'Otros';
}

function extractTableValue($, rows, label) {
  for (const row of rows) {
    const cells = $(row).children('td');
    const cellText = cells.first().text().trim().toLowerCase();
    if (cellText.includes(label.toLowerCase())) {
      const val = cells.eq(1).text().trim();
      return val || cells.eq(1).html()?.trim() || '';
    }
  }
  return '';
}

function parseInlineText(bodyText) {
  const result = {};

  const amountMatch = bodyText.match(/US\$?([0-9]+[,.][0-9]+)/);
  if (amountMatch) {
    const raw = amountMatch[0];
    const num = parseFloat(amountMatch[1].replace(',', '.'));
    result.monto = num;
    result.moneda = 'USD';
    result.montoRaw = raw;
  }

  const afterEn = bodyText.split(/[\s]+en[\s]+/);
  if (afterEn.length > 1) {
    const candidate = afterEn.slice(1).join(' en ').trim();
    const comercioMatch = candidate.match(/^(.+?)[\s]+(?:el\s+\d{2}\/\d{2}\/\d{4}|con\s+fecha|\d{2}\/\d{2}\/\d{4}|por\s+US|\d{4}-\d{2}-\d{2})/i);
    if (comercioMatch) {
      result.comercio = comercioMatch[1].replace(/[\s]+por[\s]+US.*$/, '').replace(/\s+\d{10,}\s*.*$/, '').trim();
    }
  }
  if (!result.comercio) {
    const m = bodyText.match(/en\s+([A-Z][A-Z0-9.\/\s\-]{2,50}?)(?:\s+el\s+\d{2}\/\d{2}\/\d{4}|\s+\d{2}\/\d{2}\/\d{4})/i);
    if (m) result.comercio = m[1].trim();
  }
  if (!result.comercio) {
    const m = bodyText.match(/en\s+([^\s]+(?:\s+[^\s]+){0,3}?)(?:\s+(?:el|por|con|\d{2}\/))/i);
    if (m) result.comercio = m[1].trim();
  }

  const dateMatch = bodyText.match(/el\s+(\d{2}\/\d{2}\/\d{4})/);
  if (dateMatch) {
    result.fecha = dateMatch[1];
  } else {
    const d = bodyText.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (d) result.fecha = d[1];
  }

  return result;
}

async function fetchUsdRate() {
  try {
    const res = await fetch('https://mindicador.cl/api/dolar');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rate = data?.serie?.[0]?.valor;
    if (rate && rate > 0) return rate;
  } catch (e) {
    console.error('[USD Rate] Error fetching from mindicador.cl:', e.message);
  }
  return null;
}

async function convertToClp(usdAmount) {
  const rate = await fetchUsdRate();
  if (!rate) return Math.round(usdAmount * 950);
  return Math.round(usdAmount * rate);
}

const KNOWN_TABLE_LABELS = ['monto', 'fecha', 'comercio', 'número tarjeta', 'nro tarjeta', 'numero tarjeta', 'hora', 'cuotas', 'valor cuota', 'nombre y apellido', 'nombre', 'n° cuenta', 'nro cuenta', 'banco', 'rut', 'email', 'tipo de cuenta'];

function hasRealDataTable($) {
  const allRows = $('tr').toArray().filter(r => $(r).children('td').length >= 2);
  for (const row of allRows) {
    const cells = $(row).children('td');
    if (cells.length < 2) continue;
    const text = cells.first().text().trim().toLowerCase();
    for (const label of KNOWN_TABLE_LABELS) {
      if (text.includes(label)) return true;
    }
  }
  return false;
}

async function parseHTML(html, headers = {}, userId = null) {
  const $ = cheerio.load(html);
  const bodyText = $.text();

  const bank = detectBank(headers, bodyText);
  const hasUsd = bodyText.includes('US$');

  let tipo_movimiento = 'Compra';
  if (bodyText.includes('retiro') || bodyText.includes('Retiro')) tipo_movimiento = 'Retiro';
  else if (bodyText.includes('transferencia') || bodyText.includes('Transferencia') || bodyText.includes('traspaso') || bodyText.includes('Traspaso')) tipo_movimiento = 'Transferencia';
  else if (/cargo/i.test(bodyText)) {
    const falsePositives = ['devolución de este cargo', 'validar tu tarjeta', 'hacen un cargo de', 'este cargo tarda'];
    const isValidation = falsePositives.some(t => bodyText.toLowerCase().includes(t));
    if (!isValidation) tipo_movimiento = 'Cargo';
  }

  const subjectText = (headers['subject'] || headers['Subject'] || '').toLowerCase();
  const allText = `${subjectText} ${bodyText}`.toLowerCase();
  let tipo_tarjeta = '';
  if (/d[eé]bito/.test(allText)) tipo_tarjeta = 'Débito';
  else if (/cr[eé]dito/.test(allText)) tipo_tarjeta = 'Crédito';

  let tipo_transaccion_auto = null;
  if (tipo_movimiento === 'Transferencia') {
    if (/a terceros|transferencia enviada|giro por transferencia|realizaste una transferencia|transferiste|comprobante de transferencia/i.test(bodyText)) {
      tipo_transaccion_auto = 'gasto';
    } else if (/recibida|abono por|depósito por transferencia|recibiste un depósito|monto recibido|\bdepósito\b/i.test(bodyText)) {
      tipo_transaccion_auto = 'ingreso';
    } else if (/traspaso|entre cuentas|movimiento interno/i.test(bodyText)) {
      tipo_transaccion_auto = 'interno';
    }
  }

  const messageId = headers['message-id'] || headers['Message-ID'] || headers['message_id'] || '';

  let monto, fecha, comercio;
  let usedTable = false;

  if (hasRealDataTable($)) {
    usedTable = true;
  }

  const tableRows = $('table table tr').toArray().filter(r => $(r).children('td').length >= 2);
  if (tableRows.length === 0) {
    const allRows = $('tr').toArray().filter(r => $(r).children('td').length >= 2);
    tableRows.push(...allRows);
  }

  if (tableRows.length > 0) {
    usedTable = true;

    let montoRaw = extractTableValue($, tableRows, 'monto');
    monto = parseMonto(montoRaw);

    const clpRaw = extractTableValue($, tableRows, 'monto clp');
    if (clpRaw) {
      const clpParsed = parseMonto(clpRaw);
      if (clpParsed) monto = clpParsed;
    }

    let fechaRaw = extractTableValue($, tableRows, 'fecha');
    fecha = parseFecha(fechaRaw);

    let comercioRaw = extractTableValue($, tableRows, 'comercio');
    comercio = simplifyComercio(comercioRaw || '');

    if (!comercio && tipo_movimiento === 'Transferencia') {
      const nombreRaw = extractTableValue($, tableRows, 'nombre');
      if (nombreRaw) comercio = simplifyComercio(nombreRaw);
    }
  }

  if (!monto && hasUsd) {
    const inline = parseInlineText(bodyText);
    if (inline.monto) {
      monto = await convertToClp(inline.monto);
      if (!comercio && inline.comercio) comercio = simplifyComercio(inline.comercio);
      if (!fecha && inline.fecha) fecha = parseFecha(inline.fecha);
    }
  }

  if (!monto) {
    const clpData = parseClpText(bodyText);
    if (clpData.monto) {
      monto = clpData.monto;
      if (!comercio && clpData.comercio) comercio = simplifyComercio(clpData.comercio);
      if (!fecha && clpData.fecha) fecha = parseFecha(clpData.fecha);
    }
  }

  if (!fecha) {
    const dateMatch = bodyText.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
    if (dateMatch) fecha = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
  }

  if (usedTable && !comercio && !hasUsd) {
    const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
    const comercioLine = lines.find(l => l.toLowerCase().includes('comercio'));
    if (comercioLine) {
      comercio = simplifyComercio(comercioLine.replace(/comercio/i, '').replace(/:/, '').trim());
    }
    if (!comercio) {
      const strongTags = $('strong').toArray();
      for (const tag of strongTags) {
        const text = $(tag).text().trim();
        if (text.length > 3
          && !text.toLowerCase().includes('débito')
          && !text.toLowerCase().includes('debito')
          && !text.includes('@')
          && !text.toLowerCase().includes('transferencia')
          && !text.toLowerCase().includes('comprobante de')
        ) {
          comercio = simplifyComercio(text);
          break;
        }
      }
    }
  }

  if (!comercio && tipo_movimiento === 'Transferencia') {
    const nombreMatch = bodyText.match(/Nombre\s+(?:del\s+)?(?:destinatario|remitente|y\s+Apellido)[:\s]?(.*?)(?=\s*Monto|\s*Rut|\s*Email|\s*Banco|$)/i);
    if (nombreMatch && nombreMatch[1].trim()) {
      comercio = simplifyComercio(nombreMatch[1].trim());
    }
  }

  if (!comercio && tipo_movimiento === 'Transferencia') {
    const bancoOrigen = extractTableValue($, $('tr').toArray().filter(r => $(r).children('td').length >= 2), 'banco de origen');
    if (bancoOrigen) comercio = simplifyComercio(bancoOrigen);
  }

  let categoria = categorize(comercio || '', comercio || '', bodyText);

  if (userId && comercio) {
    const saved = await db.get('SELECT categoria FROM clasificacion_comercios WHERE user_id = $1 AND comercio = $2', userId, comercio.toLowerCase());
    if (saved) categoria = saved.categoria;
  }

  if (!monto || !fecha) return {};

  return { banco: bank, tipo_movimiento, tipo_tarjeta, monto, comercio: comercio || '', fecha, categoria, email_id: messageId, tipo_transaccion_auto };
}

function parseMonto(raw) {
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

function parseFecha(raw) {
  if (!raw) return null;
  const match = raw.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;
  const matchDash = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (matchDash) return raw;
  return null;
}

function parseClpText(bodyText) {
  const result = {};

  const amountRegex = /\$[\s]*([0-9]{1,3}(?:\.[0-9]{3})*(?:[,][0-9]{1,2})?|\d{5,})/g;
  let amatch;
  const amounts = [];
  while ((amatch = amountRegex.exec(bodyText)) !== null) {
    const parsed = parseMonto(amatch[1]);
    if (parsed && parsed >= 500) amounts.push(parsed);
  }
  if (amounts.length > 0) result.monto = amounts[0];

  const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    if (/^[Cc]omercio[:.\s]/.test(lines[i])) {
      let val = lines[i].replace(/^[Cc]omercio[:.\s]+/, '').trim();
      if (!val && i + 1 < lines.length) val = lines[i + 1];
      if (val && val.length < 100 && !val.startsWith('$')) {
        result.comercio = val;
        break;
      }
    }
    if (!result.comercio) {
      const m = lines[i].match(/^En\s+(.+)/);
      if (m && m[1].length < 100 && !m[1].startsWith('$')) {
        result.comercio = m[1].trim();
        break;
      }
    }
  }

  const dateMatch = bodyText.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);
  if (dateMatch) result.fecha = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;

  return result;
}

function simplifyComercio(raw) {
  if (!raw) return '';
  let name = raw.trim();
  name = name.replace(/[\s,]+(?:US|USA|MEX|COL|ARG|PER|BRA|CHL)\s*$/i, '');
  name = name.replace(/[\s]+\d{3}-\d{3}-\d{4}\s*$/, '');
  name = name.replace(/[\s]+\d{7,}\s*$/, '');
  const prefixes = ['ALMACENES ', 'TIENDAS ', 'SUPERMERCADO ', 'FARMACIAS ', 'BANCO ', 'CINE '];
  for (const p of prefixes) {
    if (name.startsWith(p)) {
      name = name.slice(p.length);
      break;
    }
  }
  const words = name.split(' ');
  const suffixes = ['CALAMA', 'SANTIAGO', 'PROVIDENCIA', 'LAS CONDES', 'VITACURA', 'SPA', 'LTD', 'LTDA', 'LIMITADA', 'SA', 'S.A.'];
  const filtered = words.filter(w => !suffixes.includes(w.toUpperCase()));
  if (filtered.length > 0) name = filtered.join(' ');
  name = name.replace(/\s+/g, ' ').trim();
  const lastChar = name.charAt(name.length - 1);
  if (lastChar === ',' || lastChar === '.') name = name.slice(0, -1).trim();
  if (name.length === 0) return raw.trim();
  return name;
}

function categorize(comercio, comercioRaw, bodyText) {
  const text = `${comercio} ${comercioRaw} ${bodyText}`.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (text.includes(kw)) return rule.category;
    }
  }
  return 'Otros';
}

function extractGmailAuthUrl(html, text) {
  if (!html && !text) return null;

  const content = html || text;
  const lowerContent = content.toLowerCase();

  const isGmailAuthEmail = lowerContent.includes('accounts.google.com') ||
                           lowerContent.includes('gmail.com') ||
                           lowerContent.includes('google.com') ||
                           lowerContent.includes('verificar') ||
                           lowerContent.includes('confirm') ||
                           lowerContent.includes('autoriz');

  if (!isGmailAuthEmail) return null;

  const urlPatterns = [
    /https:\/\/accounts\.google\.com[^\s"'<>)\]]+/gi,
    /https:\/\/mail\.google\.com[^\s"'<>)\]]+/gi,
    /https:\/\/www\.google\.com\/accounts[^\s"'<>)\]]+/gi,
    /https:\/\/accounts\.google\.co\.cl[^\s"'<>)\]]+/gi,
    /https:\/\/mail-settings\.google\.com\/mail\/vf[^\s"'<>)\]]+/gi,
  ];

  const authKeywords = ['confirm', 'verify', 'signup', 'signin', 'disable', 'enable', 'approval', 'authorize', 'verificar', 'autorizar', 'confirmar'];

  for (const pattern of urlPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const url of matches) {
        const urlLower = url.toLowerCase();
        const hasAuthKeyword = authKeywords.some(kw => urlLower.includes(kw));
        if (hasAuthKeyword) {
          try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('google.com') || urlObj.hostname.includes('gmail.com')) {
              return url.split('&')[0].split('#')[0];
            }
          } catch {
            continue;
          }
        }
      }
    }
  }

  const generalUrlPattern = /https:\/\/[^\s"'<>)\]]+/gi;
  const generalMatches = content.match(generalUrlPattern);
  if (generalMatches) {
    for (const url of generalMatches) {
      const urlLower = url.toLowerCase();
      const isGoogle = urlLower.includes('google.com') || urlLower.includes('gmail.com');
      const hasAuthKeyword = authKeywords.some(kw => urlLower.includes(kw));
      if (isGoogle && hasAuthKeyword) {
        return url.split('&')[0].split('#')[0];
      }
    }
  }

  return null;
}

function isGmailAuthorizationEmail(from, subject, html, text) {
  if (!from && !subject) return false;

  const fromLower = (from || '').toLowerCase();
  const subjectLower = (subject || '').toLowerCase();
  const content = (html || text || '').toLowerCase();

  const isFromGoogle = fromLower.includes('@google.com') ||
                       fromLower.includes('@gmail.com') ||
                       fromLower.includes('google.com') ||
                       fromLower.includes('no-reply@');

  const authSubjects = [
    'confirm', 'verify', 'verificar', 'autoriz', 'confirmac',
    'new device', 'nuevo dispositivo', 'sign-in', 'inicio de sesi',
    'security', 'seguridad', 'enable', 'disable', 'aprobar',
    'reenv', 'forwarding', 'redirect'
  ];

  const hasAuthSubject = authSubjects.some(s => subjectLower.includes(s));

  const hasGmailInterface = content.includes('accounts.google.com') ||
                            content.includes('mail.google.com') ||
                            content.includes('gmail.com');

  return isFromGoogle && (hasAuthSubject || hasGmailInterface);
}

export { parseHTML, detectBank, categorize, simplifyComercio, parseMonto, parseFecha, fetchUsdRate, convertToClp, extractGmailAuthUrl, isGmailAuthorizationEmail };
export default { parseHTML };
