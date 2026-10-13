import React, { useState } from 'react';
import {
  ChevronRight, CreditCard, Bell, Tags, RotateCcw, Moon, Sun, RefreshCw, LogOut,
  Users, Mail, RotateCw, Filter, Settings2, BrainCircuit, Loader2, Check,
} from 'lucide-react';
import { THEME_COLORS, THEME_COLOR_HEX, COLOR_NAMES } from './user-dropdown.jsx';

// Etiqueta corta del plan para la cabecera de la hoja.
function chipPlan(billing) {
  switch (billing?.estado) {
    case 'prueba': return { texto: `Prueba · ${billing.diasRestantes} día${billing.diasRestantes === 1 ? '' : 's'}`, tono: 'amber' };
    case 'activa': return { texto: 'Plan activo', tono: 'emerald' };
    case 'pago_fallido': return { texto: 'Pago pendiente', tono: 'amber' };
    case 'cancelada_vigente': return { texto: 'Cancelada', tono: 'slate' };
    case 'solo_lectura': case 'suspendida': return { texto: 'Solo lectura', tono: 'rose' };
    default: return null;
  }
}

const TONOS = {
  amber: 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300',
  emerald: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  rose: 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300',
  slate: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300',
};

const Fila = ({ icono: Icono, texto, onClick, children, primero }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3.5 min-h-[52px] text-left transition active:bg-slate-100 dark:active:bg-white/5 ${primero ? '' : 'border-t border-slate-100 dark:border-white/5'}`}
  >
    <span className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 grid place-items-center flex-shrink-0">
      <Icono size={18} />
    </span>
    <span className="flex-1 text-[15px] font-bold text-slate-800 dark:text-slate-100">{texto}</span>
    {children}
  </button>
);

const Interruptor = ({ activo, cargando, theme }) => (
  <span className={`relative w-[46px] h-7 rounded-full flex-shrink-0 transition-colors duration-200 ${activo ? (theme.btnPrimary.split(' ')[0]) : 'bg-slate-300 dark:bg-slate-600'} ${cargando ? 'opacity-50' : ''}`}>
    <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-transform duration-200 ${activo ? 'translate-x-[18px]' : ''}`} />
  </span>
);

