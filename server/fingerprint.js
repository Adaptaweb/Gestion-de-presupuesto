import * as cheerio from 'cheerio';
import crypto from 'crypto';

function normalizarAsunto(asunto) {
  if (!asunto) return '';
  return assunto
    .toLowerCase()
    .replace(/\d{2}\/\d{2}\/\d{4}/g, '<FECHA>')
    .replace(/\$[\d.,]+/g, '<MONTO>')
    .replace(/\b[\d]{4,}\b/g, '<NUM>')
    .replace(/[^\w\s<>]/g, '')
    .trim()
    .substring(0, 100);
}

function extraerEstructuraHtml(html) {
  if (!html) return { tableCount: 0, trCount: 0, tdCount: 0, hasMonto: false, hasFecha: false, hasComercio: false, hasTarjeta: false };

  return {
    tableCount: (html.match(/<table/gi) || []).length,
    trCount: (html.match(/<tr/gi) || []).length,
    tdCount: (html.match(/<td/gi) || []).length,
    hasMonto: /monto|valor|amount|importe/i.test(html),
    hasFecha: /fecha|date/i.test(html),
    hasComercio: /comercio|establecimiento|merchant|titular/i.test(html),
    hasTarjeta: /tarjeta|card/i.test(html),
  };
}

function generarFingerprint(html, subject) {
  const estructura = extraerEstructuraHtml(html);
  const assuntoNorm = normalizarAsunto(subject);

  const fingerprint = [
    assuntoNorm,
    estructura.tableCount,
    estructura.trCount,
    estructura.hasMonto ? 1 : 0,
    estructura.hasFecha ? 1 : 0,
    estructura.hasComercio ? 1 : 0,
    estructura.hasTarjeta ? 1 : 0,
  ].join('|');

  return crypto.createHash('md5').update(fingerprint).digest('hex');
}

function calcularConfianza({ bancoDetectado, montoTabla, fechaTabla, comercioConocido, categoriaUsuario, openrouterFallback }) {
  let score = 0;

  if (bancoDetectado) score += 0.15;
  if (montoTabla) score += 0.25;
  if (fechaTabla) score += 0.15;
  if (comercioConocido) score += 0.20;
  if (categoriaUsuario) score += 0.15;
  if (!openrouterFallback) score += 0.10;

  return Math.min(score, 1.0);
}

const UMBRAL_AUTO_GUARDAR = 0.80;
const UMBRAL_REVISION = 0.50;

export { generarFingerprint, normalizarAsunto, extraerEstructuraHtml, calcularConfianza, UMBRAL_AUTO_GUARDAR, UMBRAL_REVISION };
export default { generarFingerprint, normalizarAsunto, extraerEstructuraHtml, calcularConfianza, UMBRAL_AUTO_GUARDAR, UMBRAL_REVISION };