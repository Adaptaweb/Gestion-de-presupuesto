import React, { useLayoutEffect, useRef, useState } from 'react';

// Navegacion con una "pill" que se desliza hasta la opcion elegida.
//  - desktop: barra de texto con icono.
//  - dock (movil): solo iconos; la opcion activa se estira y muestra su
//    nombre dentro de la pill, que viaja y cambia de ancho al mismo tiempo.
// La pill se mide sobre el boton activo, y tambien cuando ese boton cambia de
// tamano (el dock estira y encoge los botones), asi que no queda desfasada.
const SPRING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function NavPill({ items, activeId, onSelect, theme, variant = 'desktop' }) {
  const wrapRef = useRef(null);
  const btnRefs = useRef({});
  const [pill, setPill] = useState(null);
  const [animate, setAnimate] = useState(false);
  const isDock = variant === 'dock';

  useLayoutEffect(() => {
    const measure = () => {
      const el = btnRefs.current[activeId];
      if (!el) return;
      setPill((prev) => {
        const next = { left: el.offsetLeft, width: el.offsetWidth };
        return prev && prev.left === next.left && prev.width === next.width ? prev : next;
      });
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro) {
      if (wrapRef.current) ro.observe(wrapRef.current);
      Object.values(btnRefs.current).forEach((el) => el && ro.observe(el));
    }
    // La primera posicion se fija sin viaje; los cambios siguientes si animan.
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => { ro?.disconnect(); cancelAnimationFrame(id); };
  }, [activeId, items.length]);

  return (
    <div
      ref={wrapRef}
      className={isDock
        ? 'relative flex items-center justify-between h-16 px-[5px] rounded-full bg-white/95 dark:bg-dark-normal/95 backdrop-blur-xl border border-slate-200 dark:border-dark-lighter shadow-2xl shadow-slate-400/25 dark:shadow-black/60'
        : 'relative flex items-center gap-1 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-full p-1 shadow-sm'}
    >
      {pill && (
        <span
          aria-hidden="true"
          className={`absolute left-0 rounded-full pointer-events-none ${theme.btnPrimary} shadow-md ${theme.shadowBtn} ${isDock ? 'top-[9px] bottom-[9px]' : 'top-1 bottom-1'}`}
          style={{
            width: pill.width,
            transform: `translateX(${pill.left}px)`,
            transition: animate ? `transform 460ms ${SPRING}, width 460ms ${SPRING}` : 'none',
          }}
        />
      )}
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
              ? `relative z-10 h-[46px] min-w-[40px] flex items-center justify-center rounded-full overflow-hidden whitespace-nowrap transition-colors duration-300 active:scale-90 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`
              : `relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-colors duration-300 active:scale-95 ${
                  active ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
            style={isDock ? { padding: active ? '0 14px 0 11px' : '0 8px', transition: `padding 460ms ${SPRING}, color 300ms` } : undefined}
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
                className="text-[13px] font-extrabold overflow-hidden"
                style={{
                  maxWidth: active ? 72 : 0,
                  marginLeft: active ? 7 : 0,
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