const Mosaico = ({ icono: Icono, texto, onClick, destacado }) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-[56px] rounded-2xl px-3.5 flex items-center gap-2.5 text-sm text-left transition active:scale-[0.98] border ${
      destacado
        ? 'bg-kk-primary/10 border-kk-primary/30 text-kk-dark dark:text-kk-secondary font-extrabold'
        : 'bg-white dark:bg-dark-lighter border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 font-bold'
    }`}
  >
    <Icono size={18} className={destacado ? '' : 'text-slate-400'} />
    {texto}
  </button>
);

const ProfileSheet = ({
  open, onClose, user, billing, theme, themeColor, setThemeColor, isDarkMode, onToggleDark,
  onOpenPlanes, onOpenCategorias, onRepetirTutorial,
  onOpenAdmin, onRevisarCorreos, onReprocesar, onOpenFilters, onOpenConfig, generateFinancialAdvice, isAiLoading,
  isPushSubscribed, isPushLoading, onToggleNotifications, onLogout,
}) => {
  const [saliendo, setSaliendo] = useState(false);
  if (!open) return null;

  const esAdmin = user.role === 'admin';
  const chip = esAdmin ? { texto: 'Admin', tono: 'amber' } : chipPlan(billing);
  const inicial = (user.name || '?').trim().charAt(0).toUpperCase();

  const cerrar = (despues) => {
    setSaliendo(true);
    setTimeout(() => {
      setSaliendo(false);
      onClose();
      if (typeof despues === 'function') despues();
    }, 220);
  };
  const accion = (fn) => () => cerrar(fn);

  return (
    <div className="md:hidden fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Mi perfil">
      <style>{`
        @keyframes kkSheetIn { from { transform: translateY(100%); } to { transform: none; } }
        @keyframes kkSheetOut { from { transform: none; } to { transform: translateY(100%); } }
        @keyframes kkScrimIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes kkScrimOut { from { opacity: 1; } to { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .kk-sheet, .kk-scrim { animation: none !important; } }
      `}</style>
      <div
        className="kk-scrim absolute inset-0 bg-slate-950/50 dark:bg-black/70 backdrop-blur-[2px]"
        style={{ animation: `${saliendo ? 'kkScrimOut' : 'kkScrimIn'} 220ms ease-out forwards` }}
        onClick={() => cerrar()}
      />
      <div
        className="kk-sheet absolute left-0 right-0 bottom-0 max-h-[92dvh] overflow-y-auto bg-slate-50 dark:bg-dark-normal border-t border-slate-200 dark:border-dark-lighter rounded-t-[2rem] px-4 pt-2.5 flex flex-col gap-3.5"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)',
          animation: saliendo ? 'kkSheetOut 220ms cubic-bezier(0.4, 0, 1, 1) forwards' : 'kkSheetIn 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="w-10 h-1.5 rounded-full bg-slate-300 dark:bg-white/15 mx-auto flex-shrink-0" />

        <div className="flex items-center gap-3.5 px-1">
          <span className={`w-[52px] h-[52px] rounded-full border-2 grid place-items-center text-[22px] font-extrabold flex-shrink-0 ${theme.borderAccent} ${theme.tabText} bg-white dark:bg-dark-lighter`}>{inicial}</span>
          <div className="min-w-0 flex-1">
            <div className="text-[17px] font-extrabold text-slate-900 dark:text-white leading-tight truncate">{user.name}</div>
            {user.email && <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</div>}
          </div>
          {chip && <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap ${TONOS[chip.tono]}`}>{chip.texto}</span>}
        </div>

        {esAdmin && (
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 px-1">Administración</div>
            <div className="grid grid-cols-2 gap-2">
              <Mosaico icono={Users} texto="Usuarios" onClick={accion(onOpenAdmin)} />
              {onRevisarCorreos && <Mosaico icono={Mail} texto="Revisar correos" onClick={accion(onRevisarCorreos)} />}
              {onReprocesar && <Mosaico icono={RotateCw} texto="Reprocesar" onClick={accion(onReprocesar)} />}
              <Mosaico icono={Filter} texto="Reglas" onClick={accion(onOpenFilters)} />
              <Mosaico icono={Settings2} texto="Configurar" onClick={accion(onOpenConfig)} />
              <Mosaico icono={isAiLoading ? Loader2 : BrainCircuit} texto="Consultar IA" destacado onClick={accion(generateFinancialAdvice)} />
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-dark-lighter border border-slate-200 dark:border-white/5 rounded-[20px] overflow-hidden">
          {onOpenPlanes && <Fila icono={CreditCard} texto="Mi plan" primero onClick={accion(onOpenPlanes)}><ChevronRight size={18} className="text-slate-400" /></Fila>}
          <Fila icono={Bell} texto="Notificaciones" primero={!onOpenPlanes} onClick={() => { if (!isPushLoading) onToggleNotifications(); }}>
            {isPushLoading ? <Loader2 size={18} className="animate-spin text-slate-400" /> : <Interruptor activo={isPushSubscribed} theme={theme} />}
          </Fila>
          <Fila icono={Tags} texto="Categorías" onClick={accion(onOpenCategorias)}><ChevronRight size={18} className="text-slate-400" /></Fila>
          {!esAdmin && <Fila icono={RotateCcw} texto="Repetir tutorial" onClick={accion(onRepetirTutorial)}><ChevronRight size={18} className="text-slate-400" /></Fila>}
        </div>

        <div className="bg-white dark:bg-dark-lighter border border-slate-200 dark:border-white/5 rounded-[20px] overflow-hidden">
          <Fila icono={isDarkMode ? Moon : Sun} texto="Modo oscuro" primero onClick={onToggleDark}>
            <Interruptor activo={isDarkMode} theme={theme} />
          </Fila>
          <div className="px-3.5 pt-2.5 pb-3.5 border-t border-slate-100 dark:border-white/5">
            <div className="text-xs font-bold text-slate-400 mb-2.5">Color del tema</div>
            <div className="flex justify-between">
              {THEME_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setThemeColor(color)}
                  aria-label={COLOR_NAMES[color]}
                  aria-pressed={themeColor === color}
                  className={`w-7 h-7 rounded-full grid place-items-center transition active:scale-90 ${themeColor === color ? 'ring-2 ring-offset-[3px] ring-slate-400 dark:ring-white/70 ring-offset-white dark:ring-offset-dark-lighter' : ''}`}
                  style={{ backgroundColor: THEME_COLOR_HEX[color] }}
                >
                  {themeColor === color && <Check size={13} className="text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              Promise.all([
                'serviceWorker' in navigator ? navigator.serviceWorker.getRegistrations().then((regs) => Promise.all(regs.map((r) => r.unregister()))) : null,
                'caches' in window ? caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))) : null,
              ]).catch(() => {}).finally(() => window.location.reload());
            }}
            className="flex-1 min-h-[50px] rounded-2xl bg-white dark:bg-dark-lighter border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 text-sm font-bold flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <RefreshCw size={16} /> Recargar app
          </button>
          <button
            type="button"
            onClick={accion(onLogout)}
            className="flex-1 min-h-[50px] rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 text-rose-600 dark:text-rose-400 text-sm font-extrabold flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSheet;
