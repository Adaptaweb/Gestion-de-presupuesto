import { useCallback, useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useLocation } from 'react-router-dom';
import { RefreshCw, Loader2, X } from 'lucide-react';

const CHECK_EVERY_MS = 5 * 60 * 1000;
const RELOAD_FALLBACK_MS = 6000;
// Paginas publicas sin formularios: ahi la version nueva se aplica sola.
const PUBLICAS = ['/', '/terminos', '/privacidad'];

// Desregistra el service worker, borra todos los caches y recarga: es lo que
// garantiza ver la version nueva aunque el cambio de service worker falle.
async function limpiarYRecargar() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch { /* se recarga igual */ }
  window.location.reload();
}

export default function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    // El navegador solo busca una version nueva al navegar; una PWA abierta
    // horas nunca se enteraba. Se consulta cada rato y al volver a la app.
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => {
        if (registration.installing || !navigator.onLine) return;
        registration.update().catch(() => {});
      };
      setInterval(check, CHECK_EVERY_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
  });
  const [versionVieja, setVersionVieja] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const { pathname } = useLocation();
  // El aviso solo se muestra con la sesion iniciada; en login y registro se espera.
  const enApp = pathname.startsWith('/app') || pathname.startsWith('/admin');
  const publica = PUBLICAS.includes(pathname);
  const hayVersion = needRefresh || versionVieja;

  // Respaldo independiente del service worker: /version.json trae el id del
  // ultimo build; si difiere del que esta corriendo, hay version nueva.
  const compararVersion = useCallback(async () => {
    if (typeof __BUILD_ID__ === 'undefined' || __BUILD_ID__ === 'dev' || !navigator.onLine) return;
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const { id } = await res.json();
      if (id && id !== __BUILD_ID__) setVersionVieja(true);
    } catch { /* sin red: se reintenta luego */ }
  }, []);

  useEffect(() => {
    compararVersion();
    const id = setInterval(compararVersion, CHECK_EVERY_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') compararVersion(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible); };
  }, [compararVersion]);

  // Si el cambio de service worker no recarga solo, se fuerza la limpieza.
  useEffect(() => {
    if (!updating) return undefined;
    const id = setTimeout(limpiarYRecargar, RELOAD_FALLBACK_MS);
    return () => clearTimeout(id);
  }, [updating]);

  const aplicando = useRef(false);
  const aplicar = useCallback(() => {
    if (aplicando.current) return;
    aplicando.current = true;
    if (needRefresh) {
      updateServiceWorker(true);
      setTimeout(limpiarYRecargar, RELOAD_FALLBACK_MS);
    } else limpiarYRecargar();
  }, [needRefresh, updateServiceWorker]);

  // En la landing se actualiza sola: de inmediato si recien cargo la pagina (al
  // recargar, Chrome restaura el scroll, asi que no se mira la posicion) o si
  // esta arriba; si ya lleva rato leyendo, cuando sale de la pestaña.
  useEffect(() => {
    if (!hayVersion || !publica) return undefined;
    if (performance.now() < 20000 || window.scrollY < 200 || document.hidden) {
      aplicar();
      return undefined;
    }
    const alOcultar = () => { if (document.visibilityState === 'hidden') aplicar(); };
    document.addEventListener('visibilitychange', alOcultar);
    return () => document.removeEventListener('visibilitychange', alOcultar);
  }, [hayVersion, publica, aplicar]);

  if (!hayVersion || !enApp) return null;

  const actualizar = () => {
    if (updating) return;
    setUpdating(true);
    if (needRefresh) updateServiceWorker(true);
    else limpiarYRecargar();
  };

  const descartar = () => {
    setLeaving(true);
    setTimeout(() => { setNeedRefresh(false); setVersionVieja(false); }, 260);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 z-[100] flex justify-center px-4 pointer-events-none"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
    >
      <style>{`
        @keyframes kkBannerIn { from { opacity: 0; transform: translateY(-16px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes kkBannerOut { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-12px) scale(0.97); } }
        @media (prefers-reduced-motion: reduce) { .kk-update-banner { animation: none !important; } }
      `}</style>
      <div
        className="kk-update-banner pointer-events-auto w-full max-w-sm flex items-center gap-3 bg-white/95 dark:bg-dark-normal/95 backdrop-blur-xl border border-slate-200 dark:border-dark-lighter rounded-3xl shadow-2xl pl-3 pr-2 py-2.5"
        style={{ animation: leaving ? 'kkBannerOut 260ms ease-in forwards' : 'kkBannerIn 520ms cubic-bezier(0.22, 1, 0.36, 1) backwards' }}
      >
        <div className="w-10 h-10 rounded-full bg-kk-primary/15 text-kk-primary flex items-center justify-center flex-shrink-0">
          <RefreshCw size={18} className={updating ? 'animate-spin' : ''} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-slate-800 dark:text-white leading-tight">
            {updating ? 'Actualizando…' : 'Nueva versión disponible'}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
            {updating ? 'La app se reiniciará sola' : 'Actualiza para ver lo último'}
          </p>
        </div>
        <button
          onClick={actualizar}
          disabled={updating}
          className="flex items-center gap-1.5 bg-kk-primary text-white px-4 min-h-[40px] rounded-full text-xs font-bold shadow-lg shadow-kk-primary/30 transition active:scale-95 disabled:opacity-80 flex-shrink-0"
        >
          {updating ? <Loader2 size={14} className="animate-spin" /> : null}
          {updating ? 'Un momento' : 'Actualizar'}
        </button>
        {!updating && (
          <button
            onClick={descartar}
            aria-label="Ahora no"
            className="w-9 h-9 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition active:scale-90 flex-shrink-0"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
