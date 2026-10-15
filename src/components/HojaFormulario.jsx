import React, { useEffect, useState } from 'react';
import { X, Search, Check } from 'lucide-react';

// Piezas de los formularios de cuota y suscripcion, con el mismo lenguaje que
// la hoja del perfil (ProfileSheet): vidrio, grupos redondeados, filas de 56 px
// con icono en circulo e interruptores del color del tema. En el movil es una
// hoja que sube desde abajo; desde md es una tarjeta centrada.

// Primera clase de theme.btnPrimary / btnSub: el fondo del color del tema.
export const fondoDe = (clases) => (clases || '').split(' ')[0];

// `sinFondo`: otra capa ya pone el fondo difuminado (p. ej. la revision de
// pendientes cuando el formulario completa su giro). `zClase` cambia el z-index.
export const Hoja = ({ onSubmit, onClose, icono: Icono, titulo, subtitulo, tono, estiloFondo, estiloTarjeta, pie, sinFondo, zClase = 'z-[60]', children }) => (
  <div
    className={`fixed inset-0 ${sinFondo ? '' : 'bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md'} ${zClase} flex items-end md:items-center justify-center md:p-4`}
    style={estiloFondo}
  >
    <form
      onSubmit={onSubmit}
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      className="kk-hoja kk-glass kk-glass-sheet w-full md:max-w-md max-h-[94dvh] md:max-h-[90dvh] flex flex-col rounded-t-[2rem] md:rounded-[2rem]"
      style={estiloTarjeta}
    >
      <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-white/15 mx-auto mt-2.5 flex-shrink-0 md:hidden" />
      <div className="flex items-center gap-3 px-5 pt-3.5 md:pt-5 pb-2.5 flex-shrink-0">
        <span className={`w-12 h-12 rounded-2xl grid place-items-center flex-shrink-0 ${tono}`}>
          <Icono size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight truncate">{titulo}</h3>
          {subtitulo && <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">{subtitulo}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="w-11 h-11 rounded-full grid place-items-center flex-shrink-0 bg-white/70 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 text-slate-500 dark:text-slate-300 transition active:scale-95"
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pt-1 pb-4 flex flex-col gap-3.5 custom-scrollbar [&>*]:flex-shrink-0">
        {children}
      </div>
      <div
        className="flex-shrink-0 flex gap-2.5 px-4 pt-3 border-t border-slate-200/80 dark:border-white/10"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
      >
        {pie}
      </div>
    </form>
  </div>
);

export const BotonesPie = ({ onCancel, texto, clasesPrimario }) => (
  <>
    <button
      type="button"
      onClick={onCancel}
      className="flex-1 min-h-[54px] rounded-[18px] bg-white/70 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[15px] font-extrabold transition active:scale-[0.98]"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className={`flex-[2] min-h-[54px] rounded-[18px] ${clasesPrimario} text-white text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]`}
    >
      <Check size={18} strokeWidth={2.6} /> {texto}
    </button>
  </>
);

export const Grupo = ({ children }) => (
  <div className="bg-white/70 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 rounded-[20px] overflow-hidden divide-y divide-slate-100 dark:divide-white/5">
    {children}
  </div>
);

export const Seccion = ({ titulo, children }) => (
  <div className="flex flex-col gap-2">
    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">{titulo}</div>
    {children}
  </div>
);

const IconoFila = ({ icono: Icono }) => (
  <span className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 grid place-items-center flex-shrink-0">
    <Icono size={18} />
  </span>
);

// Fila con un control a la derecha (stepper, pastilla, interruptor...).
export const Fila = ({ icono, texto, detalle, children }) => (
  <div className="flex items-center gap-3 px-3.5 min-h-[56px] py-2">
    <IconoFila icono={icono} />
    <span className="flex-1 min-w-0 flex flex-col">
      <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100">{texto}</span>
      {detalle && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{detalle}</span>}
    </span>
    {children}
  </div>
);

// Fila de texto: la etiqueta a la izquierda y el valor editable a la derecha.
export const FilaCampo = ({ icono, etiqueta, ...input }) => (
  <label className="flex items-center gap-3 px-3.5 min-h-[56px]">
    <IconoFila icono={icono} />
    <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400 w-[84px] flex-shrink-0">{etiqueta}</span>
    <input
      {...input}
      className="flex-1 min-w-0 bg-transparent border-0 outline-none text-right text-[15px] font-extrabold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-semibold read-only:text-slate-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  </label>
);

// Fila con interruptor: toda la fila es el boton.
export const FilaInterruptor = ({ icono, texto, detalle, activo, onChange, colorActivo }) => (
  <button
    type="button"
    role="switch"
    aria-checked={activo}
    onClick={() => onChange(!activo)}
    className="w-full flex items-center gap-3 px-3.5 min-h-[56px] py-2 text-left transition active:bg-slate-100 dark:active:bg-white/5"
  >
    <IconoFila icono={icono} />
    <span className="flex-1 min-w-0 flex flex-col">
      <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100">{texto}</span>
      {detalle && <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{detalle}</span>}
    </span>
    <span className={`relative w-[46px] h-7 rounded-full flex-shrink-0 transition-colors duration-200 ${activo ? colorActivo : 'bg-slate-300 dark:bg-slate-600'}`}>
      <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-transform duration-200 ${activo ? 'translate-x-[18px]' : ''}`} />
    </span>
  </button>
);

export const Stepper = ({ valor, texto, onMenos, onMas, deshabilitado, etiquetaMenos, etiquetaMas }) => (
  <div className={`flex items-center gap-1 bg-slate-100 dark:bg-white/[0.06] rounded-full p-1 flex-shrink-0 ${deshabilitado ? 'opacity-50' : ''}`}>
    <button type="button" onClick={onMenos} disabled={deshabilitado} aria-label={etiquetaMenos} className="w-9 h-9 rounded-full bg-white dark:bg-white/10 text-slate-900 dark:text-white text-xl font-extrabold shadow-sm grid place-items-center transition active:scale-90">−</button>
    <span className="min-w-[36px] px-1 text-center text-base font-extrabold text-slate-900 dark:text-white tabular-nums">{texto ?? valor}</span>
    <button type="button" onClick={onMas} disabled={deshabilitado} aria-label={etiquetaMas} className="w-9 h-9 rounded-full bg-white dark:bg-white/10 text-slate-900 dark:text-white text-xl font-extrabold shadow-sm grid place-items-center transition active:scale-90">+</button>
  </div>
);

// Pastilla con un input nativo (mes o numero) para no perder el selector del sistema.
export const Pastilla = (props) => (
  <input
    {...props}
    className="h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] border-0 outline-none px-3 text-sm font-extrabold text-slate-900 dark:text-white text-center flex-shrink-0 dark:[color-scheme:dark] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
  />
);

export const Segmentado = ({ opciones, valor, onChange }) => (
  <div className="grid gap-1 p-1 rounded-2xl bg-slate-200/80 dark:bg-white/[0.06]" style={{ gridTemplateColumns: `repeat(${opciones.length}, minmax(0, 1fr))` }}>
    {opciones.map(o => (
      <button
        key={o.valor}
        type="button"
        onClick={() => onChange(o.valor)}
        aria-pressed={valor === o.valor}
        className={`min-h-[44px] rounded-xl text-sm font-extrabold transition ${valor === o.valor ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
      >
        {o.texto}
      </button>
    ))}
  </div>
);

