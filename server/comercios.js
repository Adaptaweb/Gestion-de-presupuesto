// Nombres de comercio legibles.
//
// Los avisos del banco traen el texto del adquirente: "PAYU *UBER TRIP CL",
// "MERPAGO*RAPPI", "DLO*DIDI SANTIAGO". Aqui se decide el nombre que se muestra,
// en este orden:
//   1. lo que el usuario ya renombro (mismo texto, o uno casi igual),
//   2. una marca conocida que aparece en el texto,
//   3. una limpieza general: sin pasarela de pago, sin sufijo de pais o ciudad,
//      sin numero de sucursal y con mayusculas de titulo.
// El texto del banco se guarda siempre en comercio_original.

import { levenshteinSimilarity } from './embeddings.js';

// Marcas que se reconocen dentro del texto. El orden importa: las mas
// especificas (Uber Eats) van antes que las generales (Uber).
export const MARCAS = [
  ['Uber Eats', /\buber\s*\*?\s*eats?\b/],
  ['Uber', /\buber\b/],
  ['DiDi', /\bdidi\b/],
  ['Cabify', /\bcabify\b/],
  ['Rappi', /\brappi\b/],
  ['PedidosYa', /\bpedidos\s*ya\b/],
  ['Mercado Libre', /\bmercado\s*libre\b|\bmercadolibre\b/],
  ['Netflix', /\bnetflix\b/],
  ['Spotify', /\bspotify\b/],
  ['YouTube', /\byoutube/],
  ['Google', /\bgoogle\b/],
  ['Apple', /\bapple\.com\b|\bitunes\b|\bapple\b/],
  ['Amazon Prime Video', /\bprime\s*video\b/],
  ['Amazon', /\bamazon\b|\bamzn\b/],
  ['Disney+', /\bdisney\s*(plus|\+)?/],
  ['HBO Max', /\bhbo\s*max\b|\bhbomax\b/],
  ['Paramount+', /\bparamount\b/],
  ['Zapping', /\bzapping\b/],
  ['Steam', /\bsteam(games|powered)?\b/],
  ['PlayStation', /\bplaystation\b|\bsony\s*interactive\b/],
  ['Xbox', /\bxbox\b/],
  ['Microsoft', /\bmicrosoft\b|\bmsft\b/],
  ['OpenAI', /\bopenai\b|\bchatgpt\b/],
  ['Anthropic', /\banthropic\b|\bclaude\.ai\b/],
  ['Cloudflare', /\bcloudflare\b/],
  ['Starbucks', /\bstarbucks\b|\bsbx\b/],
  ["McDonald's", /\bmc\s*donald'?s?\b/],
  ['Burger King', /\bburger\s*king\b/],
  ['KFC', /\bkfc\b/],
  ['Copec', /\bcopec\b/],
  ['Shell', /\bshell\b/],
  ['Petrobras', /\bpetrobras\b/],
  ['Jumbo', /\bjumbo\b/],
  ['Líder', /\blider\b|\blíder\b/],
  ['Santa Isabel', /\bsanta\s*isabel\b/],
  ['Unimarc', /\bunimarc\b/],
  ['Tottus', /\btottus\b/],
  ['Falabella', /\bfalabella\b/],
  ['Ripley', /\bripley\b/],
  ['Sodimac', /\bsodimac\b/],
  ['Entel', /\bentel\b/],
  ['Movistar', /\bmovistar\b/],
  ['WOM', /\bwom\b/],
  ['VTR', /\bvtr\b/],
  ['Enel', /\benel\b/],
  ['Aguas Andinas', /\baguas\s*andinas\b/],
  ['Metrogas', /\bmetrogas\b/],
  ['Smart Fit', /\bsmart\s*fit\b/],
  ['Cruz Verde', /\bcruz\s*verde\b/],
  ['Salcobrand', /\bsalcobrand\b/],
  ['Farmacias Ahumada', /\bahumada\b/],
  ['Temu', /\btemu\b/],
  ['AliExpress', /\baliexpress\b/],
  ['Shein', /\bshein\b/],
];

// Pasarelas que anteponen su nombre al del comercio: "PAYU *UBER", "MP*RAPPI".
const PASARELA = /^(?:payu|merpago|mercado\s*pago|mercpago|mp|dlo|dlocal|sumup|paypal|pp|stripe|ebanx|getnet|kushki|klap|flow|tuu|sq|izettle|pagofacil|khipu)\s*\*+\s*/i;

// Lo que sobra al final: pais, ciudad o comuna frecuente, sucursal.
const SUFIJOS = /(?:\s+(?:cl|chl|chile|scl|stgo|santiago|providencia|las\s+condes|vitacura|nunoa|ñuñoa|calama|antofagasta|vina\s+del\s+mar|concepcion|spa|ltda|limitada|s\.?a\.?|eirl))+\s*$/i;
const SUCURSAL = /(?:\s*[#nN]°?\s*\d+|\s+\d{3,}|\s+s\/n)+\s*$/;

const CONECTORES = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en']);

const sinTildes = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

// Clave para comparar textos del banco: minusculas, sin tildes ni simbolos.
export function claveComercio(texto) {
  return sinTildes(String(texto || '').toLowerCase()).replace(/[^a-z0-9]+/g, ' ').trim();
}

function titulo(texto) {
  return texto.split(' ').map((p, i) => {
    const min = p.toLowerCase();
    if (i > 0 && CONECTORES.has(min)) return min;
    // Siglas sin vocales (KFC, VTR, BCI) se dejan en mayusculas.
    if (!/[aeiouáéíóú]/i.test(p) && p.length <= 4) return p.toUpperCase();
    return min.charAt(0).toUpperCase() + min.slice(1);
  }).join(' ');
}

/**
 * Nombre legible para el texto que trae el banco. Devuelve { nombre, regla }
 * con regla 'marca', 'limpieza' o 'sin_cambio'.
 */
export function limpiarComercio(original) {
  const bruto = String(original || '').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\s+/g, ' ').trim();
  if (!bruto) return { nombre: '', regla: 'sin_cambio' };

  const busqueda = sinTildes(bruto.toLowerCase());
  for (const [nombre, patron] of MARCAS) {
    if (patron.test(busqueda)) return { nombre, regla: 'marca' };
  }

  let n = bruto;
  for (let i = 0; i < 2 && PASARELA.test(n); i++) n = n.replace(PASARELA, '');
  n = n.replace(/^www\./i, '').replace(/\.(com|cl|net|org|io)(\.[a-z]{2})?\b/gi, '');
  n = n.replace(/\*+/g, ' ').replace(/\s+/g, ' ').trim();
  for (let i = 0; i < 3; i++) n = n.replace(SUCURSAL, '').replace(SUFIJOS, '').trim();
  n = n.replace(/[\s,.-]+$/, '').trim();
  if (n.length < 2) n = bruto;

  // Solo se pasa a titulo lo que viene todo en mayusculas (como lo escribe el
  // banco); un nombre ya escrito a mano, como el de una persona, se respeta.
  const todoMayus = n === n.toUpperCase() && /[A-Z]/.test(n);
  if (todoMayus) n = titulo(n);

  return { nombre: n, regla: n === bruto ? 'sin_cambio' : 'limpieza' };
}

let db = null;
export function setDb(database) { db = database; }

/**
 * Nombre final para un texto del banco y un usuario: primero lo que el usuario
 * renombro (mismo texto o uno casi igual), luego la limpieza.
 */
export async function resolverComercio(original, userId) {
  const limpio = limpiarComercio(original);
  if (!db || !userId || !original) return limpio;
  const clave = claveComercio(original);
  try {
    const exacto = await db.get('SELECT nombre FROM alias_comercios WHERE user_id = $1 AND clave = $2', userId, clave);
    if (exacto?.nombre) return { nombre: exacto.nombre, regla: 'aprendido' };
    const alias = await db.all('SELECT clave, nombre FROM alias_comercios WHERE user_id = $1', userId);
    let mejor = null;
    for (const a of alias) {
      const s = levenshteinSimilarity(clave, a.clave);
      if (s >= 0.9 && (!mejor || s > mejor.s)) mejor = { s, nombre: a.nombre };
    }
    if (mejor) return { nombre: mejor.nombre, regla: 'aprendido' };
  } catch (e) {
    console.error('[comercios] no se pudo leer alias_comercios:', e.message);
  }
  return limpio;
}

/**
 * Completa un resultado del lector de correos: guarda el texto del banco en
 * comercio_original, pone el nombre legible y, si el usuario ya clasifico ese
 * comercio, usa su categoria (antes las plantillas se saltaban este paso).
 */
export async function completarComercio(parsed, userId) {
  if (!parsed) return parsed;
  const original = parsed.comercio || '';
  const { nombre } = await resolverComercio(original, userId);
  parsed.comercio_original = original;
  parsed.comercio = nombre || original;
  if (db && userId && parsed.comercio) {
    try {
      const guardada = await db.get(
        'SELECT categoria FROM clasificacion_comercios WHERE user_id = $1 AND comercio IN ($2, $3) ORDER BY updated_at DESC LIMIT 1',
        userId, parsed.comercio.toLowerCase(), original.toLowerCase()
      );
      if (guardada?.categoria) parsed.categoria = guardada.categoria;
    } catch { /* sin clasificacion previa */ }
  }
  return parsed;
}

/**
 * Cuando el usuario cambia el nombre de un comercio, se aprende para el texto
 * del banco y se aplica a sus otros movimientos con ese mismo texto que aun
 * muestran el nombre automatico.
 */
export async function aprenderNombre(userId, original, nombreAnterior, nombreNuevo, exceptoId) {
  if (!db || !userId || !original || !nombreNuevo || nombreNuevo === nombreAnterior) return 0;
  await db.run(
    `INSERT INTO alias_comercios (user_id, clave, original, nombre, updated_at) VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (user_id, clave) DO UPDATE SET nombre = EXCLUDED.nombre, original = EXCLUDED.original, updated_at = NOW()`,
    userId, claveComercio(original), original, nombreNuevo
  );
  const r = await db.run(
    'UPDATE transacciones_extraidas SET comercio = $1 WHERE user_id = $2 AND comercio_original = $3 AND comercio = $4 AND id != $5',
    nombreNuevo, userId, original, nombreAnterior, exceptoId
  );
  return r?.changes || 0;
}
