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

// iOS solo deja reproducir sin toque si el video esta silenciado como atributo, y
// React pone `muted` solo como propiedad: se marca a mano antes de cada play().
function reproducir(video, alBloquear) {
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  return video.play().catch(e => {
    // En Ahorro de bateria iOS no reproduce nada solo: queda esperando un toque.
    if (e?.name === 'NotAllowedError') alBloquear?.();
  });
}

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
  reproducir(video);
}

// Safari (iPhone, iPad, Mac) anima un mp4 puesto en un <img> como si fuera un GIF,
// incluso con Ahorro de bateria o sin "Reproducir videos automaticamente", que es
// justo cuando bloquea el <video>. Los demas navegadores no lo soportan.
const safariImgVideo = () => {
  const ua = navigator.userAgent;
  return /AppleWebKit/.test(ua) && !/Chrome\/|Chromium|Android|Edg\/|Firefox\//.test(ua);
};
// Si el sistema bloqueo un video, bloqueara todos: los siguientes parten como imagen.
let sistemaBloquea = false;

/** Video de una pantalla de la app que sigue la fase compartida y solo corre cuando se ve. */
export const VideoTema = ({ base, etiqueta, className = '' }) => {
  const fase = useFaseDemo();
  const ref = useRef(null);
  // Solo el primer valor: despues el src lo cambia cambiar() sin pasar por React.
  const [inicial] = useState(() => ({ base, fase }));
  const [visible, setVisible] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const [comoImagen, setComoImagen] = useState(() => sistemaBloquea && safariImgVideo());

  const alBloquear = () => {
    sistemaBloquea = true;
    if (safariImgVideo()) setComoImagen(true);
    else setBloqueado(true);
  };

  useEffect(() => {
    const v = ref.current;
    if (v?.tagName === 'VIDEO') v.setAttribute('muted', '');
    if (!v || typeof IntersectionObserver === 'undefined') { setVisible(true); return undefined; }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, [comoImagen]);

  useEffect(() => {
    const v = ref.current;
    if (!v || v.tagName !== 'VIDEO') return;
    if (visible) reproducir(v, alBloquear);
    else v.pause();
  }, [visible]);

  // Fuera de Safari, si el navegador lo bloqueo, el primer toque en la pagina lo arranca.
  useEffect(() => {
    if (!bloqueado || !visible) return undefined;
    const intentar = () => {
      const v = ref.current;
      if (v?.tagName === 'VIDEO') reproducir(v).then(() => { if (!v.paused) setBloqueado(false); });
    };
    document.addEventListener('touchend', intentar, { once: true, passive: true });
    document.addEventListener('click', intentar, { once: true });
    return () => {
      document.removeEventListener('touchend', intentar);
      document.removeEventListener('click', intentar);
    };
  }, [bloqueado, visible]);

  useEffect(() => {
    const v = ref.current;
    if (!v || v.tagName !== 'VIDEO' || v.dataset.base === base) return;
    cambiar(v, base, v.dataset.fase || fase, 'fundido');
  }, [base]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const v = ref.current;
    if (!v || v.tagName !== 'VIDEO' || v.dataset.fase === fase) return;
    cambiar(v, v.dataset.base || base, fase, 'barrido');
  }, [fase]); // eslint-disable-line react-hooks/exhaustive-deps

  if (comoImagen) {
    // Fuera de pantalla queda la portada para no gastar bateria animando lo que no se ve.
    return (
      <img
        ref={ref}
        key={`${base}-${fase}`}
        src={url(base, fase, visible ? 'mp4' : 'webp')}
        alt={etiqueta}
        className={`block w-full object-cover ${className}`}
        style={{ aspectRatio: '1080 / 2338', backgroundImage: `url(${url(base, fase, 'webp')})`, backgroundSize: 'cover' }}
      />
    );
  }

  return (
    <>
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
    {bloqueado && (
      <button
        type="button"
        aria-label="Reproducir video"
        onClick={() => { const v = ref.current; if (v) reproducir(v).then(() => { if (!v.paused) setBloqueado(false); }); }}
        className="absolute inset-0 z-[4] grid place-items-center"
      >
        <span className="w-14 h-14 rounded-full bg-black/45 backdrop-blur text-white grid place-items-center shadow-lg">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
        </span>
      </button>
    )}
    </>
  );
};
