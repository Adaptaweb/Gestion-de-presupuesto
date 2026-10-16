import React from 'react';
import { useFaseDemo } from './VideoTema';

// iPhone dibujado en CSS: marco de titanio, bisel negro, Dynamic Island, botones
// laterales, barra de estado que sigue el tema del video y un reflejo de vidrio.
// `ancho` es el ancho total del telefono en px; todo se escala desde ahi.
const IPhone = ({ ancho = 300, children, className = '', sinBarra = false }) => {
  const fase = useFaseDemo();
  const oscuro = fase === 'oscuro';
  const borde = Math.round(ancho * 0.012);
  const bisel = Math.round(ancho * 0.034);
  const pantalla = ancho - 2 * (borde + bisel);
  const radio = Math.round(ancho * 0.165);
  const radioPantalla = radio - borde - bisel;
  const alturaBarra = Math.round(pantalla * 0.115);

  return (
    <div className={`relative ${className}`} style={{ width: ancho }}>
      {/* Botones laterales */}
      <span aria-hidden="true" className="absolute rounded-l-sm bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700" style={{ left: -2, top: ancho * 0.36, width: 3, height: ancho * 0.09 }} />
      <span aria-hidden="true" className="absolute rounded-l-sm bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700" style={{ left: -2, top: ancho * 0.5, width: 3, height: ancho * 0.18 }} />
      <span aria-hidden="true" className="absolute rounded-l-sm bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700" style={{ left: -2, top: ancho * 0.72, width: 3, height: ancho * 0.18 }} />
      <span aria-hidden="true" className="absolute rounded-r-sm bg-gradient-to-b from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-700" style={{ right: -2, top: ancho * 0.56, width: 3, height: ancho * 0.28 }} />

      {/* Marco de titanio */}
      <div
        className="relative shadow-[0_40px_80px_-30px_rgba(15,23,42,0.55),0_24px_70px_-40px_rgba(45,188,139,0.6)] dark:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_24px_80px_-40px_rgba(45,188,139,0.5)]"
        style={{
          padding: borde,
          borderRadius: radio,
          background: 'linear-gradient(145deg, #e4e7ec 0%, #9aa1ab 22%, #d3d7dd 48%, #7c838d 74%, #c9cdd3 100%)',
        }}
      >
        {/* Bisel */}
        <div className="bg-black" style={{ padding: bisel, borderRadius: radio - borde }}>
          {/* Pantalla */}
          <div
            className="relative overflow-hidden"
            style={{ borderRadius: radioPantalla, background: oscuro ? '#0f0f0f' : '#f8fffd', transition: 'background-color 600ms ease' }}
          >
            {/* Barra de estado (las capturas que ya traen la suya la omiten) */}
            {sinBarra ? (
              <span aria-hidden="true" className="absolute z-[4] left-1/2 -translate-x-1/2 bg-black rounded-full" style={{ top: alturaBarra * 0.16, width: pantalla * 0.31, height: alturaBarra * 0.7 }} />
            ) : (
            <div
              className="relative flex items-center justify-between font-sans font-semibold"
              style={{
                height: alturaBarra,
                paddingInline: pantalla * 0.085,
                fontSize: Math.max(9, pantalla * 0.042),
                color: oscuro ? '#fff' : '#0f172a',
                transition: 'color 600ms ease',
              }}
            >
              <span style={{ paddingTop: alturaBarra * 0.08 }}>9:41</span>
              <span className="flex items-center" style={{ gap: pantalla * 0.014, paddingTop: alturaBarra * 0.08 }} aria-hidden="true">
                <svg width={pantalla * 0.055} viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
                <svg width={pantalla * 0.05} viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.5c2.3 0 4.4.9 6 2.4l1.3-1.4A10.4 10.4 0 0 0 8 .5 10.4 10.4 0 0 0 .7 3.5L2 4.9A8.4 8.4 0 0 1 8 2.5Zm0 3.9c1.3 0 2.4.5 3.3 1.3l1.3-1.4A6.6 6.6 0 0 0 8 4.4c-1.8 0-3.4.7-4.6 1.9l1.3 1.4A4.6 4.6 0 0 1 8 6.4Zm0 3.8c.5 0 .9.2 1.2.5L8 12 6.8 10.7c.3-.3.7-.5 1.2-.5Z" /></svg>
                <svg width={pantalla * 0.075} viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" /><path d="M24 4v4c.8-.3 1.5-1.1 1.5-2S24.8 4.3 24 4Z" fill="currentColor" opacity="0.4" /></svg>
              </span>
              {/* Dynamic Island */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
                style={{ top: alturaBarra * 0.16, width: pantalla * 0.31, height: alturaBarra * 0.7 }}
              />
            </div>
            )}
            {children}
            {/* Reflejo del vidrio */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[3]"
              style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0) 42%)' }}
            />
            {/* Indicador de inicio */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 rounded-full z-[3]"
              style={{ bottom: pantalla * 0.022, width: pantalla * 0.36, height: Math.max(3, pantalla * 0.014), background: oscuro ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.75)', transition: 'background-color 600ms ease' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPhone;
