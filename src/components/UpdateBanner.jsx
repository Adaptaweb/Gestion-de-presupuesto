import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'kk_build_version';

export default function UpdateBanner() {
  const [stale, setStale] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = String(__BUILD_TIME__);
    if (stored && stored !== current) {
      setStale(true);
    }
    localStorage.setItem(STORAGE_KEY, current);
  }, []);

  if (!stale) return null;

  const handleUpdate = () => {
    localStorage.setItem(STORAGE_KEY, String(__BUILD_TIME__));
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister());
      }).finally(() => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-16 inset-x-4 z-30 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-kk-primary text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between gap-3 max-w-sm w-full animate-in slide-in-from-top-2 fade-in duration-300">
        <p className="text-sm font-bold">Nueva versión disponible</p>
        <button
          onClick={handleUpdate}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0"
        >
          <RefreshCw size={14} />
          Actualizar
        </button>
      </div>
    </div>
  );
}
