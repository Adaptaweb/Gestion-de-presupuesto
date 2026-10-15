// Descarga de iconos con URL personalizada.
//
// Un icono enlazado a una web ajena se rompe cuando esa web lo mueve, bloquea
// el hotlink o exige cookies. Al guardarlo, el cliente lo pide aqui, lo reduce
// en un canvas y guarda la imagen dentro del propio compromiso.
//
// El servidor descarga una URL que elige el usuario, asi que se cierra el paso
// a la red interna (SSRF): solo http(s), sin IPs privadas ni de loopback en
// ningun salto de redireccion, con tiempo y tamano maximos.

import dns from 'node:dns/promises';
import net from 'node:net';

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_SALTOS = 3;
const TIEMPO_MS = 8000;

/** true si la IP no es de internet publica. */
export function ipPrivada(ip) {
  let dir = String(ip || '').toLowerCase();
  if (dir.startsWith('::ffff:')) dir = dir.slice(7); // IPv4 mapeada en IPv6
  if (net.isIPv4(dir)) {
    const [a, b] = dir.split('.').map(Number);
    return a === 0 || a === 10 || a === 127
      || (a === 100 && b >= 64 && b <= 127) // CGNAT
      || (a === 169 && b === 254) // link-local y metadatos de la nube
      || (a === 172 && b >= 16 && b <= 31)
      || (a === 192 && b === 168)
      || (a === 192 && b === 0)
      || (a === 198 && (b === 18 || b === 19))
      || a >= 224; // multicast y reservadas
  }
  if (net.isIPv6(dir)) {
    return dir === '::' || dir === '::1'
      || dir.startsWith('fc') || dir.startsWith('fd') // unique local
      || /^fe[89ab]/.test(dir) // link-local
      || dir.startsWith('ff'); // multicast
  }
  return true;
}

/** Valida la URL y que su host no resuelva a la red interna. */
export async function validarDestino(url) {
  let u;
  try { u = new URL(url); } catch { throw new Error('URL inválida'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('Solo se aceptan enlaces http o https');
  if (u.username || u.password) throw new Error('URL inválida');
  const host = u.hostname.replace(/^\[|\]$/g, '');
  const direcciones = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
  if (!direcciones.length || direcciones.some(d => ipPrivada(d.address))) {
    throw new Error('Esa dirección no está permitida');
  }
  return u;
}

/** Descarga la imagen y devuelve { tipo, datos } o lanza un Error con mensaje para el usuario. */
export async function descargarIcono(url, saltos = 0) {
  const destino = await validarDestino(url);
  const res = await fetch(destino, {
    redirect: 'manual',
    signal: AbortSignal.timeout(TIEMPO_MS),
    headers: { 'User-Agent': 'Mozilla/5.0 (KuentasKlaras icon fetcher)', Accept: 'image/*' },
  });

  if (res.status >= 300 && res.status < 400) {
    const siguiente = res.headers.get('location');
    if (!siguiente || saltos >= MAX_SALTOS) throw new Error('Demasiadas redirecciones');
    return descargarIcono(new URL(siguiente, destino).toString(), saltos + 1);
  }
  if (!res.ok) throw new Error(`El sitio respondió ${res.status}`);

  const tipo = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!tipo.startsWith('image/')) throw new Error('El enlace no es una imagen');
  if (Number(res.headers.get('content-length')) > MAX_BYTES) throw new Error('La imagen es demasiado grande');

  // Lectura por partes para cortar si el servidor miente sobre el tamano.
  const partes = [];
  let total = 0;
  for await (const parte of res.body) {
    total += parte.length;
    if (total > MAX_BYTES) throw new Error('La imagen es demasiado grande');
    partes.push(parte);
  }
  return { tipo, datos: Buffer.concat(partes) };
}
