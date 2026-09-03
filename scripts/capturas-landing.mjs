// Captura las pantallas del sistema que ilustran la landing.
//
// Uso:
//   node scripts/capturas-landing.mjs login    abre una ventana para iniciar sesion
//                                              a mano; el perfil queda guardado.
//   node scripts/capturas-landing.mjs          captura y escribe public/landing/*.webp
//
// La sesion vive en .playwright-profile/ (ignorado por git). Nunca se escriben
// credenciales en este archivo: el login lo hace la persona en la ventana.
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const PERFIL = path.join(RAIZ, '.playwright-profile');
const SALIDA = path.join(RAIZ, 'public', 'landing');
const TEMP = path.join(RAIZ, '.capturas-tmp');
const BASE = process.env.CAPTURAS_URL || 'https://gastos.adaptaweb.cl';

const ANCHO = 390;
const ALTO = 844;
const ESCALA = 2;

// Se usa el Chrome instalado (channel) y no el Chromium que trae Playwright:
// el binario descargado no logra abrir ventana en este equipo.
const abrirContexto = (headless) => chromium.launchPersistentContext(PERFIL, {
  headless,
  channel: 'chrome',
  viewport: { width: ANCHO, height: ALTO },
  deviceScaleFactor: ESCALA,
  isMobile: true,
  hasTouch: true,
  locale: 'es-CL',
  timezoneId: 'America/Santiago',
});

const login = async () => {
  const ctx = await abrirContexto(false);
  const page = ctx.pages()[0] || await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  console.log('Inicia sesion en la ventana abierta. Espero hasta 5 minutos...');
  await page.waitForFunction(() => !!localStorage.getItem('token'), null, { timeout: 300000 });
  console.log('Sesion guardada en .playwright-profile');
  await ctx.close();
};

