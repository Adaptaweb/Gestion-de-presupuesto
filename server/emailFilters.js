import { stripInvisibleChars } from './parsers/base.js';

// Correos que informan un periodo completo, no un movimiento individual:
// estados de cuenta de tarjeta, cartolas y resumenes. El monto que traen es el
// total facturado, asi que registrarlos como transaccion duplica el gasto del
// mes entero. Se ignoran hasta que exista el procesamiento del PDF adjunto.
export const NO_TX_SUBJECT_PATTERNS = [
  /estado de cuenta/i,
  /estado de tu cuenta/i,
  /cartola/i,
  /resumen mensual/i,
  /resumen de facturacion/i,
  /tips para tu salud financiera/i,
];

// Los bancos insertan caracteres invisibles y espacios duros en el asunto, y
// el acento de "resumen"/"facturacion" varia entre plantillas: sin normalizar,
// "Estado de Cuenta Tarjeta de Credito Bci" pasaba el filtro.
export function normalizarAsunto(subject) {
  return stripInvisibleChars(String(subject || ''))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Devuelve el patron que coincide (util para loguear el motivo) o null.
export function esCorreoNoTransaccional(subject) {
  const normalizado = normalizarAsunto(subject);
  if (!normalizado) return null;
  return NO_TX_SUBJECT_PATTERNS.find(p => p.test(normalizado)) || null;
}

export default { NO_TX_SUBJECT_PATTERNS, normalizarAsunto, esCorreoNoTransaccional };