// Color predominante de un logo: se dibuja reducido en un canvas y se cuenta
// por cubetas de color, ignorando transparencias, blancos, negros y grises
// (fondo y texto), para quedarse con el color de marca. Se guarda en cache.
const coloresLogo = new Map();

const colorPredominante = (src) => new Promise((resolve) => {
  if (!src) { resolve(null); return; }
  if (coloresLogo.has(src)) { resolve(coloresLogo.get(src)); return; }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const lado = 40;
      const canvas = document.createElement('canvas');
      canvas.width = lado; canvas.height = lado;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, lado, lado);
      const { data } = ctx.getImageData(0, 0, lado, lado);
      const cubetas = new Map();
      for (let i = 0; i < data.length; i += 4) {
        const [r, g, b, alfa] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
        if (alfa < 128) continue;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        if (max - min < 40 || max < 40) continue; // gris, blanco o negro
        const clave = `${r >> 4},${g >> 4},${b >> 4}`;
        const c = cubetas.get(clave) || { n: 0, r: 0, g: 0, b: 0 };
        c.n += 1; c.r += r; c.g += g; c.b += b;
        cubetas.set(clave, c);
      }
      let mejor = null;
      cubetas.forEach(c => { if (!mejor || c.n > mejor.n) mejor = c; });
      const hex = mejor
        ? '#' + [mejor.r, mejor.g, mejor.b].map(v => Math.round(v / mejor.n).toString(16).padStart(2, '0')).join('')
        : null;
      coloresLogo.set(src, hex);
      resolve(hex);
    } catch {
      coloresLogo.set(src, null);
      resolve(null);
    }
  };
  img.onerror = () => { coloresLogo.set(src, null); resolve(null); };
  img.src = src;
});

