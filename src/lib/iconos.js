// Iconos con URL personalizada: al guardar se descargan (via /api/iconos/descargar,
// el navegador no puede leer imagenes de otros sitios por CORS), se reducen a
// 128 px en un canvas y se guardan como data URL dentro del propio item. Asi no
// dependen de que la web original siga sirviendo la imagen.

const LADO = 128;

export const esUrlRemota = (url) => /^https?:\/\//i.test(String(url || '').trim());

const cargarImagen = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('El archivo no es una imagen válida'));
  img.src = src;
});

export async function descargarIconoComoDataUrl(url, headers) {
  const res = await fetch('/api/iconos/descargar', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: String(url).trim() }),
  });
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    throw new Error(cuerpo.error || 'No se pudo descargar');
  }
  const objeto = URL.createObjectURL(await res.blob());
  try {
    const img = await cargarImagen(objeto);
    // Un SVG sin tamano propio llega con 0 x 0: se dibuja al lado completo.
    const ancho = img.naturalWidth || LADO;
    const alto = img.naturalHeight || LADO;
    const escala = Math.min(LADO / ancho, LADO / alto);
    const w = Math.round(ancho * escala);
    const h = Math.round(alto * escala);
    const canvas = document.createElement('canvas');
    canvas.width = LADO;
    canvas.height = LADO;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, (LADO - w) / 2, (LADO - h) / 2, w, h);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(objeto);
  }
}
