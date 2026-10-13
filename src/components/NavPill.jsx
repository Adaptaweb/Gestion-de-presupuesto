import React, { useLayoutEffect, useRef, useState } from 'react';

// Navegacion con una "pill" que se desliza hasta la opcion elegida.
//  - desktop: barra de texto con icono.
//  - dock (movil): solo iconos; la opcion activa se estira y muestra su
//    nombre dentro de la pill, que viaja y cambia de ancho al mismo tiempo.
// La pill se mide sobre el boton activo, y tambien cuando ese boton cambia de
// tamano (el dock estira y encoge los botones), asi que no queda desfasada.
const SPRING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURACION = 460;
// Misma curva que SPRING (ease-out fuerte) para que la pill siga a los botones.
const easeOut = (t) => 1 - Math.pow(1 - t, 4);

export default function NavPill({ items, activeId, onSelect, theme, variant = 'desktop', tint }) {
  const wrapRef = useRef(null);
  const btnRefs = useRef({});
  const pillRef = useRef(null);
  const actual = useRef(null); // geometria que la pill muestra ahora
  const isDock = variant === 'dock';

  // La pill viaja desde donde esta hasta la caja VIVA del boton activo. En el
  // dock los botones tambien se estiran y encogen mientras ella se mueve; si
  // la pill apuntara a una medida fija, al avanzar hacia la derecha el destino
  // se corre bajo sus pies y las dos animaciones chocan. Aqui se recalcula el
  // destino en cada cuadro y se mezcla con la misma curva.
  useLayoutEffect(() => {
    const pill = pillRef.current;
    const destino = () => {
      const el = btnRefs.current[activeId];
      return el ? { left: el.offsetLeft, width: el.offsetWidth } : null;
    };
    const pintar = (g) => {
      actual.current = g;
      pill.style.width = `${g.width}px`;
      pill.style.transform = `translateX(${g.left}px)`;
      pill.style.opacity = '1';
    };
    const fin = destino();
    if (!pill || !fin) return undefined;

    const reducido = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const desde = actual.current;
    let raf = 0;
    if (!desde || reducido) {
      pintar(fin); // primera posicion: sin viaje
    } else {
      const t0 = performance.now();
      const paso = (ahora) => {
        const t = Math.min(1, (ahora - t0) / DURACION);
        const meta = destino() || fin;
        const e = easeOut(t);
        pintar({ left: desde.left + (meta.left - desde.left) * e, width: desde.width + (meta.width - desde.width) * e });
        raf = t < 1 ? requestAnimationFrame(paso) : 0;
      };
      raf = requestAnimationFrame(paso);
    }

    // Cambios de tamano ajenos al viaje (girar el telefono, otra fuente).
    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => { if (!raf) { const m = destino(); if (m) pintar(m); } })
      : null;
    ro?.observe(wrapRef.current);
    return () => { cancelAnimationFrame(raf); raf = 0; ro?.disconnect(); };
  }, [activeId, items.length]);

  return (
    <div
      ref={wrapRef}
      className={isDock
        ? 'kk-glass relative flex items-center h-16 px-[5px] rounded-full'
        : 'relative flex items-center gap-1 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-full p-1 shadow-sm'}
    >
      <span
        ref={pillRef}
        aria-hidden="true"
        className={`absolute left-0 rounded-full pointer-events-none ${isDock ? 'kk-glass-tint top-[9px] bottom-[9px]' : `${theme.btnPrimary} shadow-md ${theme.shadowBtn} top-1 bottom-1`}`}
        style={isDock ? { opacity: 0, '--kk-tint': tint } : { opacity: 0 }}
      />
      {items.map(({ id, icon: Icon, label, short, avatar }) => {
        const active = activeId === id;
        return (
          <button
            key={id}
            ref={(el) => { btnRefs.current[id] = el; }}
            onClick={() => onSelect(id)}
            aria-current={active ? 'page' : undefined}
            aria-label={isDock ? (label || short) : undefined}
            className={isDock
              ? `relative z-10 h-[46px] min-w-0 flex items-center justify-center rounded-full overflow-hidden whitespace-nowrap transition-colors duration-300 active:scale-90 ${active ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`
              : `relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-colors duration-300 active:scale-95 ${
                  active ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
            style={isDock ? { flex: `${active ? 3.5 : 1} 1 0%`, transition: `flex-grow 460ms ${SPRING}, color 300ms` } : undefined}
          >
            <span
              key={active ? `on-${id}` : `off-${id}`}
              className={`grid place-items-center ${active ? 'animate-nav-pop' : ''}`}
            >
              {avatar ? (
                <span className={`w-[24px] h-[24px] rounded-full border-[1.5px] grid place-items-center text-[12px] font-extrabold leading-none transition-colors duration-300 ${active ? 'border-white text-white bg-white/20' : 'border-slate-400 dark:border-slate-500 text-slate-500 dark:text-slate-400'}`}>{avatar}</span>
              ) : (
                <Icon size={isDock ? 22 : 16} strokeWidth={active ? 2.6 : 2} />
              )}
            </span>
            {isDock ? (
              <span
                className="text-[12px] font-extrabold overflow-hidden"
                style={{
                  maxWidth: active ? 100 : 0,
                  marginLeft: active ? 6 : 0,
                  opacity: active ? 1 : 0,
                  transition: `max-width 460ms ${SPRING}, margin 460ms ${SPRING}, opacity 300ms`,
                }}
              >
                {short}
              </span>
            ) : label}
          </button>
        );
      })}
    </div>
  );
}