// Barra de estado tipo iOS: las capturas anteriores la traian y sin ella el
// marco de telefono de la landing se ve vacio arriba.
const barraEstado = (oscuro) => {
  const w = ANCHO * ESCALA;
  const h = 44 * ESCALA;
  const fondo = oscuro ? '#111111' : '#F8FAFC';
  const tinta = oscuro ? '#FFFFFF' : '#0F172A';
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="${fondo}"/>
    <text x="${52 * ESCALA}" y="${28 * ESCALA}" font-family="Segoe UI, Helvetica, Arial" font-size="${15 * ESCALA}" font-weight="600" fill="${tinta}" text-anchor="middle">9:41</text>
    <g fill="${tinta}">
      <rect x="${300 * ESCALA}" y="${20 * ESCALA}" width="${3 * ESCALA}" height="${5 * ESCALA}" rx="1"/>
      <rect x="${305 * ESCALA}" y="${17 * ESCALA}" width="${3 * ESCALA}" height="${8 * ESCALA}" rx="1"/>
      <rect x="${310 * ESCALA}" y="${14 * ESCALA}" width="${3 * ESCALA}" height="${11 * ESCALA}" rx="1"/>
      <rect x="${315 * ESCALA}" y="${11 * ESCALA}" width="${3 * ESCALA}" height="${14 * ESCALA}" rx="1"/>
      <path d="M${329 * ESCALA} ${16 * ESCALA} a${8 * ESCALA} ${8 * ESCALA} 0 0 1 ${11 * ESCALA} 0" fill="none" stroke="${tinta}" stroke-width="${2 * ESCALA}" stroke-linecap="round"/>
      <path d="M${332 * ESCALA} ${20 * ESCALA} a${4 * ESCALA} ${4 * ESCALA} 0 0 1 ${5 * ESCALA} 0" fill="none" stroke="${tinta}" stroke-width="${2 * ESCALA}" stroke-linecap="round"/>
      <circle cx="${334.5 * ESCALA}" cy="${24 * ESCALA}" r="${1.2 * ESCALA}"/>
      <rect x="${352 * ESCALA}" y="${13 * ESCALA}" width="${24 * ESCALA}" height="${12 * ESCALA}" rx="${3.5 * ESCALA}" fill="none" stroke="${tinta}" stroke-width="${1.5 * ESCALA}" opacity="0.5"/>
      <rect x="${354 * ESCALA}" y="${15 * ESCALA}" width="${18 * ESCALA}" height="${8 * ESCALA}" rx="${2 * ESCALA}"/>
      <rect x="${377 * ESCALA}" y="${17 * ESCALA}" width="${2 * ESCALA}" height="${4 * ESCALA}" rx="1" opacity="0.5"/>
    </g>
  </svg>`);
};

// Une la barra de estado con la captura y guarda en webp, que es lo que
// consume la landing.
const componer = async (pngPath, destino, oscuro) => {
  const shot = sharp(pngPath);
  const { width, height } = await shot.metadata();
  const barra = await sharp(barraEstado(oscuro)).png().toBuffer();
  const alturaBarra = 44 * ESCALA;
  await sharp({
    create: {
      width,
      height: height + alturaBarra,
      channels: 4,
      background: oscuro ? '#111111' : '#F8FAFC',
    },
  })
    .composite([
      { input: barra, top: 0, left: 0 },
      { input: await shot.png().toBuffer(), top: alturaBarra, left: 0 },
    ])
    .webp({ quality: 82 })
    .toFile(path.join(SALIDA, destino));
  console.log('escrito', destino);
};

const aplicarTema = async (page, oscuro) => {
  await page.evaluate((esOscuro) => {
    localStorage.setItem('theme', esOscuro ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', esOscuro);
  }, oscuro);
};

export { abrirContexto, componer, aplicarTema, BASE, TEMP, SALIDA, ANCHO, ALTO, ESCALA };

// Solo actua cuando se ejecuta directo: los scripts auxiliares importan este
// modulo para reusar el contexto sin disparar una captura completa.
const ejecutadoDirecto = path.resolve(process.argv[1] || '') === path.resolve(import.meta.filename);

if (ejecutadoDirecto && process.argv[2] === 'login') {
  await login();
  process.exit(0);
}

const MES = process.env.CAPTURAS_MES || 'Ago';
const MESES_LARGOS = {
  Ene: 'Enero', Feb: 'Febrero', Mar: 'Marzo', Abr: 'Abril', May: 'Mayo', Jun: 'Junio',
  Jul: 'Julio', Ago: 'Agosto', Sep: 'Septiembre', Oct: 'Octubre', Nov: 'Noviembre', Dic: 'Diciembre',
};

// El tema se fija antes de cargar: si se cambia despues, React lo pisa al leer
// localStorage en el arranque.
const cargarApp = async (page, oscuro) => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await aplicarTema(page, oscuro);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  // El boton de instalar la PWA queda a medio animar y ensucia la captura; no
  // tiene selector propio, asi que se busca por su texto.
  await page.evaluate(() => {
    const boton = [...document.querySelectorAll('button')].find(b => /Instalar App/i.test(b.innerText || ''));
    if (boton) boton.style.setProperty('display', 'none', 'important');
  });
};

const irAlMes = async (page) => {
  await page.getByRole('button', { name: /de 20\d\d/i }).click();
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: MES, exact: true }).click();
  await page.waitForTimeout(4000);
};

const capturar = async () => {
  await fs.mkdir(TEMP, { recursive: true });
  await fs.mkdir(SALIDA, { recursive: true });
  const ctx = await abrirContexto(true);
  const page = ctx.pages()[0] || await ctx.newPage();

  for (const oscuro of [false, true]) {
    const sufijo = oscuro ? '-dark' : '';
    const tirar = async (nombre, opciones = {}) => {
      const png = path.join(TEMP, `${nombre}${sufijo || '-white'}.png`);
      await page.screenshot({ path: png, ...opciones });
      return png;
    };

    // 1. Hero: transacciones del mes con los widgets de gasto.
    await cargarApp(page, oscuro);
    await irAlMes(page);
    // Produccion todavia concatena el contador de las tarjetas ("014
    // movimientos"). El calculo ya esta corregido en el codigo; hasta que se
    // despliegue, la linea se oculta para no publicar un numero falso.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('span')) {
        if (/^0\d+ movimientos?$/.test(el.textContent.trim())) el.style.visibility = 'hidden';
      }
    });
    await componer(await tirar('hero'), `hero-dashboard-${oscuro ? 'dark' : 'white'}.webp`, oscuro);

    // 2. Paso 1 de la landing: tutorial de reenvio de correos.
    await page.getByRole('button', { name: /Menu de/ }).click();
    await page.waitForTimeout(600);
    await page.getByText('Configurar', { exact: true }).click();
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: /Ver tutorial paso a paso/ }).click();
    await page.waitForTimeout(4000);
    // El titulo repetido junto al logo esta corregido en el codigo pero sigue
    // desplegado en produccion; se oculta para que la captura muestre la
    // pantalla ya arreglada.
    await page.evaluate(() => {
      const repetido = [...document.querySelectorAll('h1')].find(h => h.textContent.trim() === 'Kuentas Klaras');
      if (repetido) repetido.style.display = 'none';
    });
    await componer(await tirar('tutorial'), `how-it-works-1${sufijo}.webp`, oscuro);

    // 3. Paso 2: pantalla de clasificacion. Se abre un movimiento y se llega a
    // "Reclasificar" sin elegir categoria, para no alterar datos reales.
    await cargarApp(page, oscuro);
    await irAlMes(page);
    await page.locator('div.group.cursor-pointer').first().click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: /Reclasificar/ }).click();
    await page.waitForTimeout(2500);
    await componer(await tirar('clasificar'), `how-it-works-2${sufijo}.webp`, oscuro);

    // 4. Paso 3: resumen; la landing lo desplaza dentro del marco, asi que se
    // capturan dos pantallas de alto. Mas largo que eso deja hueco al final del
    // desplazamiento.
    await cargarApp(page, oscuro);
    await page.getByRole('button', { name: 'Resumen', exact: true }).last().click();
    await page.waitForTimeout(2000);
    // El resumen tiene su propio selector: se retrocede hasta el mismo mes que
    // muestran las demas capturas.
    const objetivo = MESES_LARGOS[MES];
    for (let intento = 0; intento < 12; intento++) {
      const actual = await page.getByRole('button', { name: /^[A-Za-zÁÉÍÓÚáéíóú]+ 20\d\d$/ }).first().innerText();
      if (actual.startsWith(objetivo)) break;
      await page.getByRole('button', { name: 'Mes anterior' }).click();
      await page.waitForTimeout(1500);
    }
    await page.waitForTimeout(3000);
    // La barra inferior y el boton flotante quedan estampados a media imagen en
    // una captura larga; el pie de la app tampoco aporta.
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('body *')) {
        if (getComputedStyle(el).position === 'fixed') el.style.setProperty('display', 'none', 'important');
      }
      const pie = document.querySelector('footer');
      if (pie) pie.style.setProperty('display', 'none', 'important');
    });
    await componer(
      await tirar('resumen', { fullPage: true, clip: { x: 0, y: 0, width: ANCHO, height: 1500 } }),
      `how-it-works-3${sufijo}.webp`,
      oscuro,
    );
  }

  await ctx.close();
};

if (ejecutadoDirecto) await capturar();
