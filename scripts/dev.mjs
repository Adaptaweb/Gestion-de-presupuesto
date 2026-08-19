// Arranca el backend y Vite en la misma consola.
//
// Antes se lanzaba cada uno con `start` desde start.bat, lo que abria tres
// ventanas: la del propio .bat y una por proceso. Cerrar solo una dejaba la
// otra viva ocupando su puerto, que es el motivo por el que start.bat tenia
// que matar procesos al arrancar.
//
// Se invoca a los binarios por su ruta directa en vez de a traves de npm para
// que los procesos hijo sean nietos nuestros y no de un shell intermedio: asi
// matarlos al salir funciona de verdad.

import { spawn, spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const esWindows = process.platform === 'win32';

const COLORES = {
  api: '\x1b[36m',   // cian
  web: '\x1b[35m',   // magenta
  aviso: '\x1b[33m',
  fin: '\x1b[0m',
};

const hijos = [];
let cerrando = false;

function prefijar(etiqueta, flujo) {
  let resto = '';
  flujo.on('data', (trozo) => {
    const lineas = (resto + trozo.toString()).split('\n');
    resto = lineas.pop();
    for (const linea of lineas) {
      // Vite ya colorea su salida; el prefijo se cierra siempre para que su
      // color no se derrame sobre la etiqueta de la linea siguiente.
      process.stdout.write(`${COLORES[etiqueta]}[${etiqueta}]${COLORES.fin} ${linea}\n`);
    }
  });
}

function lanzar(etiqueta, argumentos, entorno) {
  const hijo = spawn(process.execPath, argumentos, {
    cwd: raiz,
    env: { ...process.env, ...entorno },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  prefijar(etiqueta, hijo.stdout);
  prefijar(etiqueta, hijo.stderr);

  hijo.on('exit', (codigo, senal) => {
    if (cerrando) return;
    const causa = senal ? `senal ${senal}` : `codigo ${codigo}`;
    console.log(`${COLORES.aviso}[${etiqueta}] termino con ${causa}. Cerrando el resto.${COLORES.fin}`);
    cerrar(codigo ?? 1);
  });

  hijos.push(hijo);
  return hijo;
}

function cerrar(codigo) {
  if (cerrando) return;
  cerrando = true;

  for (const hijo of hijos) {
    if (hijo.exitCode !== null || hijo.killed) continue;
    if (esWindows) {
      // Vite levanta procesos propios (esbuild). Sin /T sobreviven al padre y
      // se quedan con el puerto 5173 tomado.
      spawn('taskkill', ['/pid', String(hijo.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true,
      });
    } else {
      hijo.kill('SIGTERM');
    }
  }

  // Un margen para que taskkill actue antes de que el proceso padre se vaya.
  setTimeout(() => process.exit(codigo), 500);
}

for (const senal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(senal, () => cerrar(0));
}

// `npm run dev` encadenaba generate-icons antes de Vite. Se mantiene aqui, y
// en serie: Vite necesita los iconos presentes cuando lee el manifiesto.
const iconos = spawnSync(process.execPath, [path.join(raiz, 'scripts', 'generate-icons.js')], {
  cwd: raiz,
  stdio: 'inherit',
});
if (iconos.status !== 0) {
  console.error(`${COLORES.aviso}generate-icons fallo. Se sigue igualmente.${COLORES.fin}`);
}

lanzar('api', [path.join(raiz, 'server', 'index.js')], {
  // Los registros de diagnostico del pipeline de correos llevan datos del
  // usuario, por eso en produccion van apagados y aqui encendidos.
  DEBUG_PARSING: '1',
  NODE_ENV: 'development',
});

const web = lanzar('web', [path.join(raiz, 'node_modules', 'vite', 'bin', 'vite.js')], {});

// El navegador se abre cuando Vite dice que escucha, no tras una espera fija.
let navegadorAbierto = false;
web.stdout.on('data', (trozo) => {
  if (navegadorAbierto) return;
  if (!/Local:\s+https?:\/\//.test(trozo.toString())) return;
  navegadorAbierto = true;

  const url = 'http://localhost:5173';
  if (esWindows) {
    spawn('cmd', ['/c', 'start', '', url], { stdio: 'ignore', windowsHide: true, detached: true }).unref();
  } else {
    spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { stdio: 'ignore', detached: true }).unref();
  }
});

console.log('');
console.log('  Ctrl+C detiene backend y frontend a la vez.');
console.log('');
