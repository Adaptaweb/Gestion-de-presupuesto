import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail, RefreshCw, Trash2, ExternalLink, Loader2, Inbox, Filter,
  Settings2, Plus, X, Edit3, Check, ChevronLeft, ChevronRight,
  Utensils, Bus, Wrench, Clapperboard, HeartPulse, Home, ShoppingBag,
  MoreHorizontal, ArrowRight, Zap, CalendarDays, CalendarRange, Ban,
  Banknote, TrendingUp, Wallet, Clock, Save
} from 'lucide-react';

const CATEGORY_LIST = [
  'Casa y cuentas', 'Mercadería', 'Gustitos', 'Transporte', 'Compras',
  'Salud y deportes', 'Educación', 'Suscripciones', 'Viajes y vacaciones',
  'Donaciones y regalos', 'Otros', 'Ahorro', 'Sueldo', 'Inversiones / Renta',
  'Otros ingresos', 'Gastos bancarios', 'Intereses', 'Créditos de consumo',
  'Sin categoría', 'Juegos'
];

const CATEGORY_COLORS = {
  'Casa y cuentas': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'Mercadería': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Gustitos': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'Transporte': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Compras': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Salud y deportes': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Educación': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  'Suscripciones': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Viajes y vacaciones': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Donaciones y regalos': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  'Otros': 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
  'Ahorro': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Sueldo': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Inversiones / Renta': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'Otros ingresos': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
  'Gastos bancarios': 'bg-stone-100 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300',
  'Intereses': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'Créditos de consumo': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Sin categoría': 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-300',
  'Juegos': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const CATEGORY_BAR_COLORS = {
  'Casa y cuentas': 'bg-amber-400 dark:bg-amber-500',
  'Mercadería': 'bg-orange-400 dark:bg-orange-500',
  'Gustitos': 'bg-rose-400 dark:bg-rose-500',
  'Transporte': 'bg-blue-400 dark:bg-blue-500',
  'Compras': 'bg-pink-400 dark:bg-pink-500',
  'Salud y deportes': 'bg-green-400 dark:bg-green-500',
  'Educación': 'bg-violet-400 dark:bg-violet-500',
  'Suscripciones': 'bg-indigo-400 dark:bg-indigo-500',
  'Viajes y vacaciones': 'bg-cyan-400 dark:bg-cyan-500',
  'Donaciones y regalos': 'bg-fuchsia-400 dark:bg-fuchsia-500',
  'Otros': 'bg-slate-400 dark:bg-slate-500',
  'Ahorro': 'bg-emerald-400 dark:bg-emerald-500',
  'Sueldo': 'bg-yellow-400 dark:bg-yellow-500',
  'Inversiones / Renta': 'bg-teal-400 dark:bg-teal-500',
  'Otros ingresos': 'bg-lime-400 dark:bg-lime-500',
  'Gastos bancarios': 'bg-stone-400 dark:bg-stone-500',
  'Intereses': 'bg-sky-400 dark:bg-sky-500',
  'Créditos de consumo': 'bg-red-400 dark:bg-red-500',
  'Sin categoría': 'bg-zinc-400 dark:bg-zinc-500',
  'Juegos': 'bg-purple-400 dark:bg-purple-500',
};

const CATEGORY_ICON_BG = {
  'Casa y cuentas': 'bg-amber-100 dark:bg-amber-500/20',
  'Mercadería': 'bg-orange-100 dark:bg-orange-500/20',
  'Gustitos': 'bg-rose-100 dark:bg-rose-500/20',
  'Transporte': 'bg-blue-100 dark:bg-blue-500/20',
  'Compras': 'bg-pink-100 dark:bg-pink-500/20',
  'Salud y deportes': 'bg-green-100 dark:bg-green-500/20',
  'Educación': 'bg-violet-100 dark:bg-violet-500/20',
  'Suscripciones': 'bg-indigo-100 dark:bg-indigo-500/20',
  'Viajes y vacaciones': 'bg-cyan-100 dark:bg-cyan-500/20',
  'Donaciones y regalos': 'bg-fuchsia-100 dark:bg-fuchsia-500/20',
  'Otros': 'bg-slate-100 dark:bg-slate-500/20',
  'Ahorro': 'bg-emerald-100 dark:bg-emerald-500/20',
  'Sueldo': 'bg-yellow-100 dark:bg-yellow-500/20',
  'Inversiones / Renta': 'bg-teal-100 dark:bg-teal-500/20',
  'Otros ingresos': 'bg-lime-100 dark:bg-lime-500/20',
  'Gastos bancarios': 'bg-stone-100 dark:bg-stone-500/20',
  'Intereses': 'bg-sky-100 dark:bg-sky-500/20',
  'Créditos de consumo': 'bg-red-100 dark:bg-red-500/20',
  'Sin categoría': 'bg-zinc-100 dark:bg-zinc-500/20',
  'Juegos': 'bg-purple-100 dark:bg-purple-500/20',
};

const CATEGORY_ICON_COLOR = {
  'Casa y cuentas': 'text-amber-500 dark:text-amber-300',
  'Mercadería': 'text-orange-500 dark:text-orange-300',
  'Gustitos': 'text-rose-500 dark:text-rose-300',
  'Transporte': 'text-blue-500 dark:text-blue-300',
  'Compras': 'text-pink-500 dark:text-pink-300',
  'Salud y deportes': 'text-green-500 dark:text-green-300',
  'Educación': 'text-violet-500 dark:text-violet-300',
  'Suscripciones': 'text-indigo-500 dark:text-indigo-300',
  'Viajes y vacaciones': 'text-cyan-500 dark:text-cyan-300',
  'Donaciones y regalos': 'text-fuchsia-500 dark:text-fuchsia-300',
  'Otros': 'text-slate-500 dark:text-slate-300',
  'Ahorro': 'text-emerald-500 dark:text-emerald-300',
  'Sueldo': 'text-yellow-500 dark:text-yellow-300',
  'Inversiones / Renta': 'text-teal-500 dark:text-teal-300',
  'Otros ingresos': 'text-lime-500 dark:text-lime-300',
  'Gastos bancarios': 'text-stone-500 dark:text-stone-300',
  'Intereses': 'text-sky-500 dark:text-sky-300',
  'Créditos de consumo': 'text-red-500 dark:text-red-300',
  'Sin categoría': 'text-zinc-500 dark:text-zinc-300',
  'Juegos': 'text-purple-500 dark:text-purple-300',
};

const CATEGORY_EMOJI = {
  'Casa y cuentas': '🏠',
  'Mercadería': '🛒',
  'Gustitos': '🍻',
  'Transporte': '🚗',
  'Compras': '🛍️',
  'Salud y deportes': '❤️',
  'Educación': '🎓',
  'Suscripciones': '📱',
  'Viajes y vacaciones': '🏖️',
  'Donaciones y regalos': '🎁',
  'Otros': '👤',
  'Ahorro': '🐷',
  'Sueldo': '💰',
  'Inversiones / Renta': '📈',
  'Otros ingresos': '💲',
  'Gastos bancarios': '🏦',
  'Intereses': '%',
  'Créditos de consumo': '💸',
  'Sin categoría': '➖',
  'Juegos': '🎮',
};

const BANK_COLORS = {
  'BCI': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Santander': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Banco de Chile': 'bg-blue-100 text-blue-700 dark:bg-blue-100 dark:text-blue-700',
  'Banco Estado': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  'Mach': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const BANK_ACCENT = {
  'BCI': 'border-l-red-500',
  'Santander': 'border-l-red-500',
  'Banco de Chile': 'border-l-blue-500',
  'Banco Estado': 'border-l-sky-500',
  'Mach': 'border-l-purple-500',
};

const BANK_ICONS = {
  'BCI': '/chile-icons/bancos/bci.png',
  'Santander': '/chile-icons/bancos/santander.png',
  'Banco de Chile': '/chile-icons/bancos/banco_de_chile.png',
  'Banco Estado': '/chile-icons/bancos/banco_estado.png',
  'Mach': '/chile-icons/medios-pago/mach.png',
  'Scotiabank': '/chile-icons/bancos/scotiabank.png',
  'Itaú': '/chile-icons/bancos/itau.png',
  'Banco Falabella': '/chile-icons/bancos/banco_falabella.png',
  'Banco Paris': '/chile-icons/bancos/paris.png',
};

const ReviewCard = ({
  tx, reviewIdx, pendingCount, reviewVisible, reviewDirection,
  reviewCat, setReviewCat, reviewTipoGasto, setReviewTipoGasto,
  reviewSaving, theme,
  onClose, onPrev, onNext, onConfirm, onConfirmNoEs, onConfirmComplete, onEdit
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [exitDir, setExitDir] = useState(null);
  const sliderRef = useRef(null);

  const txType = tx.tipo_transaccion || 'gasto';
  const isGasto = txType === 'gasto';
  const isIngreso = txType === 'ingreso';
  const isInterno = txType === 'interno';

  const formatCurrency2 = (val) => {
    if (val == null) return '$0';
    return '$' + Math.round(val).toLocaleString('es-CL');
  };

  const formatDate2 = (d) => {
    if (!d) return '-';
    const parts = d.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return d;
  };

  const formatTime2 = (d) => {
    if (!d) return '';
    const t = d.includes('T') ? d.split('T')[1] : d.split(' ')[1];
    if (t) {
      const [h, m] = t.split(':');
      return `${h}:${m}`;
    }
    return '';
  };

  const amountSign = isIngreso && !isInterno ? '+' : '';
  const amountColor = isIngreso && !isInterno
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-slate-800 dark:text-white';

  const animateExit = (dir, callback) => {
    setIsExiting(true);
    setExitDir(dir);
    setTimeout(() => {
      callback();
      setIsExiting(false);
      setExitDir(null);
    }, 480);
  };

  const handleNext = () => {
    if (isExiting) return;
    animateExit('right', onNext);
  };

  const handlePrev = () => {
    if (isExiting) return;
    animateExit('left', onPrev);
  };

  const handleConfirm = async () => {
    if (isExiting) return;
    if (typeof onConfirm !== 'function') return;
    const ok = await onConfirm();
    if (ok === false) return;
    animateExit('right', () => {
      if (typeof onConfirmComplete === 'function') onConfirmComplete();
    });
  };

  const handleNoEs = async () => {
    if (isExiting) return;
    if (typeof onConfirmNoEs !== 'function') return;
    const ok = await onConfirmNoEs();
    if (ok === false) return;
    animateExit('right', () => {
      if (typeof onConfirmComplete === 'function') onConfirmComplete();
    });
  };

  return (
    <div
      className={`w-full max-w-md mx-auto max-h-screen sm:max-h-[90vh] flex flex-col bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter sm:rounded-3xl shadow-2xl overflow-hidden ${
        reviewVisible && !isExiting ? 'opacity-100' : 'opacity-0'
      } ${reviewVisible && !isExiting ? 'translate-y-0' : 'translate-y-6'}`}
      style={{
        transform: isExiting
          ? (exitDir === 'right'
              ? 'translateX(140%) rotate(14deg)'
              : 'translateX(-140%) rotate(-14deg)')
          : (reviewVisible && !isExiting)
          ? 'translateX(0) translateY(0) rotate(0) scale(1)'
          : 'translateX(0) translateY(8px) rotate(0) scale(0.97)',
        opacity: isExiting ? 0 : (reviewVisible && !isExiting ? 1 : 0),
        transition: 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms ease-out',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-slate-200 dark:border-dark-lighter bg-slate-50 dark:bg-dark-lighter">
        <button onClick={onClose} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white transition-all px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-dark-lightest">
          <X size={18} /> <span className="text-xs font-bold">Salir</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 tabular-nums">{reviewIdx + 1} <span className="text-slate-400 dark:text-slate-500">/</span> {pendingCount}</span>
        </div>
      </div>

      <div className="w-full bg-slate-200/60 dark:bg-slate-800/40 h-1 flex-shrink-0">
        <div className={`h-full rounded-full transition-all duration-500 ease-out ${theme.btnPrimary.split(' ')[0]}`} style={{ width: `${((reviewIdx + 1) / pendingCount) * 100}%` }} />
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-scroll no-scrollbar flex flex-col gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="bg-slate-50 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter rounded-2xl p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {BANK_ICONS[tx.banco] && (
              <img src={BANK_ICONS[tx.banco]} alt="" className="w-8 h-8 rounded-full shadow" />
            )}
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{tx.banco || 'Banco'}</span>
          </div>
          <div className={`text-3xl sm:text-4xl font-black tracking-tight ${amountColor}`}>
            {amountSign}{formatCurrency2(tx.monto)}
          </div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <span>{formatDate2(tx.fecha)}</span>
            {formatTime2(tx.fecha_extraccion) && (
              <>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <Clock size={11} className="text-slate-400 dark:text-slate-500" />
                <span className="tabular-nums">{formatTime2(tx.fecha_extraccion)}</span>
              </>
            )}
          </div>
          <div className="text-base font-bold text-slate-800 dark:text-white">
            {tx.comercio || 'Comercio no detectado'}
          </div>
          {tx.tipo_tarjeta && (
            <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              tx.tipo_tarjeta === 'Débito' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
              'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
            }`}>{tx.tipo_tarjeta}</span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Categoria</label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[reviewCat] || CATEGORY_COLORS['Otros']}`}>{reviewCat}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => sliderRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
              className="flex-shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-lightest transition-all"
              title="Anterior categoría"
            >
              <ChevronLeft size={14} />
            </button>
            <div ref={sliderRef} className="flex-1 flex gap-1.5 overflow-x-scroll no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {CATEGORY_LIST.map(cat => {
                const selected = reviewCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setReviewCat(cat)}
                    className={`flex flex-col items-center text-center gap-1 flex-shrink-0 w-[4.5rem] min-h-[4rem] px-1 py-2 rounded-xl transition-all duration-200 border ${
                      selected
                        ? `${CATEGORY_ICON_BG[cat]} border-current shadow-sm scale-105`
                        : 'bg-slate-100 dark:bg-dark-lighter border-slate-200 dark:border-dark-lighter hover:border-slate-300 dark:hover:border-dark-lightest'
                    }`}
                  >
                    <span className="text-xl leading-none">{CATEGORY_EMOJI[cat]}</span>
                    <span className={`text-[8px] font-bold leading-tight text-center ${selected ? CATEGORY_ICON_COLOR[cat] : 'text-slate-500 dark:text-slate-200'}`}>{cat}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => sliderRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
              className="flex-shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-lightest transition-all"
              title="Siguiente categoría"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {isGasto && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-2 block px-1">Frecuencia</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'variable', label: 'Variable', icon: Zap, color: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-500/20', border: 'border-amber-300 dark:border-amber-500/50' },
                { key: 'mensual', label: 'Mensual', icon: CalendarDays, color: 'text-sky-600 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-500/20', border: 'border-sky-300 dark:border-sky-500/50' },
                { key: 'anual', label: 'Anual', icon: CalendarRange, color: 'text-violet-600 dark:text-violet-300', bg: 'bg-violet-100 dark:bg-violet-500/20', border: 'border-violet-300 dark:border-violet-500/50' },
              ].map(tipo => {
                const selected = reviewTipoGasto === tipo.key;
                return (
                  <button
                    key={tipo.key}
                    onClick={() => setReviewTipoGasto(reviewTipoGasto === tipo.key ? null : tipo.key)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                      selected
                        ? `${tipo.bg} ${tipo.color} ${tipo.border} shadow-sm`
                        : 'bg-slate-100 dark:bg-dark-lighter border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-dark-lightest'
                    }`}
                  >
                    <tipo.icon size={13} />
                    {tipo.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isInterno && (
          <div className="bg-slate-50 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter rounded-2xl p-3 text-center">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Detectado como traspaso entre cuentas</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">Se registrará como Interno</p>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-4 py-3 space-y-2 border-t border-slate-200 dark:border-dark-lighter bg-slate-50 dark:bg-dark-lighter">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={reviewIdx === 0}
            className="p-2.5 rounded-xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
            title="Anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleConfirm}
            disabled={reviewSaving}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 ${theme.btnPrimary} text-white rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-50 active:scale-95`}
          >
            {reviewSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {isGasto ? 'Confirmar gasto' : isIngreso ? 'Confirmar ingreso' : 'Confirmar'}
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all active:scale-90"
            title="Siguiente"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        {!isInterno && (
          <button
            onClick={handleNoEs}
            disabled={reviewSaving}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all disabled:opacity-50"
          >
            {isGasto ? 'No es Gasto' : 'No es Ingreso'}
          </button>
        )}
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
        >
          <Edit3 size={12} /> Editar datos
        </button>
      </div>
    </div>
  );
};

const Transacciones = ({ token, theme }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [filterCat, setFilterCat] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [statusMsg, setStatusMsg] = useState(null);
  const [filters, setFilters] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [newFilterRemitente, setNewFilterRemitente] = useState('');
  const [newFilterAsunto, setNewFilterAsunto] = useState('');
  const [bulkRemitentes, setBulkRemitentes] = useState('');
  const [diasAtras, setDiasAtras] = useState(3);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pendientesCount, setPendientesCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [editComercio, setEditComercio] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editTipoTarjeta, setEditTipoTarjeta] = useState('');
  const [editBanco, setEditBanco] = useState('');
  const [editFecha, setEditFecha] = useState('');
  const [editMonto, setEditMonto] = useState('');

  const [showReview, setShowReview] = useState(false);
  const [pendingTxs, setPendingTxs] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewCat, setReviewCat] = useState('Otros');
  const [reviewTipoGasto, setReviewTipoGasto] = useState(null);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewDirection, setReviewDirection] = useState('forward');
  const reviewSliderRef = useRef(null);

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCat) params.set('categoria', filterCat);
      if (filterMonth) params.set('mes', filterMonth);
      params.set('revisado', 'true');
      params.set('limit', '10');
      params.set('offset', String(page * 10));
      const res = await fetch(`/api/transacciones?${params.toString()}`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
        setSummary(data.summary || []);
        setTotalCount(data.total || 0);
        setLastCheck(data.lastCheck);
        if (data.pendientes_count !== undefined) setPendientesCount(data.pendientes_count);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getHeaders, filterCat, filterMonth, page]);

  const fetchFilters = useCallback(async () => {
    try {
      const res = await fetch('/api/filtros', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) setFilters(data.filters || []);
    } catch (e) { console.error(e); }
  }, [getHeaders]);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/config-extraccion', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok && data.dias_atras) {
        setDiasAtras(data.dias_atras);
        setConfigLoaded(true);
      }
    } catch (e) { console.error(e); }
  }, [getHeaders]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/transacciones/status', { headers: getHeaders() });
      const data = await res.json();
      setAuthStatus(data.authenticated);
    } catch (e) {
      setAuthStatus(false);
    }
  }, [getHeaders]);

  const fetchMonths = useCallback(async () => {
    try {
      const res = await fetch('/api/transacciones/meses', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) setAvailableMonths(data.months || []);
    } catch (e) { console.error(e); }
  }, [getHeaders]);

  const fetchPendientesCount = useCallback(async () => {
    try {
      const res = await fetch('/api/transacciones/pendientes?limit=1', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok !== false) setPendientesCount(data.count || 0);
    } catch (e) { console.error(e); }
  }, [getHeaders]);

  const fetchPendientes = useCallback(async () => {
    try {
      const res = await fetch('/api/transacciones/pendientes?limit=100', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok !== false) {
        setPendingTxs(data.transactions || []);
        setPendientesCount(data.count || 0);
        return data.transactions || [];
      }
    } catch (e) { console.error(e); }
    return [];
  }, [getHeaders]);

  useEffect(() => {
    fetchStatus();
    fetchTransactions();
    fetchFilters();
    fetchConfig();
    fetchMonths();
    fetchPendientesCount();
  }, [fetchStatus, fetchTransactions, fetchFilters, fetchConfig, fetchMonths, fetchPendientesCount]);

  useEffect(() => {
    setPage(0);
  }, [filterCat, filterMonth]);

  const months = availableMonths;
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const displayMonths = months.includes(currentMonthStr) ? months : [currentMonthStr, ...months];

  const formatCurrency = (val) => {
    if (val == null) return '$0';
    return '$' + Math.round(val).toLocaleString('es-CL');
  };

  const formatDate = (d) => {
    if (!d) return '-';
    const parts = d.split('T')[0].split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return d;
  };

  const formatTime = (d) => {
    if (!d) return '';
    const t = d.includes('T') ? d.split('T')[1] : d.split(' ')[1];
    if (t) {
      const [h, m] = t.split(':');
      return `${h}:${m}`;
    }
    return '';
  };

  const formatDateTime = (d) => {
    const date = formatDate(d);
    const time = formatTime(d);
    return time ? `${date} · ${time}` : date;
  };

  const handleAuthGmail = async () => {
    try {
      const res = await fetch('/api/transacciones/auth-url', { headers: getHeaders() });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al conectar con Gmail: ' + (data.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error al conectar con Gmail');
    }
  };

  const handleCheckEmails = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/transacciones/revisar', { method: 'POST', headers: getHeaders() });
      const { jobId } = await res.json();
      if (!jobId) {
        setStatusMsg({ type: 'error', text: '✗ Error al iniciar revisión' });
        setChecking(false);
        return;
      }
      const poll = async (attempt = 0) => {
        if (attempt > 150) {
          setChecking(false);
          setStatusMsg({ type: 'error', text: '✗ La revisión está tardando demasiado. Intenta de nuevo.' });
          setTimeout(() => setStatusMsg(null), 5000);
          return;
        }
        const statusRes = await fetch(`/api/transacciones/revisar/status/${jobId}`, { headers: getHeaders() });
        if (!statusRes.ok) {
          setChecking(false);
          const err = await statusRes.json().catch(() => ({ error: 'Error al consultar estado' }));
          setStatusMsg({ type: 'error', text: `✗ ${err.error || 'Error al revisar correos'}` });
          setTimeout(() => setStatusMsg(null), 5000);
          return;
        }
        const job = await statusRes.json();
        if (job.status === 'done') {
          setChecking(false);
          const data = job.result;
          if (data.needsReauth) {
            setStatusMsg({ type: 'error', text: `✗ ${data.message || 'Vuelve a autorizar Gmail'}` });
            fetchStatus();
          } else if (!data.error) {
            const msg = data.new > 0
              ? `✓ ${data.new} nuevas transacciones encontradas`
              : '✓ No hay transacciones nuevas';
            setStatusMsg({ type: 'success', text: msg });
            fetchTransactions();
            fetchMonths();
            fetchPendientesCount();
          } else {
            setStatusMsg({ type: 'error', text: `✗ ${data.error || 'Error al revisar'}` });
          }
          setTimeout(() => setStatusMsg(null), 5000);
        } else if (job.status === 'error') {
          setChecking(false);
          setStatusMsg({ type: 'error', text: `✗ ${job.error || 'Error al revisar correos'}` });
          setTimeout(() => setStatusMsg(null), 5000);
        } else {
          setTimeout(() => poll(attempt + 1), 2000);
        }
      };
      poll();
    } catch (err) {
      setChecking(false);
      setStatusMsg({ type: 'error', text: `✗ ${err.message}` });
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  const handleDeleteTx = async (id) => {
    if (!window.confirm('¿Eliminar esta transacción?')) return;
    try {
      const res = await fetch(`/api/transacciones/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) {
        setTransactions(prev => prev.filter(tx => tx.id !== id));
        fetchTransactions();
        fetchMonths();
      }
    } catch (err) { console.error(err); }
  };

  const handleBulkReplace = async () => {
    const remitentes = bulkRemitentes
      .split(/[\s,;]+/)
      .map(r => r.replace(/^OR\s*/i, '').trim())
      .filter(r => r.includes('@'));
    if (remitentes.length === 0) return;
    try {
      const res = await fetch('/api/filtros/replace', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ remitentes })
      });
      if (res.ok) {
        setBulkRemitentes('');
        fetchFilters();
      }
    } catch (err) { console.error(err); }
  };

  const handleCreateFilter = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/filtros', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ remitente: newFilterRemitente, asunto: newFilterAsunto })
      });
      if (res.ok) {
        setNewFilterRemitente('');
        setNewFilterAsunto('');
        fetchFilters();
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteFilter = async (id) => {
    try {
      const res = await fetch(`/api/filtros/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) fetchFilters();
    } catch (err) { console.error(err); }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/config-extraccion', {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ dias_atras: diasAtras })
      });
      if (!res.ok) console.error('Error guardando config');
    } catch (err) { console.error(err); }
  };

  const handleEditTx = (tx) => {
    setEditingTx(tx);
    setEditComercio(tx.comercio || '');
    setEditCategoria(tx.categoria || 'Otros');
    setEditTipoTarjeta(tx.tipo_tarjeta || '');
    setEditBanco(tx.banco || '');
    setEditFecha(tx.fecha || '');
    setEditMonto(tx.monto != null ? String(tx.monto) : '');
    setShowEditModal(true);
  };

  const handleUpdateTx = async () => {
    if (!editingTx) return;
    try {
      const res = await fetch(`/api/transacciones/${editingTx.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({
          categoria: editCategoria,
          comercio: editComercio,
          tipo_tarjeta: editTipoTarjeta,
          banco: editBanco,
          fecha: editFecha || undefined,
          monto: editMonto ? parseFloat(editMonto) : undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        setShowEditModal(false);
        setEditingTx(null);
        if (showReview) {
          const updated = await fetchPendientes();
          if (updated.length === 0) {
            setReviewVisible(false);
            setTimeout(() => {
              setShowReview(false);
              setPendingTxs([]);
              fetchTransactions();
              fetchMonths();
            }, 200);
          }
        } else {
          fetchTransactions();
        }
      }
    } catch (err) { console.error(err); }
  };

  const handleOpenReview = async () => {
    const txs = await fetchPendientes();
    if (txs.length === 0) {
      setStatusMsg({ type: 'info', text: 'Sin pendientes por revisar' });
      setTimeout(() => setStatusMsg(null), 4000);
      return;
    }
    const first = txs[0];
    setReviewIdx(0);
    setReviewCat(first.categoria || 'Otros');
    setReviewTipoGasto(first.tipo_gasto || null);
    setReviewDirection('forward');
    setReviewVisible(false);
    setShowReview(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setReviewVisible(true));
    });
  };

  const handleCloseReview = () => {
    setReviewVisible(false);
    setTimeout(() => {
      setShowReview(false);
      setPendingTxs([]);
      fetchTransactions();
      fetchMonths();
      fetchPendientesCount();
    }, 250);
  };

  const handleConfirmReview = async () => {
    const tx = pendingTxs[reviewIdx];
    if (!tx) return false;
    setReviewSaving(true);
    const txType = tx.tipo_transaccion || 'gasto';
    const categoria = txType === 'interno' ? 'Interno' : reviewCat;
    try {
      const res = await fetch(`/api/transacciones/${tx.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({
          categoria,
          tipo_gasto: txType === 'gasto' ? reviewTipoGasto : null,
          tipo_transaccion: txType,
          revisado: true
        })
      });
      setReviewSaving(false);
      if (!res.ok) {
        setStatusMsg({ type: 'error', text: '✗ No se pudo guardar la transacción' });
        setTimeout(() => setStatusMsg(null), 4000);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      setReviewSaving(false);
      setStatusMsg({ type: 'error', text: '✗ Error de red al guardar' });
      setTimeout(() => setStatusMsg(null), 4000);
      return false;
    }
  };

  const handleConfirmNoEs = async () => {
    const tx = pendingTxs[reviewIdx];
    if (!tx) return false;
    setReviewSaving(true);
    const txType = tx.tipo_transaccion || 'gasto';
    const newType = txType === 'gasto' ? 'no_es_gasto' : 'no_es_ingreso';
    const newCat = txType === 'gasto' ? 'No es Gasto' : 'No es Ingreso';
    try {
      const res = await fetch(`/api/transacciones/${tx.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({
          categoria: newCat,
          tipo_gasto: null,
          tipo_transaccion: newType,
          revisado: true
        })
      });
      setReviewSaving(false);
      if (!res.ok) {
        setStatusMsg({ type: 'error', text: '✗ No se pudo guardar la transacción' });
        setTimeout(() => setStatusMsg(null), 4000);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      setReviewSaving(false);
      setStatusMsg({ type: 'error', text: '✗ Error de red al guardar' });
      setTimeout(() => setStatusMsg(null), 4000);
      return false;
    }
  };

  const handleConfirmComplete = () => {
    const remaining = pendingTxs.length - 1;
    setPendientesCount(remaining);
    if (reviewIdx >= pendingTxs.length - 1) {
      setReviewVisible(false);
      setTimeout(() => {
        setShowReview(false);
        setPendingTxs([]);
        fetchTransactions();
        fetchMonths();
        fetchPendientesCount();
      }, 200);
    } else {
      const nextIdx = reviewIdx + 1;
      setReviewDirection('forward');
      setReviewIdx(nextIdx);
      const next = pendingTxs[nextIdx];
      setReviewCat(next.categoria || 'Otros');
      setReviewTipoGasto(next.tipo_gasto || null);
    }
  };

  const handleSkipReview = () => {
    if (reviewIdx >= pendingTxs.length - 1) {
      setReviewVisible(false);
      setTimeout(() => {
        setShowReview(false);
        setPendingTxs([]);
        fetchPendientesCount();
      }, 200);
    } else {
      const nextIdx = reviewIdx + 1;
      setReviewDirection('forward');
      setReviewIdx(nextIdx);
      const next = pendingTxs[nextIdx];
      setReviewCat(next.categoria || 'Otros');
      setReviewTipoGasto(next.tipo_gasto || null);
    }
  };

  const handlePrevReview = () => {
    if (reviewIdx <= 0) return;
    const prevIdx = reviewIdx - 1;
    setReviewDirection('back');
    setReviewIdx(prevIdx);
    const prev = pendingTxs[prevIdx];
    setReviewCat(prev.categoria || 'Otros');
    setReviewTipoGasto(prev.tipo_gasto || null);
    setReviewTipoTransaccion(prev.tipo_transaccion || 'gasto');
  };

  const handleEditReviewTx = () => {
    const tx = pendingTxs[reviewIdx];
    if (!tx) return;
    handleEditTx(tx);
  };

  const handleReclasificarTx = (tx) => {
    setPendingTxs([tx]);
    setReviewIdx(0);
    setReviewCat(tx.categoria || 'Otros');
    setReviewTipoGasto(tx.tipo_gasto || null);
    setReviewVisible(false);
    setShowReview(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setReviewVisible(true));
    });
  };

  const currentReviewTx = pendingTxs[reviewIdx] || null;

  if (authStatus === false) {
    return (
      <div className="animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3">
            <Mail className={theme.tabText} size={20} /> Transacciones
          </h2>
        </div>
        <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-lighter p-8 text-center">
          <div className="max-w-md mx-auto">
            <Mail size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Conecta tu Gmail</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Para extraer automáticamente tus gastos desde las notificaciones bancarias, necesitas autorizar el acceso de solo lectura a tu correo Gmail.
            </p>
            <button onClick={handleAuthGmail} className="flex items-center justify-center gap-2 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 transition-all">
              <ExternalLink size={16} /> Autorizar Gmail
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3">
          <Mail className={theme.tabText} size={20} /> Transacciones
        </h2>
        <div className="flex gap-2 items-center flex-wrap">
          {statusMsg && (
            <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
              statusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
              statusMsg.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}>
              {statusMsg.text}
            </span>
          )}
          <button onClick={handleOpenReview} className="flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800 transition-all">
            <Check size={14} />
            Pendientes <span className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-full text-[10px]">{pendientesCount}</span>
          </button>
          <button onClick={() => setShowFilterModal(true)} className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all">
            <Settings2 size={14} /> <span className="hidden sm:inline">Reglas</span>
          </button>
          <button onClick={() => setShowConfigModal(true)} className={`flex items-center justify-center gap-2 ${theme.btnPrimary} text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all`}>
            <Settings2 size={16} /> <span className="hidden sm:inline">Configurar</span><span className="sm:hidden">Conf</span>
          </button>
        </div>
      </div>

      {(summary.length > 0 || transactions.filter(tx => tx.tipo_tarjeta).length > 0) && (() => {
        const bankTotals = {};
        for (const tx of transactions) {
          if (!tx.tipo_tarjeta || tx.tipo_transaccion === 'interno' || tx.tipo_transaccion === 'no_es_gasto' || tx.tipo_transaccion === 'no_es_ingreso') continue;
          const bank = tx.banco || 'Otros';
          if (!bankTotals[bank]) bankTotals[bank] = {};
          const tipo = tx.tipo_tarjeta;
          if (!bankTotals[bank][tipo]) bankTotals[bank][tipo] = { total: 0, count: 0 };
          bankTotals[bank][tipo].total += tx.monto;
          bankTotals[bank][tipo].count += 1;
        }
        return (
          <div key={filterMonth + '-' + filterCat} className="animate-slide-fade grid portrait:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {summary.length > 0 && (
              <div className="bg-white dark:bg-dark-normal rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter p-2.5 sm:p-3">
                <div className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">Categorías</div>
                <div className="space-y-0.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                  {(() => {
                    const maxTotal = Math.max(...summary.map(s => s.total), 1);
                    return summary.map(s => (
                      <div key={s.categoria} className="flex items-center gap-1.5 text-[10px] sm:text-xs leading-tight">
                        <span className={`font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 w-28 sm:w-32 text-left leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${CATEGORY_COLORS[s.categoria] || CATEGORY_COLORS['Otros']}`}>{s.categoria}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-dark-lighter overflow-hidden">
                          <div className={`h-full rounded-full ${CATEGORY_BAR_COLORS[s.categoria] || CATEGORY_BAR_COLORS['Otros']}`} style={{ width: `${(s.total / maxTotal) * 100}%` }} />
                        </div>
                        <span className="font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">{formatCurrency(s.total)}</span>
                      </div>
                    ));
                  })()}
                </div>
                <div className="border-t border-slate-100 dark:border-dark-lighter mt-1 pt-1 flex items-center justify-between text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200">
                  <span>Total</span>
                  <span>{formatCurrency(summary.reduce((acc, s) => acc + s.total, 0))}</span>
                </div>
              </div>
            )}
            {Object.entries(bankTotals).map(([bank, tipos]) => {
              const totalBank = Object.values(tipos).reduce((acc, t) => acc + t.total, 0);
              const totalCount = Object.values(tipos).reduce((acc, t) => acc + t.count, 0);
              return (
                <div key={bank} className={`bg-white dark:bg-dark-normal rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter p-3 sm:p-4 ${BANK_ACCENT[bank] || ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {BANK_ICONS[bank] && <img src={BANK_ICONS[bank]} alt="" className="w-8 h-8 rounded-full" />}
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{bank}</span>
                  </div>
                  <div className="space-y-1">
                    {['Débito', 'Crédito'].map(tipo => (
                      <div key={tipo} className="flex items-center justify-between text-[10px] sm:text-xs">
                        <span className={`font-bold px-1.5 py-0.5 rounded ${
                          tipo === 'Débito' ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>{tipo}</span>
                        {tipos[tipo] ? (
                          <span className="font-bold text-slate-600 dark:text-slate-400">
                            {formatCurrency(tipos[tipo].total)} <span className="text-slate-400 font-normal">{tipos[tipo].count}tx</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">—</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 dark:border-dark-lighter mt-1.5 pt-1.5 flex items-center justify-between text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200">
                    <span>Total</span>
                    <span>{formatCurrency(totalBank)} <span className="text-slate-400 font-normal">{totalCount}tx</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[140px] max-w-[200px]">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="w-full appearance-none bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl pl-8 pr-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer">
            <option value="">Todas las categorías</option>
            {CATEGORY_LIST.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[120px] max-w-[160px]">
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="w-full appearance-none bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer">
            <option value="">Todos los meses</option>
            {displayMonths.map(m => {
              const [y, mo] = m.split('-');
              const date = new Date(parseInt(y), parseInt(mo) - 1);
              const label = date.toLocaleString('es-CL', { month: 'long', year: 'numeric' });
              return <option key={m} value={m}>{label}</option>;
            })}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-lighter overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 size={32} className="animate-spin text-slate-400" /></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <Inbox size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-2">No hay transacciones clasificadas</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Presiona "Configurar" para importar correos bancarios anteriores y luego clasifícalas en Pendientes</p>
          </div>
        ) : (
          <>
            <div key={'tx-page-' + page} className="animate-slide-fade overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-dark-normal border-b border-slate-100 dark:border-dark-lighter">
                    <th className="p-2 sm:p-4 text-left font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest">Fecha</th>
                    <th className="p-2 sm:p-4 text-left font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest">Banco</th>
                    <th className="p-2 sm:p-4 text-left font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest">Comercio</th>
                    <th className="p-2 sm:p-4 text-right font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest">Monto</th>
                    <th className="p-2 sm:p-4 text-center font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest hidden sm:table-cell">Tipo</th>
                    <th className="p-2 sm:p-4 text-center font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest hidden sm:table-cell">Categoría</th>
                    <th className="p-2 sm:p-4 text-center font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest w-16">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, idx) => {
                    const isMuted = tx.tipo_transaccion === 'no_es_gasto' || tx.tipo_transaccion === 'no_es_ingreso' || tx.tipo_transaccion === 'interno';
                    return (
                    <tr key={tx.id} onClick={() => handleReclasificarTx(tx)} className={`border-b border-slate-50 dark:border-dark-lighter/50 transition-colors hover:bg-slate-50/50 dark:hover:bg-dark-lighter/30 cursor-pointer ${idx % 2 === 0 ? 'bg-white dark:bg-dark-normal' : 'bg-slate-50/30 dark:bg-dark-lighter/10'} ${isMuted ? 'italic' : ''}`}>
                      <td className={`p-2 sm:p-4 text-xs sm:text-sm font-bold whitespace-nowrap ${isMuted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>{formatDate(tx.fecha)}</td>
                      <td className="p-2 sm:p-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${isMuted ? 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500' : BANK_COLORS[tx.banco] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {BANK_ICONS[tx.banco] && <img src={BANK_ICONS[tx.banco]} alt="" className={`w-4 h-4 rounded-full ${isMuted ? 'opacity-50' : ''}`} />}
                          {tx.banco || '-'}
                        </span>
                      </td>
                      <td className={`p-2 sm:p-4 text-xs sm:text-sm font-bold ${isMuted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>{tx.comercio || '-'}</td>
                      <td className={`p-2 sm:p-4 text-xs sm:text-sm font-black text-right ${isMuted ? 'text-slate-400 dark:text-slate-500' : tx.tipo_transaccion === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}`}>
  {!isMuted && (tx.tipo_transaccion === 'ingreso' ? '+' : '')}{formatCurrency(tx.monto)}
</td>
                      <td className="p-2 sm:p-4 text-center hidden sm:table-cell">
                        {tx.tipo_tarjeta ? (
                          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${
                            tx.tipo_tarjeta === 'Débito' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                            tx.tipo_tarjeta === 'Crédito' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}>{tx.tipo_tarjeta}</span>
                        ) : <span className="text-[10px] text-slate-300 dark:text-slate-600">—</span>}
                      </td>
                      <td className="p-2 sm:p-4 text-center hidden sm:table-cell">
                        <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[tx.categoria] || CATEGORY_COLORS['Otros']}`}>{tx.categoria}</span>
                      </td>
                      <td className="p-2 sm:p-4 text-center">
                        <button onClick={(e) => { e.stopPropagation(); handleReclasificarTx(tx); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Reclasificar"><Edit3 size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteTx(tx.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Eliminar"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                    );
                    })}
                </tbody>
              </table>
            </div>
            {totalCount > 10 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-dark-lighter">
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                  {page * 10 + 1}–{Math.min((page + 1) * 10, totalCount)} de {totalCount}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter hover:scale-105 active:scale-95 transition-all transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100">Anterior</button>
                  <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * 10 >= totalCount} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter hover:scale-105 active:scale-95 transition-all transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100">Siguiente</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {lastCheck > 0 && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
          Ultima revision: {new Date(lastCheck).toLocaleString('es-CL')}
        </p>
      )}

      {/* Edit Transaction Modal */}
      {showEditModal && editingTx && (
        <div className={`fixed inset-0 ${showReview ? 'bg-slate-950/60' : 'bg-slate-900/60'} backdrop-blur-sm ${showReview ? 'z-[60]' : 'z-50'} flex items-center justify-center p-3 sm:p-4`}>
          <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <Edit3 className={theme.tabText} size={20} /> Editar Transaccion
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-dark-lighter rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-600 dark:text-slate-300">Detalle:</span>{' '}
                {editingTx.asunto || '(sin detalle)'}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Comercio</label>
                <input value={editComercio} onChange={e => setEditComercio(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Monto</label>
                  <input type="number" value={editMonto} onChange={e => setEditMonto(e.target.value)} placeholder="0" className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Fecha</label>
                  <input type="date" value={editFecha} onChange={e => setEditFecha(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Categoria</label>
                <select value={editCategoria} onChange={e => setEditCategoria(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200">
                  {CATEGORY_LIST.map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Tipo de tarjeta</label>
                <select value={editTipoTarjeta} onChange={e => setEditTipoTarjeta(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200">
                  <option value="">—</option>
                  <option value="Debito">Debito</option>
                  <option value="Credito">Credito</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Banco / Medio de pago</label>
                <select value={editBanco} onChange={e => setEditBanco(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200">
                  <option value="">—</option>
                  {Object.keys(BANK_ICONS).map(b => (<option key={b} value={b}>{b}</option>))}
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-all">Cancelar</button>
                <button onClick={handleUpdateTx} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all">
                  <Save size={16} /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Rules Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <Settings2 className={theme.tabText} size={20} /> Reglas de filtrado
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Gmail buscara correos de estos remitentes (sin filtrar por asunto). Se respeta el limite de dias hacia atras.
            </p>
            <div className="mb-4 p-3 sm:p-4 bg-slate-50 dark:bg-dark-lighter rounded-xl">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Dias hacia atras</label>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="999" value={diasAtras} onChange={e => setDiasAtras(parseInt(e.target.value) || 3)} className="flex-1 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
                <button type="button" onClick={handleSaveConfig} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex-shrink-0">Guardar</button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">Cuantos dias hacia atras revisar en Gmail (max. 999)</p>
            </div>
            <div className="mb-4 p-3 sm:p-4 bg-slate-50 dark:bg-dark-lighter rounded-xl">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Carga masiva</label>
              <textarea
                value={bulkRemitentes}
                onChange={e => setBulkRemitentes(e.target.value)}
                placeholder={["reply@info.bice.cl", "biceinforma@bancobice.cl", "serviciodetransferencias@bancochile.cl"].join('\n')}
                rows={4}
                className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-blue-500 transition-all dark:text-slate-200 mb-2"
              />
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-2">
                <span>Pega uno por linea, separados por espacio, coma, punto y coma u <span className="font-mono">OR</span></span>
              </div>
              <button type="button" onClick={handleBulkReplace} className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all">
                <Plus size={14} /> Reemplazar todo
              </button>
            </div>
            <form onSubmit={handleCreateFilter} className="space-y-3 mb-6 p-3 sm:p-4 bg-slate-50 dark:bg-dark-lighter rounded-xl">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Remitente *</label>
                <input required value={newFilterRemitente} onChange={e => setNewFilterRemitente(e.target.value)} placeholder="contacto@bci.cl" className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Asunto (opcional)</label>
                <input value={newFilterAsunto} onChange={e => setNewFilterAsunto(e.target.value)} placeholder="Notificacion de uso de tu tarjeta de debito" className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
              </div>
              <button type="submit" className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all">
                <Plus size={16} /> Agregar regla
              </button>
            </form>
            <div className="space-y-2">
              {filters.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">Sin reglas configuradas. Se usaran los dominios bancarios por defecto.</p>
              ) : (
                filters.map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-slate-50 dark:bg-dark-lighter rounded-xl px-3 py-2.5 border border-slate-100 dark:border-dark-lightest">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{f.remitente}</p>
                      {f.asunto && <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{f.asunto}</p>}
                    </div>
                    <button onClick={() => handleDeleteFilter(f.id)} className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0" title="Eliminar regla"><Trash2 size={14} /></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <Settings2 className={theme.tabText} size={20} /> Configuración
              </h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
            </div>

            <div className="mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <label className="text-[10px] font-black uppercase text-blue-500 dark:text-blue-400 mb-2 block">Reenvío automático</label>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Para procesar transacciones en tiempo real, configura un filtro en Gmail:
              </p>
              <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside mb-3">
                <li>Abre <b>Gmail → Configuración → Filtros y direcciones bloqueadas → Crear filtro</b></li>
                <li>En <b>De</b>: <code className="bg-slate-200 dark:bg-dark-lighter px-1 rounded text-[11px]">{'from:(@bci.cl OR @bancochile.cl OR @santander.cl OR @bancoestado.cl)'}</code></li>
                <li>Click <b>Crear filtro → Reenviar a</b>:</li>
              </ol>
              <div className="bg-white dark:bg-dark-normal rounded-xl p-3 border border-blue-200 dark:border-blue-700 mb-3">
                <code className="text-sm font-bold text-blue-700 dark:text-blue-300 break-all select-all">{`parse+${(() => { try { return JSON.parse(atob(token.split('.')[1])).id; } catch { return 'TU_ID'; } })()}@adaptaweb.cl`}</code>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Cada vez que llegue una notificación bancaria se analizará automáticamente.
              </p>
            </div>

            <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
              <label className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 mb-2 block">Sincronizar historial</label>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Importa correos bancarios anteriores a la primera vez que configuras la app.
              </p>
              <button onClick={handleCheckEmails} disabled={checking} className={`flex items-center justify-center gap-2 w-full ${theme.btnPrimary} text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50`}>
                {checking ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {checking ? 'Revisando correos...' : 'Sincronizar correos anteriores'}
              </button>
              {statusMsg && (
                <span className={`inline-block text-xs px-3 py-1.5 rounded-lg font-medium mt-3 ${
                  statusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                  statusMsg.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                }`}>
                  {statusMsg.text}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

        </div>

      {/* Review Panel - Full Screen */}
      {showReview && currentReviewTx && (
        <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 transition-opacity duration-300" style={{ opacity: reviewVisible ? 1 : 0 }}>
          <ReviewCard
            key={`panel-${reviewIdx}-${reviewDirection}`}
            tx={currentReviewTx}
            reviewIdx={reviewIdx}
            pendingCount={pendingTxs.length}
            reviewVisible={reviewVisible}
            reviewDirection={reviewDirection}
            reviewCat={reviewCat}
            setReviewCat={setReviewCat}
            reviewTipoGasto={reviewTipoGasto}
            setReviewTipoGasto={setReviewTipoGasto}
            reviewSaving={reviewSaving}
            theme={theme}
            onClose={handleCloseReview}
            onPrev={handlePrevReview}
            onNext={handleSkipReview}
            onConfirm={handleConfirmReview}
            onConfirmNoEs={handleConfirmNoEs}
            onConfirmComplete={handleConfirmComplete}
            onEdit={handleEditReviewTx}
          />
        </div>
      )}
    </>
  );
};

export default Transacciones;
