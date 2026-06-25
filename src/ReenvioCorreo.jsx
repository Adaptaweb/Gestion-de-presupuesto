import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react';

const BANCOS_SOPORTADOS = [
  { nombre: 'Banco de Chile', dominio: '@bancochile.cl' },
  { nombre: 'Banco Santander', dominio: '@santander.cl' },
  { nombre: 'BCI', dominio: '@bci.cl' },
  { nombre: 'Banco Estado', dominio: '@bancoestado.cl' },
  { nombre: 'Scotiabank', dominio: '@scotiabank.cl' },
  { nombre: 'Itaú', dominio: '@itau.cl' },
  { nombre: 'Banco Falabella', dominio: '@falabella.cl' },
  { nombre: 'Banco Ripley', dominio: '@ripley.cl' },
  { nombre: 'MACH', dominio: '@mach.cl' },
];

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const ReenvioCorreo = ({ onBack }) => {
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/user/mailbox', { headers: getHeaders() })
      .then(res => res.json())
      .then(data => {
        setEmailData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = async () => {
    if (!emailData?.email) return;
    try {
      await navigator.clipboard.writeText(emailData.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-darker p-4 md:p-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="mt-6 bg-white dark:bg-dark-normal rounded-[2rem] shadow-2xl shadow-slate-200 dark:shadow-dark-darker/50 border border-slate-200 dark:border-dark-lighter p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl">
              <Mail className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Reenvío de Correos</h1>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : emailData ? (
            <>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-6">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">Tu dirección de reenvío</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-black text-indigo-800 dark:text-indigo-200 bg-white dark:bg-dark-lighter px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-700 flex-1 truncate">
                    {emailData.email}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-white dark:bg-dark-lighter border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all flex-shrink-0"
                  >
                    {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} className="text-indigo-600" />}
                  </button>
                </div>
              </div>

              <h2 className="text-lg font-black mb-3">Bancos soportados</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {BANCOS_SOPORTADOS.map(b => (
                  <span key={b.dominio} className="text-xs font-bold bg-slate-100 dark:bg-dark-lighter text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-dark-lightest">
                    {b.nombre} <span className="text-slate-400">({b.dominio})</span>
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-black mb-4">Paso a paso: Gmail</h2>

              <div className="space-y-4">
                {[
                  { n: 1, text: 'Abre Gmail y haz clic en el engranaje ⚙️ en la esquina superior derecha.', img: null },
                  { n: 2, text: 'Selecciona "Ver todos los ajustes".', img: null },
                  { n: 3, text: 'Ve a la pestaña "Filtros y direcciones bloqueadas".', img: null },
                  { n: 4, text: 'Haz clic en "Crear un filtro nuevo".', img: null },
                  { n: 5, text: 'En el campo "De:", ingresa los bancos que quieras monitorear separados por OR:', extra: (
                    <code className="block mt-1 text-xs font-mono bg-slate-100 dark:bg-dark-lighter px-2 py-1 rounded">
                      (@bci.cl OR @santander.cl OR @bancochile.cl)
                    </code>
                  )},
                  { n: 6, text: 'Haz clic en "Crear filtro".', img: null },
                  { n: 7, text: 'Marca la opción "Reenviarlo a:" y selecciona "Agregar dirección de reenvío".', img: null },
                  { n: 8, text: 'Ingresa tu dirección de reenvío:', extra: (
                    <code className="block mt-1 text-xs font-mono bg-slate-100 dark:bg-dark-lighter px-2 py-1 rounded">
                      {emailData.email}
                    </code>
                  )},
                  { n: 9, text: 'Gmail enviará un código de verificación a esa dirección. Revisa la sección de Transacciones en la app y pégalo para verificar.', img: null },
                  { n: 10, text: 'Vuelve al filtro, selecciona tu dirección y haz clic en "Crear filtro". ¡Listo!', img: null },
                ].map(step => (
                  <div key={step.n} className="flex gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center mt-0.5">
                      {step.n}
                    </div>
                    <div className="flex-1 text-sm text-slate-700 dark:text-slate-300 font-medium">
                      {step.text}
                      {step.extra}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Tip</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Una vez configurado el reenvío, las transacciones aparecerán automáticamente en la app. Puedes revisar la sección Transacciones para ver los movimientos extraídos de tus correos.
                </p>
              </div>
            </>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No se pudo cargar la información de tu casilla.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReenvioCorreo;