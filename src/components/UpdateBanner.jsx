import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';

export default function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        r.addEventListener('updatefound', () => {
          console.log('[PWA] New version found, will prompt user');
        });
      }
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-kk-primary text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-3">
        <p className="text-sm font-bold">Nueva versión disponible</p>
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>
    </div>
  );
}
