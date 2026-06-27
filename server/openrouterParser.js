const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'openai/gpt-oss-120b:free';

const cache = new Map();
const CACHE_MAX = 200;
const MAX_RETRIES = 3;

function cacheKey(text, subject, from) {
  const s = (text || '').substring(0, 2000) + '|' + (subject || '') + '|' + (from || '');
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

export async function parseWithOpenRouter(emailText, subject, from, retryCount = 0) {
  if (!API_KEY) {
    console.error('[OpenRouter] No OPENROUTER_API_KEY configurada');
    return null;
  }

  const key = cacheKey(emailText, subject, from);
  if (cache.has(key)) return cache.get(key);

  const prompt = `Eres un asistente que extrae información de correos bancarios chilenos.

A partir del siguiente correo, extrae estos datos en formato JSON (SOLO JSON, sin markdown ni explicaciones):
{
  "tipo": "ingreso" | "gasto" | "interno",
  "comercio": "nombre real del comercio o persona",
  "motivo": "Transferencia" | "Compra" | "Retiro" | "Cargo",
  "categoria": "categoría apropiada"
}

Reglas:
- IGNORA texto de navegación, menús, footers, enlaces, "Ver más", "Ir a", términos legales. Concéntrate SOLO en el contenido del correo (tablas con datos, párrafos)
- tipo: "ingreso" si recibiste dinero, "gasto" si pagaste, "interno" si es entre cuentas propias
- Si el correo dice "ha efectuado una transferencia a tu cuenta", "ha instruido una transferencia", "Has recibido una transferencia de fondos de", "nuestro(a) cliente X ha efectuado/instruido una transferencia" → es INGRESO (alguien envió dinero al usuario)
- comercio: nombre REAL de quien envía. Busca después de "de fondos de", "cliente", "remitente", "Nombre". NUNCA pongas "Nuestro Cliente", "Cliente", "Sr", "Señor" ni genéricos
- categoria: Mercadería | Transporte | Compras | Salud y deportes | Educación | Suscripciones | Viajes y vacaciones | Donaciones y regalos | Casa y cuentas | Sueldo | Otros ingresos | Otros | Inversiones/Renta

Asunto: ${subject || ''}
De: ${from || ''}
Cuerpo:
${(emailText || '').substring(0, 4000)}`;

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
          { role: 'system', content: 'Eres un asistente que extrae datos de correos bancarios y responde SOLO en JSON.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 500,
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
          return parseWithOpenRouter(emailText, subject, from, retryCount + 1);
        }
        console.error(`[OpenRouter] Cuota excedida tras ${MAX_RETRIES} reintentos (${subject?.substring(0, 60)})`);
      } else {
        console.error(`[OpenRouter] HTTP ${response.status} (${subject?.substring(0, 60)}): ${text.substring(0, 200)}`);
      }
      return null;
    }

    const data = await response.json();
    const usedModel = data.model || MODEL;
    console.log(`[OpenRouter] Modelo usado: ${usedModel} para: ${subject?.substring(0, 60)}`);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.warn(`[OpenRouter] Respuesta vacia para: ${subject}`);
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
      console.warn(`[OpenRouter] No se encontro JSON en respuesta. Model: ${usedModel}. Content: ${content.substring(0, 200)}`);
      return null;
    }
    if (!jsonMatch) {
      console.warn(`[OpenRouter] No se encontro JSON en respuesta. Content: ${content.substring(0, 200)}`);
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
        console.warn(`[OpenRouter] Timeout, reintento ${retryCount + 1}/${MAX_RETRIES} en ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        return parseWithOpenRouter(emailText, subject, from, retryCount + 1);
      }
      console.error(`[OpenRouter] Timeout tras ${MAX_RETRIES} reintentos (${subject?.substring(0, 60)})`);
    } else if (e.message?.includes('429') || e.message?.includes('Too Many Requests')) {
      if (retryCount < MAX_RETRIES) {
        const delay = Math.min(60 * 1000, (retryCount + 1) * 20 * 1000);
        console.warn(`[OpenRouter] 429, reintento ${retryCount + 1}/${MAX_RETRIES} en ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        return parseWithOpenRouter(emailText, subject, from, retryCount + 1);
      }
      console.error(`[OpenRouter] 429 tras ${MAX_RETRIES} reintentos (${subject?.substring(0, 60)})`);
    } else {
      console.error(`[OpenRouter] Error (${subject?.substring(0, 60)}): ${e.message}`);
    }
    return null;
  }
}