export const useColorLogo = (src) => {
  const [color, setColor] = useState(() => coloresLogo.get(src) ?? null);
  useEffect(() => {
    let vivo = true;
    colorPredominante(src).then(c => { if (vivo) setColor(c); });
    return () => { vivo = false; };
  }, [src]);
  return color;
};

const iniciales = (nombre) => nombre
  .replace(/\(.*\)/g, '')
  .split(/\s+/)
  .filter(p => p && !/^(banco|de|del|chile)$/i.test(p))
  .slice(0, 2)
  .map(p => p[0].toUpperCase())
  .join('') || nombre.slice(0, 2).toUpperCase();

const BotonBanco = ({ banco, activo, onElegir }) => {
  const color = useColorLogo(banco.logo);
  const [sinLogo, setSinLogo] = useState(!banco.logo);
  // Elegido: borde y un tinte suave del color de su logo; sin color legible,
  // el gris de la app.
  const tono = color || '#64748B';
  return (
    <button
      type="button"
      onClick={() => onElegir(banco)}
      aria-pressed={activo}
      className={`flex items-center gap-2.5 min-h-[52px] px-3 rounded-2xl border-2 text-left transition duration-200 active:scale-[0.98] ${activo ? '' : 'border-white/80 dark:border-white/5 bg-white/60 dark:bg-white/[0.04]'}`}
      style={activo ? { borderColor: tono, backgroundColor: `${tono}1F`, boxShadow: `0 6px 16px ${tono}33` } : undefined}
    >
      <span className="w-8 h-8 rounded-[10px] bg-white grid place-items-center flex-shrink-0 overflow-hidden" style={sinLogo ? { backgroundColor: tono, color: '#fff' } : undefined}>
        {sinLogo
          ? <span className="text-[11px] font-extrabold">{iniciales(banco.nombre)}</span>
          : <img src={banco.logo} alt="" className="w-7 h-7 object-contain" onError={() => setSinLogo(true)} />}
      </span>
      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">{banco.nombre}</span>
    </button>
  );
};

// Bancos con su logo real y buscador. `b.valor` (si existe) es lo que se
// guarda y compara; `b.nombre` lo que se muestra.
export const SelectorBanco = ({ bancos, busqueda, onBuscar, seleccionado, onElegir }) => (
  <>
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        type="text"
        value={busqueda}
        onChange={(e) => onBuscar(e.target.value)}
        placeholder="Buscar banco..."
        className="w-full h-11 rounded-2xl bg-white/70 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 pl-10 pr-3 text-sm font-bold text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400"
      />
    </div>
    <div className="grid grid-cols-2 gap-2 max-h-[232px] overflow-y-auto p-0.5 custom-scrollbar">
      {bancos.map(b => (
        <BotonBanco key={b.id} banco={b} activo={seleccionado === (b.valor ?? b.nombre)} onElegir={onElegir} />
      ))}
      {bancos.length === 0 && (
        <div className="col-span-2 text-center py-4 text-xs font-bold text-slate-400">No se encontraron bancos</div>
      )}
    </div>
  </>
);

// Filtra la lista de bancos por el texto buscado.
export const filtrarBancos = (bancos, texto) => {
  const q = (texto || '').trim().toLowerCase();
  return q ? bancos.filter(b => b.nombre.toLowerCase().includes(q) || (b.valor || '').toLowerCase().includes(q)) : bancos;
};

// Bancos para transacciones: misma lista que el resto, guardando el nombre
// que usa el lector de correos, mas "Otros".
export const bancosParaTransacciones = (lista) => [
  ...lista.map(b => ({ ...b, valor: b.nombreTx || b.nombre })),
  { id: 'otros', nombre: 'Otros', valor: 'Otros', logo: '' },
];
