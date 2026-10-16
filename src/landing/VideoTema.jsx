import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

// Videos de la app en modo claro y oscuro (`${base}-claro.mp4` / `${base}-oscuro.mp4`,
// con su `.webp` de portada). Todos los videos de la landing alternan de tema a la vez
// cada 10 s, con el mismo efecto que el portafolio: el cuadro actual se congela en un
// canvas sobre el video y, cuando la otra version ya pinto, se borra con un barrido
// circular, siguiendo en el mismo segundo.

const INTERVALO_MS = 10000;

const ContextoFase = createContext('claro');

export const ProveedorTemaDemo = ({ children }) => {
  const [fase, setFase] = useState('claro');
  useEffect(() => {
    const t = window.setInterval(() => {
      if (!document.hidden) setFase(f => (f === 'claro' ? 'oscuro' : 'claro'));
    }, INTERVALO_MS);
    return () => window.clearInterval(t);
  }, []);
  return <ContextoFase.Provider value={fase}>{children}</ContextoFase.Provider>;
};

export const useFaseDemo = () => useContext(ContextoFase);

const url = (base, fase, ext = 'mp4') => `${base}-${fase}.${ext}`;
const movimientoReducido = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Congela el cuadro visible en un canvas encima del video.
function congelar(video) {
  const marco = video.parentElement;
  marco?.querySelectorAll('canvas.kk-cubierta').forEach(c => c.remove());
  if (!marco || video.readyState < 2 || !video.videoWidth || movimientoReducido()) return null;
  const cubierta = document.createElement('canvas');
  cubierta.className = 'kk-cubierta';
  cubierta.width = video.videoWidth;
  cubierta.height = video.videoHeight;
  try {
    cubierta.getContext('2d').drawImage(video, 0, 0, cubierta.width, cubierta.height);
  } catch {
    return null;
  }
  Object.assign(cubierta.style, {
    position: 'absolute', left: `${video.offsetLeft}px`, top: `${video.offsetTop}px`,
    width: `${video.offsetWidth}px`, height: `${video.offsetHeight}px`,
    zIndex: '2', pointerEvents: 'none',
  });
  marco.append(cubierta);
  return cubierta;
}

function retirar(cubierta, keyframes, duracion) {
  cubierta.animate(keyframes, { duration: duracion, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' }).onfinish = () => cubierta.remove();
  // Las animaciones se detienen en pestañas ocultas: que la cubierta nunca se quede.
  window.setTimeout(() => cubierta.remove(), duracion + 450);
}

// tipo 'barrido': cambio de tema en el mismo segundo. 'fundido': otro video (pestaña).
function cambiar(video, base, fase, tipo) {
  const seguia = !video.paused;
  const segundo = video.currentTime;
  video.dataset.base = base;
  video.dataset.fase = fase;
  // Fuera de pantalla (pausado) solo se apunta a la otra version.
  if (!seguia) {
    video.poster = url(base, fase, 'webp');
    video.src = url(base, fase);
    return;
  }
  const cubierta = congelar(video);
  video.poster = url(base, fase, 'webp');
  video.src = url(base, fase);
  video.addEventListener('loadeddata', () => {
    if (tipo === 'barrido') {
      try { video.currentTime = Math.min(segundo, (video.duration || segundo) - 0.1); } catch { /* sin seek */ }
    }
    if (cubierta) {
      if (tipo === 'barrido') {
        const origen = fase === 'oscuro' ? '100% 0%' : '0% 100%';
        retirar(cubierta, [{ clipPath: `circle(150% at ${origen})` }, { clipPath: `circle(0% at ${origen})` }], 750);
      } else {
        retirar(cubierta, [{ opacity: 1 }, { opacity: 0 }], 500);
      }
    }
  }, { once: true });
  if (cubierta) window.setTimeout(() => cubierta.remove(), 3000);
  video.play().catch(() => {});
}

/** Video de una pantalla de la app que sigue la fase compartida y solo corre cuando se ve. */
export const VideoTema = ({ base, etiqueta, className = '' }) => {
  const fase = useFaseDemo();
  const ref = useRef(null);
  // Solo el primer valor: despues el src lo cambia cambiar() sin pasar por React.
  const [inicial] = useState(() => ({ base, fase }));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (visible) v.play().catch(() => {});
    else v.pause();
  }, [visible]);

  useEffect(() => {
    const v = ref.current;
    if (!v || v.dataset.base === base) return;
    cambiar(v, base, v.dataset.fase || fase, 'fundido');
  }, [base]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const v = ref.current;
    if (!v || v.dataset.fase === fase) return;
    cambiar(v, v.dataset.base || base, fase, 'barrido');
  }, [fase]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <video
      ref={ref}
      data-base={inicial.base}
      data-fase={inicial.fase}
      src={url(inicial.base, inicial.fase)}
      poster={url(inicial.base, inicial.fase, 'webp')}
      muted
      loop
      playsInline
      preload="none"
      aria-label={etiqueta}
      className={`block w-full object-cover ${className}`}
      style={{ aspectRatio: '1080 / 2338' }}
    />
  );
};
