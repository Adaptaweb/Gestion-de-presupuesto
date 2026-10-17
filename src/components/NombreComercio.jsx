import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';

// Nombre legible del comercio con un boton "i" que muestra el texto tal como lo
// trajo el banco ("PAYU *UBER TRIP CL"). Solo aparece cuando son distintos.
const NombreComercio = ({ tx, vacio = 'Sin comercio', className = '', tamanoIcono = 14, alineacion = 'izquierda' }) => {
  // Posicion de la burbuja (fixed, en el body): dentro de la tarjeta quedaba
  // recortada por su overflow.
  const [abierto, setAbierto] = useState(null);
  const ref = useRef(null);
  const burbujaRef = useRef(null);
  const nombre = tx?.comercio || vacio;
  const original = (tx?.comercio_original || '').trim();
  const distinto = original && original.toLowerCase() !== String(tx?.comercio || '').trim().toLowerCase();

  useEffect(() => {
    if (!abierto) return undefined;
    const cerrar = (e) => {
      if (!ref.current?.contains(e.target) && !burbujaRef.current?.contains(e.target)) setAbierto(null);
    };
    const conTecla = (e) => { if (e.key === 'Escape') setAbierto(null); };
    const alMover = () => setAbierto(null);
    document.addEventListener('pointerdown', cerrar);
    document.addEventListener('keydown', conTecla);
    window.addEventListener('scroll', alMover, true);
    window.addEventListener('resize', alMover);
    return () => {
      document.removeEventListener('pointerdown', cerrar);
      document.removeEventListener('keydown', conTecla);
      window.removeEventListener('scroll', alMover, true);
      window.removeEventListener('resize', alMover);
    };
  }, [abierto]);

  if (!distinto) return <span className={className}>{nombre}</span>;

  return (
    <span ref={ref} className={`relative inline-flex items-center gap-1 max-w-full min-w-0 ${alineacion === 'centro' ? 'justify-center' : ''}`}>
      <span className={`truncate ${className}`}>{nombre}</span>
      <button
        type="button"
        aria-label={`Ver nombre original: ${original}`}
        aria-expanded={!!abierto}
        onClick={(e) => {
          e.stopPropagation();
          if (abierto) { setAbierto(null); return; }
          const r = e.currentTarget.getBoundingClientRect();
          const ancho = Math.min(256, window.innerWidth - 24);
          const izquierda = Math.max(12, Math.min(r.left - 12, window.innerWidth - ancho - 12));
          setAbierto({ top: r.bottom + 6, left: izquierda, ancho });
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className={`flex-shrink-0 grid place-items-center w-6 h-6 -my-1 rounded-full transition-colors ${abierto ? 'text-kk-primary bg-kk-primary/10' : 'text-slate-400 dark:text-slate-500 hover:text-kk-primary'}`}
      >
        <Info size={tamanoIcono} strokeWidth={2.4} />
      </button>
      {abierto && createPortal(
        <span
          ref={burbujaRef}
          role="status"
          onClick={(e) => e.stopPropagation()}
          style={{ top: abierto.top, left: abierto.left, maxWidth: abierto.ancho }}
          className="fixed z-[200] w-max rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 text-left shadow-xl animate-fade-in"
        >
          <span className="block text-[10px] font-bold uppercase tracking-wider opacity-60">Nombre en el banco</span>
          <span className="block text-xs font-semibold break-words">{original}</span>
        </span>,
        document.body
      )}
    </span>
  );
};

export default NombreComercio;
