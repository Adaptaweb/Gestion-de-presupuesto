import React, { useState, useEffect, useCallback } from 'react';
import { Settings2, ExternalLink, X, Loader2 } from 'lucide-react';

const ConfigModal = ({ isOpen, onClose, token, theme, onOpenTutorial }) => {
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/transacciones/status', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => setAuthStatus(data.authenticated))
      .catch(() => setAuthStatus(false))
      .finally(() => setLoading(false));
  }, [isOpen, getHeaders]);

  const handleGmailAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/transacciones/auth-url', { headers: getHeaders() });
      const data = await res.json();
      if (data.url) {
        const w = window.open(data.url, '_blank');
        if (!w) window.location.href = data.url;
      }
    } catch (e) {
      console.error('Error al conectar con Gmail', e);
    }
  }, [getHeaders]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
            <Settings2 className={theme.tabText} size={20} /> Configuración
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
        ) : (
          <>
            <div className="mb-6 p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
              <label className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 mb-2 block">Conexión Gmail</label>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${authStatus ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {authStatus ? 'Conectado' : 'No conectado'}
                </span>
              </div>
              <button onClick={handleGmailAuth} className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg transition-all">
                <ExternalLink size={16} /> {authStatus ? 'Reconectar Gmail' : 'Conectar Gmail'}
              </button>
            </div>
            <div className="mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <label className="text-[10px] font-black uppercase text-blue-500 dark:text-blue-400 mb-2 block">Reenvío automático</label>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Configura un filtro en Gmail para reenviar las notificaciones bancarias automáticamente.
              </p>
              <button onClick={() => onOpenTutorial(authStatus)} className={`flex items-center justify-center gap-2 w-full ${theme.btnPrimary} text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg transition-all`}>
                <ExternalLink size={16} /> Ver tutorial paso a paso
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigModal;
