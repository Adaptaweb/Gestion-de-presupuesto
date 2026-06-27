const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'openai/gpt-oss-120b:free';

const cache = new Map();
const CACHE_MAX = 200;
const MAX_RETRIES = 3;

function cacheKey(text, subject, from, fingerprint) {
  const s = (fingerprint || '') + '|' + (subject || '').substring(0, 100) + '|' + (from || '').substring(0, 50);
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return 'or' + h;
}

const GENERIC_COMERCIOS = [
  'nuestro cliente', 'cliente', 'señor', 'señora', 'sr', 'sra', 'srta',
  'usuario', 'beneficiario', 'titular', 'cuenta', 'tarjeta holder',
  'cliente bci', 'cliente mach',
];

export function esComercioGenerico(comercio) {
  if (!comercio) return true;
  const c = comercio.toLowerCase().trim();
  if (c.length <= 3) return true;
  return GENERIC_COMERCIOS.some(g => c === g || c.startsWith(g + ' '));
}

export async function parseWithOpenRouter(emailText, subject, from, fingerprint = null, retryCount = 0) {
  if (!API_KEY) {
    console.error('[OpenRouter] No OPENROUTER_API_KEY configurada');
    return null;
  }

  const key = cacheKey(emailText, subject, from, fingerprint);
  if (cache.has(key)) return cache.get(key);

  const cuerpo = (emailText || '').substring(0, 2000);
  const prompt = `Extráe de este correo bancario chileno. JSON solo:
{"tipo":"ingreso"|"gasto"|"interno","comercio":"nombre real","categoria":"Mercadería"|"Transporte"|"Compras"|"Salud y deportes"|"Educación"|"Suscripciones"|"Viajes y vacaciones"|"Donaciones y regalos"|"Casa y cuentas"|"Sueldo"|"Otros ingresos"|"Otros"|"Inversiones/Renta"}

Reglas: comercio=NOMBRE REAL,no "Cliente/Sr/Señor". Si recibió dinero→"ingreso". Si pagó→"gasto". Categoría según comercio.

Asunto: ${subject || 'N/A'}
De: ${from || 'N/A'}
Cuerpo: ${cuerpo}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://github.com/Adaptaweb/Gestion-de-presupuesto',
        'X-Title': 'Gestion Presupuesto',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 300,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429) {
        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(60 * 1000, (retryCount + 1) * 20 * 1000);
          console.warn(`[OpenRouter] Cuota excedida, reintento ${retryCount + 1}/${MAX_RETRIES} en ${delay / 1000}s...`);
          await new Promise(r => setTimeout(r, delay));
          return parseWithOpenRouter(emailText, subject, from, fingerprint, retryCount + 1);
        }
        console.error(`[OpenRouter] Cuota excedida tras ${MAX_RETRIES} reintentos (${subject?.substring(0, 60)})`);
      } else {
        console.error(`[OpenRouter] HTTP ${response.status} (${subject?.substring(0, 60)}): ${text.substring(0, 200)}`);
      }
      return null;
    }

    const data = await response.json();
    const usedModel = data.model || MODEL;
    console.log(`[OpenRouter] Modelo: ${usedModel} | ${subject?.substring(0, 50)}`);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.warn(`[OpenRouter] Respuesta vacia: ${subject}`);
      return null;
    }

    let jsonStr = null;
    const codeBlock = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
    if (codeBlock) {
      jsonStr = codeBlock[1];
    } else {
      const greedy = content.match(/\{[\s\S]*\}/);
      if (greedy) jsonStr = greedy[0];
    }
    if (!jsonStr) {
      console.warn(`[OpenRouter] Sin JSON: ${content.substring(0, 100)}`);
      return null;
    }

    const parsed = JSON.parse(jsonStr);

    const output = {
      tipo: ['ingreso', 'gasto', 'interno'].includes(parsed.tipo) ? parsed.tipo : null,
      comercio: typeof parsed.comercio === 'string' && parsed.comercio.trim().length > 0 ? parsed.comercio.trim() : null,
      motivo: parsed.motivo || null,
      categoria: parsed.categoria || null,
    };

    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
    cache.set(key, output);

    return output;
  } catch (e) {
    if (e.name === 'AbortError' || e.message?.includes('timeout')) {
      if (retryCount < MAX_RETRIES) {
        const delay = (retryCount + 1) * 5000;
        console.warn(`[OpenRouter] Timeout, reintento ${retryCount + 1}/${MAX_RETRIES}...`);
        await new Promise(r => setTimeout(r, delay));
        return parseWithOpenRouter(emailText, subject, from, fingerprint, retryCount + 1);
      }
      console.error(`[OpenRouter] Timeout tras ${MAX_RETRIES} reintentos`);
    } else if (e.message?.includes('429') || e.message?.includes('Too Many Requests')) {
      if (retryCount < MAX_RETRIES) {
        const delay = Math.min(60 * 1000, (retryCount + 1) * 20 * 1000);
        console.warn(`[OpenRouter] 429, reintento ${retryCount + 1}/${MAX_RETRIES}...`);
        await new Promise(r => setTimeout(r, delay));
        return parseWithOpenRouter(emailText, subject, from, fingerprint, retryCount + 1);
      }
      console.error(`[OpenRouter] 429 tras ${MAX_RETRIES} reintentos`);
    } else {
      console.error(`[OpenRouter] Error: ${e.message}`);
    }
    return null;
  }
}