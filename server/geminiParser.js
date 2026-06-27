import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

let model = null;
if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
} else {
  console.warn('[GeminiParser] No API key found, Gemini fallback disabled');
}

const cache = new Map();
const CACHE_MAX = 200;

function cacheKey(text, subject, from) {
  const s = (text || '').substring(0, 2000) + '|' + (subject || '') + '|' + (from || '');
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return 'g' + h;
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

export async function parseWithGemini(emailText, subject, from, retryCount = 0) {
  if (!model) {
    console.error('[GeminiParser] model es null — API key no configurada o fallo al inicializar');
    return null;
  }
  const MAX_RETRIES = 3;

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
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }, { timeout: 10000 });

    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

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
    if (e.message?.includes('429') || e.message?.includes('Too Many Requests') || e.message?.includes('quota')) {
      if (retryCount < MAX_RETRIES) {
        const delay = Math.min(60 * 1000, (retryCount + 1) * 20 * 1000);
        console.warn(`[GeminiParser] Cuota excedida, reintento ${retryCount + 1}/${MAX_RETRIES} en ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
        return parseWithGemini(emailText, subject, from, retryCount + 1);
      }
      console.error(`[GeminiParser] Cuota excedida tras ${MAX_RETRIES} reintentos (${subject?.substring(0, 60)})`);
    } else if (e.message?.includes('Candidates') || e.message?.includes('SAFETY')) {
      console.warn(`[GeminiParser] Blocked for: ${subject}`);
    } else {
      console.error(`[GeminiParser] Error llamando a Gemini (${subject?.substring(0, 60)}): ${e.message}`);
    }
    return null;
  }
}
