import React, { useLayoutEffect, useRef, useState } from 'react';

// Navegacion con una "pill" que se desliza hasta la opcion elegida. La misma
// pieza sirve para la barra de escritorio y para la flotante del movil: cambia
// solo el aspecto. La pill se mide sobre el boton activo, asi que sigue
// funcionando si cambia el ancho (rotar el telefono, otra fuente, otro tema).
const SPRING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function NavPill({ items, activeId, onSelect, theme, variant = 'desktop', spacerAt = -1 }) {
  const wrapRef = useRef(null);
  const btnRefs = useRef({});
  const [pill, setPill] = useState(null);
  const [animate, setAnimate] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = btnRefs.current[activeId];
      if (!el) return;
      setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && wrapRef.current) ro.observe(wrapRef.current);
    // La primera posicion se fija sin viaje; los cambios siguientes si animan.
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => { ro?.disconnect(); cancelAnimationFrame(id); };
  }, [activeId]);

  const isMobile = variant === 'mobile';
  // Mismos colores en movil y escritorio: pill del tema con texto blanco.
  const pillClass = `${theme.btnPrimary} shadow-md ${theme.shadowBtn} ${isMobile ? 'top-1.5 bottom-1.5' : 'top-1 bottom-1'}`;

  return (
    <div
      ref={wrapRef}
      className={isMobile
        ? 'relative flex items-center h-16 rounded-full bg-white/95 dark:bg-dark-normal/95 backdrop-blur-xl border border-slate-200 dark:border-dark-lighter shadow-2xl shadow-slate-400/25 dark:shadow-black/60'
        : 'relative flex items-center gap-1 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-full p-1 shadow-sm'}
    >
      {pill && (
        <span
          aria-hidden="true"
          className={`absolute left-0 rounded-full pointer-events-none ${pillClass}`}
          style={{
            width: isMobile ? Math.max(0, pill.width - 8) : pill.width,
            transform: `translateX(${isMobile ? pill.left + 4 : pill.left}px)`,
            transition: animate ? `transform 460ms ${SPRING}, width 460ms ${SPRING}` : 'none',
          }}
        />
      )}
      {items.map(({ id, icon: Icon, label, short }, i) => {
        const active = activeId === id;
        return (
          <React.Fragment key={id}>
            {i === spacerAt && <span className="w-16 flex-shrink-0" aria-hidden="true" />}
            <button
              ref={(el) => { btnRefs.current[id] = el; }}
              onClick={() => onSelect(id)}
              aria-current={active ? 'page' : undefined}
              className={isMobile
                ? 'relative z-10 flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 h-full rounded-full transition-transform duration-200 active:scale-90'
                : `relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black transition-colors duration-300 active:scale-95 ${
                    active ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
            >
              <span
                key={active ? `on-${id}` : `off-${id}`}
                className={`grid place-items-center ${active ? 'animate-nav-pop' : ''}`}
              >
                <Icon
                  size={isMobile ? 21 : 16}
                  strokeWidth={active ? 2.6 : 2}
                  className={isMobile
                    ? `transition-colors duration-300 ${active ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`
                    : undefined}
                />
              </span>
              {isMobile ? (
                <span className={`text-[11px] leading-none transition-all duration-300 ${active ? 'font-extrabold text-white' : 'font-bold text-slate-400 dark:text-slate-500'}`}>
                  {short}
                </span>
              ) : label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
