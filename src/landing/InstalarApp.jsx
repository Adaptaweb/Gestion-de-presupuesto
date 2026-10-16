import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Share, PlusSquare, MoreVertical, MonitorDown, Download, Check, Smartphone, Gift } from 'lucide-react';
import { TRIAL_DAYS } from '../constants/pricing.js';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';

// Paso a paso para instalar Kuentas Klaras como app (PWA). Arranca en la
// plataforma del visitante y, si el navegador ofrece instalar directo
// (beforeinstallprompt en Chrome/Edge/Android), muestra "Instalar ahora".

const detectarPlataforma = () => {
  if (typeof navigator === 'undefined') return 'iphone';
  const ua = navigator.userAgent || '';
  // iPadOS se presenta como Mac, pero con pantalla tactil.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'iphone';
  if (/Android/i.test(ua)) return 'android';
  return 'computador';
};

const PLATAFORMAS = [
  { id: 'iphone', texto: 'iPhone' },
  { id: 'android', texto: 'Android' },
  { id: 'computador', texto: 'Computador' },
];

const PASOS = {
  iphone: [
    { icono: Smartphone, texto: <>Abre <b>Kuentas Klaras</b> en <b>Safari</b>.</> },
    { icono: Share, texto: <>Toca el botón <b>Compartir</b>, el cuadrado con la flecha hacia arriba.</> },
    { icono: PlusSquare, texto: <>Elige <b>Agregar a pantalla de inicio</b>.</> },
    { icono: Check, texto: <>Toca <b>Agregar</b>. La app queda en tu inicio, a pantalla completa.</> },
  ],
  android: [
    { icono: Smartphone, texto: <>Abre <b>Kuentas Klaras</b> en <b>Chrome</b>.</> },
    { icono: MoreVertical, texto: <>Toca el menú <b>⋮</b> arriba a la derecha.</> },
    { icono: Download, texto: <>Elige <b>Instalar app</b> o <b>Agregar a pantalla principal</b>.</> },
    { icono: Check, texto: <>Confirma con <b>Instalar</b>. La encuentras junto a tus otras apps.</> },
  ],
  computador: [
    { icono: Smartphone, texto: <>Abre <b>Kuentas Klaras</b> en <b>Chrome</b> o <b>Edge</b>.</> },
    { icono: MonitorDown, texto: <>Haz clic en el ícono de <b>instalar</b> al final de la barra de direcciones.</> },
    { icono: Check, texto: <>Confirma con <b>Instalar</b>. Se abre en su propia ventana.</> },
  ],
};

const InstalarApp = () => {
  const [plataforma, setPlataforma] = useState(detectarPlataforma);
  const { isInstallable, isInstalled, install } = useInstallPrompt();
  const pasos = PASOS[plataforma];
  const quieto = useReducedMotion();
  const [resaltar, setResaltar] = useState(0);

  // Los enlaces a #instalar (etiqueta del hero, menu): si el navegador permite
  // instalar directo, abren su dialogo; si no, llevan aqui y resaltan los pasos.
  useEffect(() => {
    const alClic = (e) => {
      if (!e.target.closest?.('a[href="#instalar"]')) return;
      if (isInstallable) {
        e.preventDefault();
        install();
        return;
      }
      setResaltar(n => n + 1);
    };
    document.addEventListener('click', alClic);
    return () => document.removeEventListener('click', alClic);
  }, [isInstallable, install]);

  useEffect(() => {
    if (!resaltar) return undefined;
    const t = setTimeout(() => setResaltar(0), 1800);
    return () => clearTimeout(t);
  }, [resaltar]);

  return (
    <div id="instalar" className={`scroll-mt-24 transition-shadow duration-500 ${resaltar ? 'ring-4 ring-kk-primary/60 shadow-kk-primary/40' : ''} rounded-[28px] bg-white/80 dark:bg-[#0c1714]/90 border border-white dark:border-white/10 backdrop-blur-xl shadow-xl shadow-kk-primary/10 dark:shadow-black/30 p-4 sm:p-5`}>
      <div className="flex items-start gap-3 mb-4">
        <span className="w-11 h-11 rounded-2xl bg-kk-primary text-white grid place-items-center flex-shrink-0 shadow-lg shadow-kk-primary/30">
          <Download size={20} />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Instálala como app</h2>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Sin tienda de apps. Pantalla completa, acceso desde tu inicio y avisos al instante.</p>
        </div>
      </div>

      <motion.div
        animate={quieto ? undefined : { boxShadow: ['0 10px 28px -12px rgba(45,188,139,0.45)', '0 14px 42px -8px rgba(45,188,139,0.85)', '0 10px 28px -12px rgba(45,188,139,0.45)'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative overflow-hidden flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#0E6B57] via-[#12805D] to-[#0E6B57] text-white px-4 py-3 mb-4 ring-1 ring-white/20 shadow-lg shadow-kk-primary/25"
      >
        {/* Destello que cruza la franja de vez en cuando */}
        {!quieto && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-y-0 -left-24 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['0%', '900%'] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut' }}
          />
        )}
        <motion.span
          aria-hidden="true"
          className="relative flex-shrink-0"
          animate={quieto ? undefined : { rotate: [0, -12, 10, -6, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3.2 }}
        >
          <Gift size={22} />
        </motion.span>
        <p className="relative text-sm leading-snug">
          <span className="block text-base font-black">{TRIAL_DAYS} días gratis antes de pagar</span>
          <span className="font-semibold text-white/85">Sin tarjeta. Parten cuando conectas tu correo.</span>
        </p>
      </motion.div>

      {isInstalled ? (
        <div className="flex items-center gap-2 rounded-2xl bg-kk-light dark:bg-kk-primary/15 text-kk-dark dark:text-kk-secondary px-4 py-3 text-sm font-bold">
          <Check size={18} /> Ya tienes la app instalada en este dispositivo.
        </div>
      ) : (
        <>
          {isInstallable && (
            <button
              type="button"
              onClick={install}
              className="w-full mb-4 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-2xl bg-kk-dark text-white font-black text-base shadow-lg shadow-kk-dark/25 hover:bg-kk-primary transition active:scale-[0.98]"
            >
              <Download size={18} /> Instalar ahora
            </button>
          )}

          <div role="tablist" aria-label="Elige tu dispositivo" className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/[0.06] mb-4">
            {PLATAFORMAS.map(p => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={plataforma === p.id}
                onClick={() => setPlataforma(p.id)}
                className={`min-h-[40px] rounded-xl text-sm font-black transition ${plataforma === p.id ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {p.texto}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={plataforma}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5"
            >
              {pasos.map((paso, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-kk-primary/15 dark:bg-kk-primary/20 text-kk-dark dark:text-kk-secondary text-xs font-black grid place-items-center flex-shrink-0">{i + 1}</span>
                  <span className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 grid place-items-center flex-shrink-0">
                    <paso.icono size={18} />
                  </span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug [&_b]:font-black [&_b]:text-slate-900 dark:[&_b]:text-white">{paso.texto}</span>
                </li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default InstalarApp;
