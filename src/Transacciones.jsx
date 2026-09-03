import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail, RefreshCw, Trash2, ExternalLink, Loader2, Inbox, Filter,
  Plus, X, Edit3, Check, ChevronLeft, ChevronRight,
  Utensils, Bus, Wrench, Clapperboard, HeartPulse, Home, ShoppingBag,
  MoreHorizontal, ArrowRight, Zap, CalendarDays, CalendarRange, Ban,
  Banknote, TrendingUp, Wallet, Clock, Save, ShoppingCart, ArrowLeftRight,
  Bell, ArrowUpDown, ArrowUp, ArrowDown,
  GraduationCap, Smartphone, Plane, Gift, PiggyBank, Landmark, Percent, CreditCard, Minus, Gamepad2
} from 'lucide-react';
import ManualTransactionPanel from './ManualTransactionPanel.jsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.jsx';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from 'boneyard-js/react';
import { MONTH_NAMES } from './constants/dashboard.js';
import { notifyOk, notifyError, notifyInfo, notifyPromise, toast } from './lib/notify.js';
import { useFilaHorizontal, refFilaHorizontal } from './hooks/useFilaHorizontal.js';

import {
  CATEGORY_LIST as CATEGORY_LIST_DEFAULT,
  CATEGORY_COLORS as CATEGORY_COLORS_DEFAULT,
  CATEGORY_BAR_COLORS as CATEGORY_BAR_COLORS_DEFAULT,
  CATEGORY_ICON_BG as CATEGORY_ICON_BG_DEFAULT,
  CATEGORY_ICON_COLOR as CATEGORY_ICON_COLOR_DEFAULT,
  CATEGORY_EMOJI as CATEGORY_EMOJI_DEFAULT,
  CATEGORY_HEX as CATEGORY_HEX_DEFAULT, hexToRgba,
  CATEGORY_RING_COLOR,
  BANK_COLORS, BANK_ACCENT, BANK_ICONS
} from './constants.js';

// Tailwind (JIT) solo genera una clase si aparece como texto literal en
// el codigo fuente: theme.borderAccent.replace('border-','text-') nunca
// produce ese literal, asi que el color quedaria sin generar. Mapa fijo
// en vez de string-replace para que el escaneo lo encuentre.
const THEME_ACCENT_TEXT = {
  'border-kk-primary': 'text-kk-primary',
  'border-indigo-600': 'text-indigo-600',
  'border-blue-600': 'text-blue-600',
  'border-emerald-600': 'text-emerald-600',
  'border-purple-600': 'text-purple-600',
  'border-rose-600': 'text-rose-600',
  'border-amber-600': 'text-amber-600',
  'border-teal-600': 'text-teal-600',
  'border-slate-600': 'text-slate-600',
};

// Degradado de marca por banco para las tarjetas de "gasto por tarjeta".
// Sin logros oficiales: solo un tono reconocible por banco, con fallback
// gris para medios de pago sin color definido.
const BANK_GRADIENT = {
  'BCI': ['#7F1D1D', '#B91C1C', '#DC2626'],
  'Santander': ['#7F1D1D', '#B91C1C', '#DC2626'],
  'Banco de Chile': ['#1E3A8A', '#1E40AF', '#2563EB'],
  'Banco Estado': ['#0C4A6E', '#075985', '#0284C7'],
  'Mach': ['#4C1D95', '#6D28D9', '#7C3AED'],
  'Scotiabank': ['#7F1D1D', '#991B1B', '#B91C1C'],
  'Itaú': ['#7C2D12', '#C2410C', '#EA580C'],
  'Banco Falabella': ['#134E4A', '#0F766E', '#0D9488'],
  'Banco Paris': ['#312E81', '#3730A3', '#4338CA'],
};
const BANK_GRADIENT_FALLBACK = ['#1E293B', '#334155', '#475569'];

const ReviewCard = ({
  tx, reviewIdx, pendingCount, reviewVisible, reviewDirection,
  reviewCat, setReviewCat, reviewTipoGasto, setReviewTipoGasto,
  reviewTipoTransaccion, setReviewTipoTransaccion,
  reviewSaving, theme, isDarkMode,
  onClose, onPrev, onNext, onConfirm, onConfirmNoEs, onConfirmComplete, onEdit,
  CATEGORY_LIST, CATEGORY_EMOJI, CATEGORY_ICON_BG, CATEGORY_ICON_COLOR, CATEGORY_COLORS,
  onCreateCategoria, categorias,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [exitDir, setExitDir] = useState(null);
  // Se coloca sobre la categoria ya elegida al abrir cada transaccion. Depende
  // de `tx.id` y no de la categoria: recentrar en cada clic movería la fila
  // bajo el dedo justo despues de elegir.
  const filaCategorias = useFilaHorizontal(tx.id);

  const detectedType = tx.tipo_transaccion || 'gasto';
  const sortedCats = categorias && categorias.length > 0
    ? (() => {
        const primary = detectedType === 'ingreso' ? ['ingreso', 'ambos'] : ['gasto', 'ambos'];
        const secondary = detectedType === 'ingreso' ? ['gasto'] : ['ingreso'];
        return [
          ...categorias.filter(c => primary.includes(c.tipo)),
          ...categorias.filter(c => secondary.includes(c.tipo)),
        ].map(c => c.nombre);
      })()
    : CATEGORY_LIST;

  const effectiveType = reviewTipoTransaccion || detectedType;
  const isGasto = effectiveType === 'gasto';
  const isIngreso = effectiveType === 'ingreso';
  const isInterno = effectiveType === 'interno';
  const detectedAsInterno = detectedType === 'interno';

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
    const label = isGasto ? 'No es Gasto' : 'No es Ingreso';
    if (!window.confirm(`¿Registrar esta transacción como "${label}"? No se contabilizará en tus ${isGasto ? 'gastos' : 'ingresos'}.`)) return;
    const ok = await onConfirmNoEs();
    if (ok === false) return;
    animateExit('right', () => {
      if (typeof onConfirmComplete === 'function') onConfirmComplete();
    });
  };

  const accentText = THEME_ACCENT_TEXT[theme.borderAccent] || 'text-kk-primary';
  const ringCircumference = 97.389;
  const ringOffset = ringCircumference * (1 - (reviewIdx + 1) / pendingCount);
  const cardVisible = reviewVisible && !isExiting;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div aria-hidden="true" className={`absolute left-2.5 right-2.5 -top-4 bottom-0 rounded-3xl bg-slate-100 dark:bg-dark-lightest/40 border border-slate-300/40 dark:border-white/5 transition-opacity duration-300 ${cardVisible ? 'opacity-100' : 'opacity-0'}`} />
      <div aria-hidden="true" className={`absolute left-1.5 right-1.5 -top-2 bottom-0 rounded-3xl bg-slate-200/80 dark:bg-dark-lighter border border-slate-300/50 dark:border-white/5 transition-opacity duration-300 ${cardVisible ? 'opacity-100' : 'opacity-0'}`} />

      <button
        onClick={handlePrev}
        disabled={reviewIdx === 0}
        aria-label="Transacción anterior"
        className="absolute z-10 top-1/2 -translate-y-1/2 -left-2 w-7 h-14 rounded-r-2xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 disabled:opacity-0 transition active:scale-90"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={handleNext}
        aria-label="Siguiente transacción"
        className="absolute z-10 top-1/2 -translate-y-1/2 -right-2 w-7 h-14 rounded-l-2xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 transition active:scale-90"
      >
        <ChevronRight size={16} />
      </button>

      <div
        className={`relative w-full max-h-screen sm:max-h-[90vh] flex flex-col bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-3xl shadow-2xl overflow-hidden ${
          cardVisible ? 'opacity-100' : 'opacity-0'
        } ${cardVisible ? 'translate-y-0' : 'translate-y-6'}`}
        style={{
          transform: isExiting
            ? (exitDir === 'right'
                ? 'translateX(140%) rotate(14deg)'
                : 'translateX(-140%) rotate(-14deg)')
            : cardVisible
            ? 'translateX(0) translateY(0) rotate(0) scale(1)'
            : 'translateX(0) translateY(8px) rotate(0) scale(0.97)',
          opacity: isExiting ? 0 : (cardVisible ? 1 : 0),
          transition: 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms ease-out',
        }}
      >
        <div className={`absolute top-0 left-0 right-0 h-56 pointer-events-none opacity-[0.09] dark:opacity-[0.18] ${accentText}`} style={{ background: 'linear-gradient(160deg, currentColor 0%, transparent 65%)' }} />

        <div className="relative flex items-center justify-between px-4 pt-4 flex-shrink-0">
          <button onClick={onClose} aria-label="Salir" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition active:scale-90">
            <X size={16} />
          </button>
          <div className={`relative w-10 h-10 flex-shrink-0 ${accentText}`}>
            <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-slate-200 dark:stroke-white/10" />
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" strokeLinecap="round" stroke="currentColor" strokeDasharray={ringCircumference} strokeDashoffset={ringOffset} className="transition-all duration-500" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700 dark:text-white tabular-nums">{reviewIdx + 1}/{pendingCount}</div>
          </div>
        </div>

        <div className="flex-1 px-5 py-4 overflow-y-scroll no-scrollbar flex flex-col justify-center gap-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="relative flex flex-col items-center text-center gap-1.5 pt-1">
            <div className={`absolute -top-3 w-52 h-52 rounded-full blur-2xl opacity-[0.15] dark:opacity-25 pointer-events-none ${accentText}`} style={{ background: 'radial-gradient(circle, currentColor 0%, transparent 70%)' }} />
            <div className="relative flex items-center gap-1.5">
              {BANK_ICONS[tx.banco] && (
                <img src={BANK_ICONS[tx.banco]} alt="" className={`w-7 h-7 rounded-full shadow ${isDarkMode && tx.banco === 'Banco de Chile' ? 'brightness-0 invert' : ''}`} />
              )}
              <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{tx.banco || 'Banco'}</span>
            </div>
            <div className={`relative text-4xl sm:text-5xl font-black tracking-tight ${amountColor}`}>
              {amountSign}{formatCurrency2(tx.monto)}
            </div>
            <div className="relative text-xl font-extrabold text-slate-800 dark:text-white">
              {tx.comercio || 'Comercio no detectado'}
            </div>
            <div className="relative text-xl font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <span>{formatDate2(tx.fecha)}</span>
              {formatTime2(tx.fecha_extraccion) && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <Clock size={15} className="text-slate-400 dark:text-slate-500" />
                  <span className="tabular-nums">{formatTime2(tx.fecha_extraccion)}</span>
                </>
              )}
            </div>
            {(() => {
              const label = tx.tipo_movimiento || tx.tipo_tarjeta || '';
              if (!label) return null;
              const colorMap = {
                Compra: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                Transferencia: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                Retiro: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
                Cargo: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                Débito: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                Crédito: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
              };
              return (
                <span className={`relative mt-0.5 inline-block text-xs font-bold px-2.5 py-0.5 rounded-full ${colorMap[label] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{label}</span>
              );
            })()}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-0.5">
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Categoría</label>
              <span className={`text-xs font-black ${accentText}`}>{reviewCat}</span>
            </div>
            <div ref={filaCategorias} className="flex gap-3.5 overflow-x-auto no-scrollbar px-0.5 pt-2 pb-2.5" style={{ scrollbarWidth: 'none' }}>
              {sortedCats.map(cat => {
                const selected = reviewCat === cat;
                const iconBg = CATEGORY_ICON_BG[cat];
                const iconCol = CATEGORY_ICON_COLOR[cat];
                const isStyle = iconBg?.backgroundColor !== undefined;
                const ringClass = !isStyle ? (CATEGORY_RING_COLOR[cat] || 'ring-slate-400 dark:ring-slate-300/60') : '';
                return (
                  <button key={cat} onClick={() => setReviewCat(cat)} data-seleccionado={selected ? 'true' : undefined} className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <span
                      style={selected && isStyle ? { backgroundColor: iconBg.backgroundColor, color: iconCol.color, boxShadow: `0 8px 16px ${hexToRgba(iconBg.backgroundColor, 0.4)}`, outline: `2px solid ${hexToRgba(iconBg.backgroundColor, 0.35)}`, outlineOffset: '2px' } : {}}
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl leading-none transition duration-200 ${
                        selected
                          ? (isStyle ? 'scale-110' : `${iconBg} ${iconCol} scale-110 shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-normal ${ringClass}`)
                          : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {CATEGORY_EMOJI[cat]}
                    </span>
                    <span className={`text-[10px] leading-tight text-center whitespace-nowrap transition ${selected ? `font-black ${accentText}` : 'font-bold text-slate-400 dark:text-slate-500'}`}>
                      {cat}
                    </span>
                  </button>
                );
              })}
              {onCreateCategoria && (
                <button
                  onClick={() => {
                    const name = prompt('Nombre de la nueva categoría:');
                    if (name) onCreateCategoria({ nombre: name, tipo: 'gasto' }).then(c => setReviewCat(c.nombre)).catch(e => console.error(e));
                  }}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5"
                  title="Agregar categoría"
                >
                  <span className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 dark:text-slate-500 text-lg">+</span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Nueva</span>
                </button>
              )}
            </div>
          </div>

          {isGasto && (
            <div className="animate-fade-in slide-in-from-top-1 duration-200 flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 px-0.5">Frecuencia</label>
              <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1 gap-1">
                {[
                  { key: 'variable', label: 'Variable', icon: Zap, color: 'text-amber-600 dark:text-amber-300' },
                  { key: 'mensual', label: 'Mensual', icon: CalendarDays, color: 'text-sky-600 dark:text-sky-300' },
                  { key: 'anual', label: 'Anual', icon: CalendarRange, color: 'text-violet-600 dark:text-violet-300' },
                ].map(tipo => {
                  const selected = reviewTipoGasto === tipo.key;
                  return (
                    <button
                      key={tipo.key}
                      onClick={() => setReviewTipoGasto(reviewTipoGasto === tipo.key ? null : tipo.key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                        selected ? `bg-white dark:bg-dark-lighter shadow-sm ${tipo.color}` : 'text-slate-400 dark:text-slate-500'
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

          {detectedAsInterno && !reviewTipoTransaccion && (
            <div className="space-y-2">
              <div className="bg-slate-50 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter rounded-2xl p-3 text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Detectado como traspaso entre cuentas</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Selecciona el tipo real de esta transacción</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'gasto', label: 'Es un Gasto', icon: ShoppingCart, color: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-500/20', border: 'border-amber-300 dark:border-amber-500/50' },
                  { key: 'ingreso', label: 'Es un Ingreso', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20', border: 'border-emerald-300 dark:border-emerald-500/50' },
                  { key: 'interno', label: 'Es Interno', icon: ArrowLeftRight, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-dark-lighter', border: 'border-slate-300 dark:border-dark-lightest' },
                ].map(tipo => (
                  <button
                    key={tipo.key}
                    onClick={() => setReviewTipoTransaccion(tipo.key === 'interno' ? null : tipo.key)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-bold transition border ${
                      tipo.bg} ${tipo.color} ${tipo.border} hover:shadow-sm active:scale-95`}
                  >
                    <tipo.icon size={16} />
                    {tipo.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-shrink-0 flex items-center justify-center gap-6 px-5 pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))] border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-dark-normal/70 backdrop-blur-xl">
          {!isInterno && (
            <button
              onClick={handleNoEs}
              disabled={reviewSaving}
              title={isGasto ? 'No es Gasto' : 'No es Ingreso'}
              className="flex-shrink-0 w-14 h-14 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-400 flex items-center justify-center transition active:scale-90 disabled:opacity-40"
            >
              <X size={20} />
            </button>
          )}
          <button onClick={onEdit} className="flex flex-col items-center gap-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition">
            <Edit3 size={15} />
            <span className="text-[10px] font-bold">Editar</span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={reviewSaving}
            title={isGasto ? 'Confirmar gasto' : isIngreso ? 'Confirmar ingreso' : 'Confirmar'}
            className={`flex-shrink-0 w-[68px] h-[68px] rounded-full ${theme.btnPrimary} text-white flex items-center justify-center shadow-lg ${theme.shadowBtn} transition active:scale-90 disabled:opacity-50`}
          >
            {reviewSaving ? <Loader2 size={26} className="animate-spin" /> : <Check size={26} />}
          </button>
        </div>
      </div>
    </div>
  );
};


const MOVIMIENTO_COLORS = {
  Compra: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  Transferencia: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Retiro: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Cargo: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Débito': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Crédito': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const SORT_OPTIONS = [
  { key: 'fecha', label: 'Fecha' },
  { key: 'monto', label: 'Monto' },
  { key: 'comercio', label: 'Comercio' },
  { key: 'banco', label: 'Banco' },
  { key: 'categoria', label: 'Categoria' },
];

// Todo el color de la card sale del hex de la categoria: asi una categoria
// creada por el usuario pinta igual que una por defecto.
// El tinte se apaga hacia la derecha para no competir con el monto.
const catCardGradient = (hex, isDark) => {
  const a = isDark ? [0.20, 0.08, 0] : [0.16, 0.055, 0];
  return `linear-gradient(100deg, ${hexToRgba(hex, a[0])} 0%, ${hexToRgba(hex, a[1])} 42%, ${hexToRgba(hex, a[2])} 78%)`;
};

const catAccentGradient = (hex) =>
  `linear-gradient(180deg, ${hexToRgba(hex, 1)} 0%, ${hexToRgba(hex, 0.45)} 100%)`;

const catIconGradient = (hex, isDark) => {
  const a = isDark ? [0.38, 0.16] : [0.26, 0.1];
  return `linear-gradient(135deg, ${hexToRgba(hex, a[0])} 0%, ${hexToRgba(hex, a[1])} 100%)`;
};

const catChipGradient = (hex, isDark) =>
  `linear-gradient(135deg, ${hexToRgba(hex, isDark ? 0.34 : 0.24)} 0%, ${hexToRgba(hex, isDark ? 0.14 : 0.08)} 100%)`;

// La tabla ordenaba al hacer clic en el <th>. Sin tabla ese affordance
// desaparece, asi que el orden pasa a chips explicitos.
const SortChips = ({ sortConfig, onSort }) => (
  <div ref={refFilaHorizontal} className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-0.5" style={{ scrollbarWidth: 'none' }}>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex-shrink-0 pr-0.5">Ordenar</span>
    {SORT_OPTIONS.map(opt => {
      const isActive = sortConfig.key === opt.key;
      const isAsc = sortConfig.dir === 'asc';
      return (
        <button
          key={opt.key}
          onClick={() => onSort(opt.key)}
          className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border transition ${
            isActive
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
              : 'bg-white dark:bg-dark-normal text-slate-500 dark:text-slate-400 border-slate-200 dark:border-dark-lighter hover:bg-slate-50 dark:hover:bg-dark-lighter'
          }`}
          title={isActive ? (isAsc ? 'Ascendente' : 'Descendente') : `Ordenar por ${opt.label}`}
        >
          {opt.label}
          {isActive
            ? (isAsc ? <ArrowUp size={11} /> : <ArrowDown size={11} />)
            : <ArrowUpDown size={11} className="opacity-30" />}
        </button>
      );
    })}
  </div>
);

// Espeja <TransactionCard>: misma caja (pl-4 pr-2, py-2.5, rounded-[18px]),
// misma barra lateral de 3px y las dos lineas de texto. La version anterior
// seguia dibujando los chips de categoria que la tarjeta ya no tiene.
// El tipo de tarjeta llega como texto libre: los parsers y el ingreso manual
// escriben 'Débito'/'Crédito', pero el modal de edicion guardaba las variantes
// sin tilde. La migracion 0017 arregla lo ya guardado; esto evita que una fila
// vieja o un banco nuevo vuelvan a partir la tarjeta en dos lineas iguales.
const normalizeTipoTarjeta = (raw) => {
  const plain = (raw || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
  if (plain.includes('credito')) return 'Crédito';
  if (plain.includes('debito')) return 'Débito';
  return raw || 'Otro';
};

const TransactionCardSkeleton = () => (
  <div className="relative flex items-center gap-3 pl-4 pr-2 sm:pr-3 py-2.5 sm:py-3 rounded-[18px] bg-slate-50/80 dark:bg-white/[0.03] overflow-hidden">
    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-slate-200 dark:bg-white/10" />
    <span className="skeleton inline-block rounded-full flex-shrink-0 w-10 h-10 sm:w-[42px] sm:h-[42px]" />
    <div className="min-w-0 flex-1 space-y-1.5">
      <span className="skeleton block" style={{ width: '46%', height: '15px' }} />
      <span className="skeleton block" style={{ width: '62%', height: '11px' }} />
    </div>
    <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
      <span className="skeleton inline-block" style={{ width: '76px', height: '15px' }} />
      <span className="skeleton inline-block" style={{ width: '54px', height: '11px' }} />
    </div>
  </div>
);

// Fallback de los widgets del mes mientras boneyard no tenga bones capturadas
// (registro vacio, primera carga en un dispositivo nuevo). Sigue la estructura
// actual: tarjeta de total + lista de categorias + carrusel de tarjetas.
const TxWidgetsSkeleton = () => (
  <div className="space-y-5">
    <div className="flex flex-col gap-2.5 p-4 rounded-3xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter shadow-fluid">
      <div className="flex items-baseline justify-between">
        <div className="space-y-1.5">
          <span className="skeleton block" style={{ width: '108px', height: '10px' }} />
          <span className="skeleton block" style={{ width: '156px', height: '28px' }} />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="skeleton block" style={{ width: '72px', height: '10px' }} />
          <span className="skeleton block" style={{ width: '92px', height: '14px' }} />
          <span className="skeleton block" style={{ width: '78px', height: '10.5px' }} />
        </div>
      </div>
      <div className="h-2 skeleton rounded-full" />
    </div>

    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-0.5">
        <span className="skeleton inline-block" style={{ width: '150px', height: '10px' }} />
        <span className="skeleton inline-block" style={{ width: '70px', height: '10px' }} />
      </div>
      <div className="rounded-3xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter shadow-fluid p-4 space-y-3.5">
        {[[62, '30%'], [48, '24%'], [35, '34%'], [24, '27%']].map(([w, labelW], i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span className="skeleton rounded-full flex-shrink-0 w-7 h-7" />
              <span className="skeleton flex-1" style={{ maxWidth: labelW, height: '13px' }} />
              <span className="skeleton flex-shrink-0 ml-auto" style={{ width: '78px', height: '13px' }} />
            </div>
            <div className="h-[9px] rounded-full bg-slate-100 dark:bg-dark-lighter overflow-hidden ml-[38px]">
              <div className="h-full skeleton rounded-full" style={{ width: `${w}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-0.5">
        <span className="skeleton inline-block" style={{ width: '110px', height: '10px' }} />
        <span className="skeleton inline-block" style={{ width: '58px', height: '10px' }} />
      </div>
      <div className="flex gap-3 overflow-hidden pb-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-shrink-0 w-[210px] aspect-[1.586] rounded-2xl p-3.5 flex flex-col gap-2 bg-slate-100 dark:bg-dark-lighter">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="skeleton rounded-full w-5 h-5" />
                <span className="skeleton inline-block" style={{ width: '68px', height: '11px' }} />
              </span>
              <span className="skeleton w-5" style={{ height: '14px', borderRadius: '3px' }} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="skeleton inline-block" style={{ width: '44px', height: '9.5px' }} />
                <span className="skeleton inline-block" style={{ width: '62px', height: '13px' }} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="skeleton inline-block" style={{ width: '40px', height: '9.5px' }} />
                <span className="skeleton inline-block" style={{ width: '56px', height: '13px' }} />
              </div>
            </div>
            <span className="skeleton inline-block mt-auto" style={{ width: '80px', height: '9.5px' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TransactionCard = ({
  tx, idx, hex, emoji, badge, isDarkMode,
  formatCurrency, formatDate, formatTime, onEdit, onDelete, onOpenDetail,
}) => {
  const isMuted = tx.tipo_transaccion === 'no_es_gasto'
    || tx.tipo_transaccion === 'no_es_ingreso'
    || tx.tipo_transaccion === 'interno';
  const isIngreso = tx.tipo_transaccion === 'ingreso';
  const movimiento = tx.tipo_movimiento || tx.tipo_tarjeta || '';
  const mutedChip = 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500';

  const metaParts = [tx.categoria, tx.banco, movimiento].filter(Boolean);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(tx)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenDetail(tx); } }}
      aria-label={`Ver detalle de ${tx.comercio || 'transacción'}`}
      className={`group relative flex items-center gap-3 pl-4 sm:pl-4 pr-2 sm:pr-3 py-2.5 sm:py-3 rounded-[18px] overflow-hidden cursor-pointer transition-all duration-300 ease-fluid hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/60 dark:hover:shadow-black/30 active:scale-[0.99] animate-row-enter ${
        isMuted ? 'bg-slate-50 dark:bg-white/[0.02]' : 'bg-slate-50/80 dark:bg-white/[0.03]'
      }`}
      style={{
        animationDelay: `${Math.min(idx || 0, 8) * 35}ms`,
        ...(isMuted ? {} : { backgroundColor: hexToRgba(hex, isDarkMode ? 0.08 : 0.06) }),
      }}
    >
      <span
        className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${isMuted ? 'bg-slate-200 dark:bg-white/10' : ''}`}
        style={isMuted ? undefined : { background: `linear-gradient(180deg, ${hex}, ${hexToRgba(hex, 0.35)})` }}
      />

      <div
        className={`w-10 h-10 sm:w-[42px] sm:h-[42px] rounded-full flex-shrink-0 grid place-items-center ${
          isMuted ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500' : ''
        }`}
        style={isMuted ? undefined : { backgroundColor: hexToRgba(hex, isDarkMode ? 0.2 : 0.16), color: hex }}
      >
        <span className="text-lg leading-none">{emoji}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-[15px] sm:text-base font-black leading-tight ${
          isMuted ? 'italic text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'
        }`}>
          {tx.comercio || 'Sin comercio'}
        </p>
        <p className={`mt-0.5 truncate text-[11px] font-bold ${isMuted ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
          {metaParts.join(' · ')}
        </p>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className={`text-[15px] sm:text-base font-black tabular-nums leading-tight ${
          isMuted
            ? 'text-slate-400 dark:text-slate-500'
            : isIngreso
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-slate-800 dark:text-white'
        }`}>
          {!isMuted && isIngreso ? '+' : ''}{formatCurrency(tx.monto)}
        </div>
        <div className="mt-0.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 tabular-nums whitespace-nowrap">
          {formatDate(tx.fecha)}
        </div>
      </div>

      {/* En desktop las acciones aparecen al hover; en tactil no hay hover,
          asi que ahi quedan siempre visibles. */}
      <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(tx); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          title="Reclasificar"
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(tx.id); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          title="Eliminar"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

const TIPO_TRANSACCION_LABEL = {
  ingreso: 'Ingreso',
  interno: 'Movimiento interno',
  no_es_gasto: 'No es gasto',
  no_es_ingreso: 'No es ingreso',
};

// Reusa el gradiente/color de la card (mismo hex de categoria) para que el
// modal se sienta como una continuacion de la card, no como una ventana
// aparte. Cierra con la misma curva con la que abre: se mantiene montado
// (guardando la ultima tx) hasta que termina la transicion de salida.
const TransactionDetailModal = ({
  tx, hex, emoji, badge, isDarkMode,
  formatCurrency, onClose, onEdit, onDelete,
}) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [renderData, setRenderData] = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    if (tx) {
      clearTimeout(closeTimer.current);
      setRenderData({ tx, hex, emoji, badge });
      setMounted(true);
      const t = setTimeout(() => setOpen(true), 20);
      return () => clearTimeout(t);
    }
    setOpen(false);
    closeTimer.current = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(closeTimer.current);
  }, [tx, hex, emoji, badge]);

  if (!mounted || !renderData) return null;

  const { tx: t, hex: h, emoji: e, badge: b } = renderData;
  const isMuted = t.tipo_transaccion === 'no_es_gasto'
    || t.tipo_transaccion === 'no_es_ingreso'
    || t.tipo_transaccion === 'interno';
  const isIngreso = t.tipo_transaccion === 'ingreso';
  const movimiento = t.tipo_movimiento || t.tipo_tarjeta || '';
  const mutedChip = 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500';
  const tipoLabel = TIPO_TRANSACCION_LABEL[t.tipo_transaccion] || 'Gasto';
  const fechaLarga = t.fecha
    ? new Date(`${t.fecha.split('T')[0]}T00:00:00`).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const procesadoEl = t.fecha_extraccion
    ? new Date(t.fecha_extraccion).toLocaleString('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null;

  const ease = 'cubic-bezier(0.23,1,0.32,1)';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        style={{ transition: `opacity 220ms ${ease}`, opacity: open ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className={`relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar rounded-t-3xl sm:rounded-[28px] border shadow-2xl ${
          isMuted
            ? 'bg-slate-50 dark:bg-dark-normal border-slate-100 dark:border-dark-lighter'
            : 'bg-white dark:bg-dark-normal'
        }`}
        style={{
          ...(isMuted ? {} : { borderColor: hexToRgba(h, isDarkMode ? 0.28 : 0.2) }),
          transition: `opacity ${open ? 260 : 200}ms ${ease}, transform ${open ? 260 : 200}ms ${ease}`,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
        }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div
          className="px-5 sm:px-6 pt-6 pb-5"
          style={isMuted ? undefined : { backgroundImage: catCardGradient(h, isDarkMode) }}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex-shrink-0 grid place-items-center text-2xl leading-none ${
                isMuted ? 'bg-slate-100 dark:bg-dark-lightest grayscale opacity-60' : ''
              }`}
              style={isMuted ? undefined : {
                backgroundImage: catIconGradient(h, isDarkMode),
                border: `1px solid ${hexToRgba(h, isDarkMode ? 0.32 : 0.24)}`,
              }}
            >
              {e}
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="p-2 -mt-1 -mr-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <h3 className={`mt-4 text-xl font-black leading-tight ${
            isMuted ? 'italic text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'
          }`}>
            {t.comercio || 'Sin comercio'}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isMuted ? mutedChip : BANK_COLORS[t.banco] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {BANK_ICONS[t.banco] && (
                <img
                  src={BANK_ICONS[t.banco]}
                  alt=""
                  className={`w-3.5 h-3.5 rounded-full ${isMuted ? 'opacity-50' : ''} ${isDarkMode && t.banco === 'Banco de Chile' ? 'brightness-0 invert' : ''}`}
                />
              )}
              {t.banco || '-'}
            </span>
            {movimiento && (
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isMuted ? mutedChip : MOVIMIENTO_COLORS[movimiento] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}>{movimiento}</span>
            )}
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isMuted ? mutedChip : b.className || ''}`}
              style={isMuted ? undefined : { ...(b.style || {}), backgroundImage: catChipGradient(h, isDarkMode) }}
            >
              {t.categoria}
            </span>
          </div>
        </div>

        <div className="px-5 sm:px-6 py-5 space-y-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{tipoLabel}</span>
            <span className={`text-3xl font-black tabular-nums leading-none ${
              isMuted
                ? 'text-slate-400 dark:text-slate-500'
                : isIngreso
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-800 dark:text-white'
            }`}>
              {!isMuted && isIngreso ? '+' : ''}{formatCurrency(t.monto)}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-3">
            {fechaLarga && (
              <div className="flex items-center justify-between gap-3 text-sm">
                <dt className="text-slate-400 dark:text-slate-500 font-bold">Fecha</dt>
                <dd className="text-slate-700 dark:text-slate-200 font-bold capitalize text-right">{fechaLarga}</dd>
              </div>
            )}
            {procesadoEl && (
              <div className="flex items-center justify-between gap-3 text-sm">
                <dt className="text-slate-400 dark:text-slate-500 font-bold">Procesado</dt>
                <dd className="text-slate-500 dark:text-slate-400 font-medium text-right">{procesadoEl}</dd>
              </div>
            )}
          </dl>

          {t.asunto && (
            <div className="rounded-xl bg-slate-50 dark:bg-dark-lighter/40 border border-slate-100 dark:border-dark-lighter px-3.5 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Asunto del correo</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">{t.asunto}</p>
            </div>
          )}
        </div>

        <div className="px-5 sm:px-6 pb-6 pt-1 flex gap-2.5">
          <button
            onClick={() => { onClose(); onEdit(t); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <Edit3 size={15} /> Reclasificar
          </button>
          <button
            onClick={() => { onClose(); onDelete(t.id); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 size={15} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const Transacciones = ({ user, token, theme, isDarkMode, categorias, gastosCats, ingresosCats, onCreateCategoria, getCatStyle, getCatBar, getCatIconBg, getCatIconColor, getCatText, onOpenTutorial, pendingAction, onActionHandled, presupuestos }) => {
  const SkeletonBar = ({ w = '60px', h = '12px', className = '' }) => (
    <span className={`skeleton inline-block ${className}`} style={{ width: w, height: h }} />
  );

  const catColors = Object.fromEntries((categorias || []).map(c => [c.nombre, getCatStyle(c.color_hex)]));
  const catEmojis = Object.fromEntries((categorias || []).map(c => [c.nombre, c.emoji]));
  const catIconBg = Object.fromEntries((categorias || []).map(c => [c.nombre, { backgroundColor: getCatIconBg(c.color_hex) }]));
  const catIconColor = Object.fromEntries((categorias || []).map(c => [c.nombre, { color: getCatIconColor(c.color_hex) }]));
  const catBarColors = Object.fromEntries((categorias || []).map(c => [c.nombre, { backgroundColor: getCatBar(c.color_hex) }]));
  const catList = (categorias || []).map(c => c.nombre);

  const CATEGORY_LIST = catList.length > 0 ? catList : CATEGORY_LIST_DEFAULT;
  const CATEGORY_COLORS = Object.keys(catColors).length > 0 ? catColors : CATEGORY_COLORS_DEFAULT;
  const CATEGORY_EMOJI = Object.keys(catEmojis).length > 0 ? catEmojis : CATEGORY_EMOJI_DEFAULT;
  const CATEGORY_BAR_COLORS = Object.keys(catBarColors).length > 0 ? catBarColors : CATEGORY_BAR_COLORS_DEFAULT;
  const CATEGORY_ICON_BG = Object.keys(catIconBg).length > 0 ? catIconBg : CATEGORY_ICON_BG_DEFAULT;
  const CATEGORY_ICON_COLOR = Object.keys(catIconColor).length > 0 ? catIconColor : CATEGORY_ICON_COLOR_DEFAULT;

  const catBadgeStyle = (catName) => {
    const val = CATEGORY_COLORS[catName] || CATEGORY_COLORS['Otros'];
    if (typeof val === 'string') return { className: val };
    return { style: { backgroundColor: val.backgroundColor, color: val.color } };
  };

  const catHexes = Object.fromEntries((categorias || []).map(c => [c.nombre, c.color_hex]));
  const CATEGORY_HEX = Object.keys(catHexes).length > 0 ? catHexes : CATEGORY_HEX_DEFAULT;

  const catHex = (catName) =>
    CATEGORY_HEX[catName] || CATEGORY_HEX_DEFAULT[catName] || CATEGORY_HEX_DEFAULT['Otros'];

  const dateToInputStr = (d) => d.toISOString().slice(0, 10);

  const formatMonthLabel = (date) =>
    date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });

  const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];


  const goToPrevMonth = () => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() - 1);
    setMonthDate(d);
    setFilterDateRange(getMonthRange(d));
  };

  const goToNextMonth = () => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + 1);
    setMonthDate(d);
    setFilterDateRange(getMonthRange(d));
  };

  const catBarStyle = (catName) => {
    const val = CATEGORY_BAR_COLORS[catName] || CATEGORY_BAR_COLORS['Otros'];
    if (typeof val === 'string') return { className: val };
    return { style: { backgroundColor: val.backgroundColor } };
  };

  const [selectedTx, setSelectedTx] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [bankTotals, setBankTotals] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [loading, setLoading] = useState(true);
  // Los widgets del mes salen de fetchSummary, no de fetchTransactions. Con un
  // solo flag `loading` la lista terminaba antes que el resumen y el bloque de
  // widgets quedaba vacio hasta que llegaba: al aparecer, empujaba la pagina.
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [gmailForwardingAuthorized, setGmailForwardingAuthorized] = useState(null);
  const today = new Date();
  const getMonthRange = (date) => ({
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  });
  const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [filterDateRange, setFilterDateRange] = useState(getMonthRange(today));
  const [pendingDateRange, setPendingDateRange] = useState(null);
  const [filterCat, setFilterCat] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterBanco, setFilterBanco] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', dir: 'desc' });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

  const [showManualEntry, setShowManualEntry] = useState(false);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pendientesCount, setPendientesCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [editComercio, setEditComercio] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editTipoTransaccion, setEditTipoTransaccion] = useState('gasto');
  const [editTipoTarjeta, setEditTipoTarjeta] = useState('');
  const [editBanco, setEditBanco] = useState('');
  const [editFecha, setEditFecha] = useState('');
  const [editMonto, setEditMonto] = useState('');

  const [showReview, setShowReview] = useState(false);
  const [pendingTxs, setPendingTxs] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewCat, setReviewCat] = useState('Otros');
  const [reviewTipoGasto, setReviewTipoGasto] = useState(null);
  const [reviewTipoTransaccion, setReviewTipoTransaccion] = useState(null);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewDirection, setReviewDirection] = useState('forward');
  const [reprocessing, setReprocessing] = useState(false);
  const [revisando, setRevisando] = useState(false);
  const reviewSliderRef = useRef(null);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, title: '', itemName: '', itemType: '', message: '', onConfirm: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const splashRemoved = useRef(false);

  const confirmDelete = (options) => {
    return new Promise((resolve) => {
      setDeleteModal({
        isOpen: true,
        title: options.title || '¿Eliminar elemento?',
        itemName: options.itemName || '',
        itemType: options.itemType || 'elemento',
        message: options.message || '',
        onConfirm: () => {
          setIsDeleting(true);
          Promise.resolve(options.onConfirm?.()).finally(() => {
            setIsDeleting(false);
            setDeleteModal(prev => ({ ...prev, isOpen: false }));
            resolve(true);
          });
        }
      });
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal(prev => ({ ...prev, isOpen: false }));
    return false;
  };

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

  const fetchTransactions = useCallback(async (isPageChange = false, explicitPage = null) => {
    const currentPage = explicitPage !== null ? explicitPage : page;
    try {
      if (isPageChange) {
        setPageLoading(true);
      } else {
        setLoading(true);
      }
      const params = new URLSearchParams();
      if (filterDateRange.from) params.set('fecha_desde', dateToInputStr(filterDateRange.from));
      if (filterDateRange.to) params.set('fecha_hasta', dateToInputStr(filterDateRange.to));
      if (filterCat) params.set('categoria', filterCat);
      if (filterTipo) params.set('tipo_transaccion', filterTipo);
      if (filterBanco) params.set('banco', filterBanco);
      if (sortConfig) {
        params.set('sort_by', sortConfig.key);
        params.set('sort_order', sortConfig.dir);
      }
      params.set('revisado', 'true');
      params.set('limit', '10');
      params.set('offset', String(currentPage * 10));
      const res = await fetch(`/api/transacciones?${params.toString()}`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
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
      setPageLoading(false);
    }
  }, [getHeaders, filterDateRange, filterCat, filterTipo, filterBanco, sortConfig, page]);

  const fetchSummary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterDateRange.from) params.set('fecha_desde', dateToInputStr(filterDateRange.from));
      if (filterDateRange.to) params.set('fecha_hasta', dateToInputStr(filterDateRange.to));
      params.set('revisado', 'true');
      params.set('limit', '1');
      params.set('offset', '0');
      const res = await fetch(`/api/transacciones?${params.toString()}`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        setSummary(data.summary || []);
        setBankTotals(data.bankTotals || []);
        setTotalIngresos(data.total_ingresos || 0);
        setTotalGastos(data.total_gastos || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      // Solo la primera carga levanta el skeleton: al cambiar de mes se
      // mantienen los widgets anteriores hasta que llega el nuevo resumen,
      // para no reemplazar contenido por un placeholder de otra altura.
      setSummaryLoading(false);
    }
  }, [getHeaders, filterDateRange]);

  const refreshTable = useCallback(async () => {
    try {
      setPageLoading(true);
      const params = new URLSearchParams();
      if (filterDateRange.from) params.set('fecha_desde', dateToInputStr(filterDateRange.from));
      if (filterDateRange.to) params.set('fecha_hasta', dateToInputStr(filterDateRange.to));
      if (filterCat) params.set('categoria', filterCat);
      if (filterTipo) params.set('tipo_transaccion', filterTipo);
      if (filterBanco) params.set('banco', filterBanco);
      if (sortConfig) {
        params.set('sort_by', sortConfig.key);
        params.set('sort_order', sortConfig.dir);
      }
      params.set('revisado', 'true');
      params.set('limit', '10');
      params.set('offset', String(page * 10));
      const res = await fetch(`/api/transacciones?${params.toString()}`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
        setTotalCount(data.total || 0);
        setLastCheck(data.lastCheck);
        if (data.pendientes_count !== undefined) setPendientesCount(data.pendientes_count);
      }
      const pendRes = await fetch('/api/transacciones/pendientes?limit=1', { headers: getHeaders() });
      const pendData = await pendRes.json();
      if (pendData.count !== undefined) setPendientesCount(pendData.count);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }, [getHeaders, filterDateRange, filterCat, filterTipo, filterBanco, sortConfig, page]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/transacciones/status', { headers: getHeaders() });
      const data = await res.json();
      setAuthStatus(data.authenticated);
      setGmailForwardingAuthorized(data.gmail_forwarding_authorized || false);
    } catch (e) {
      setAuthStatus(false);
      setGmailForwardingAuthorized(false);
    }
  }, [getHeaders]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleClearFilters = () => {
    setFilterCat('');
    setFilterTipo('');
    setFilterBanco('');
    setSortConfig({ key: 'fecha', dir: 'desc' });
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    setMonthDate(firstOfMonth);
    setFilterDateRange(getMonthRange(now));
    setPendingDateRange(getMonthRange(now));
  };

  const activeFilters = [
    { key: 'filterCat', label: `Categoría: ${filterCat}`, value: filterCat, clear: () => setFilterCat('') },
    { key: 'filterTipo', label: `Tipo: ${filterTipo}`, value: filterTipo, clear: () => setFilterTipo('') },
    { key: 'filterBanco', label: `Banco: ${filterBanco}`, value: filterBanco, clear: () => setFilterBanco('') },
  ].filter(f => f.value);

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

  const handleRevisar = async () => {
    setRevisando(true);
    notifyInfo('Buscando correos', 'Revisando Gmail por transacciones nuevas.');
    try {
      const res = await fetch('/api/transacciones/revisar', { method: 'POST', headers: getHeaders() });
      const { jobId } = await res.json();
      if (!jobId) throw new Error('No se pudo iniciar la revisión');

      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await fetch(`/api/transacciones/revisar/status/${jobId}`, { headers: getHeaders() });
        const status = await statusRes.json();
        if (status.status === 'completed' || status.status === 'done') {
          const result = status.result || {};
          if (result.needsReauth) {
            setAuthStatus(false);
            notifyError('Token de Gmail expirado', result.message || 'Ve a Configuración → Gmail para re-autenticar.');
            break;
          }
          if (result.error) {
            notifyError('No se pudo revisar', result.message || result.error);
            break;
          }
          const newTx = result.new || 0;
          notifyOk('Revisión completada', `${newTx} transacciones nuevas.`);
          break;
        }
        if (status.status === 'failed' || status.status === 'error') {
          throw new Error(status.error || 'Error al revisar correos');
        }
      }
      await fetchPendientes();
      fetchTransactions();
      fetchPendientesCount();
    } catch (e) {
      notifyError('No se pudo revisar', e.message);
    } finally {
      setRevisando(false);
    }
  };

  const handleReprocess = async () => {
    setReprocessing(true);
    notifyInfo('Reprocesando', 'Volviendo a clasificar las transacciones con IA.');
    try {
      const res = await fetch('/api/transacciones/reprocesar', { method: 'POST', headers: getHeaders() });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      if (result.needsReauth) {
        setAuthStatus(false);
        notifyError('Token de Gmail expirado', 'Ve a Configuración → Gmail para re-autenticar.');
        return;
      }
      const skipped = result.skipped || 0;
      const msg = skipped > 0
        ? `Reprocesadas ${result.processed} de ${result.total} (${skipped} no encontradas en Gmail)`
        : `Reprocesadas ${result.processed} de ${result.total} transacciones`;
      notifyOk('Reproceso listo', msg);
      await fetchPendientes();
      fetchTransactions();
      fetchSummary();
      fetchPendientesCount();
    } catch (e) {
      notifyError('No se pudo reprocesar', e.message);
    } finally {
      setReprocessing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchTransactions(false);
    fetchSummary();
    fetchPendientesCount();
  }, []);

  useEffect(() => {
    if (!loading && !splashRemoved.current) {
      splashRemoved.current = true;
      const el = document.getElementById('splash');
      if (el) {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 500);
      }
    }
  }, [loading]);

  // Ordenar solo reordena la lista: los totales y los widgets de resumen no
  // cambian, asi que no debe entrar por la ruta de `loading` (esa deja los
  // widgets en skeleton). Los filtros y el cambio de mes si.
  const lastQueryRef = useRef(null);

  useEffect(() => {
    const queryKey = JSON.stringify({ filterCat, filterTipo, filterBanco, filterDateRange });
    const onlySortChanged = lastQueryRef.current !== null && lastQueryRef.current === queryKey;
    lastQueryRef.current = queryKey;
    setPage(0);
    fetchTransactions(onlySortChanged, 0);
  }, [filterCat, filterTipo, filterBanco, sortConfig, filterDateRange]);

  useEffect(() => {
    fetchSummary();
  }, [filterDateRange]);

  // La navegacion global (FAB central y menu de usuario) pide acciones que solo
  // se pueden ejecutar aqui, que es donde vive el estado de la pantalla.
  useEffect(() => {
    if (!pendingAction) return;
    if (pendingAction.type === 'manual') setShowManualEntry(true);
    else if (pendingAction.type === 'revisar') handleRevisar();
    else if (pendingAction.type === 'reprocesar') handleReprocess();
    if (typeof onActionHandled === 'function') onActionHandled();
  }, [pendingAction]);

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

  const handleDeleteTx = async (id) => {
    const txToDelete = transactions.find(t => t.id === id);
    await confirmDelete({
      title: '¿Eliminar transacción?',
      itemName: txToDelete ? `${txToDelete.comercio || 'Transacción'} - $${Math.abs(txToDelete.monto)}` : 'esta transacción',
      itemType: 'transacción',
      onConfirm: async () => {
        await notifyPromise((async () => {
          const res = await fetch(`/api/transacciones/${id}`, { method: 'DELETE', headers: getHeaders() });
          if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);
          setTransactions(prev => prev.filter(tx => tx.id !== id));
          fetchTransactions();
          fetchSummary();
        })(), {
          loading: 'Eliminando',
          ok: 'Transacción eliminada',
          error: 'No se pudo eliminar',
        }).catch(() => {});
      }
    });
  };

  const handleEditTx = (tx) => {
    setEditingTx(tx);
    setEditComercio(tx.comercio || '');
    setEditCategoria(tx.categoria || 'Otros');
    const normalizedTipo = tx.tipo_transaccion === 'no_es_gasto' ? 'gasto'
      : tx.tipo_transaccion === 'no_es_ingreso' ? 'ingreso'
      : (tx.tipo_transaccion || 'gasto');
    setEditTipoTransaccion(normalizedTipo);
    setEditTipoTarjeta(tx.tipo_tarjeta || '');
    setEditBanco(tx.banco || '');
    setEditFecha(tx.fecha || '');
    setEditMonto(tx.monto != null ? String(tx.monto) : '');
    setShowEditModal(true);
  };

  const handleUpdateTx = async () => {
    if (!editingTx) return;
    try {
      const res = await notifyPromise(fetch(`/api/transacciones/${editingTx.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({
          categoria: editCategoria,
          tipo_transaccion: editTipoTransaccion,
          comercio: editComercio,
          tipo_tarjeta: editTipoTarjeta,
          banco: editBanco,
          fecha: editFecha || undefined,
          monto: editMonto ? parseFloat(editMonto) : undefined
        })
      }).then(r => {
        if (!r.ok) throw new Error(`El servidor respondió ${r.status}`);
        return r;
      }), {
        loading: 'Guardando',
        ok: 'Transacción actualizada',
        error: 'No se pudo guardar',
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
              fetchSummary();
            }, 200);
          }
        } else {
          fetchTransactions();
        }
      }
    } catch (err) {
      // notifyPromise ya mostro el error; aqui solo se evita romper el render.
      console.error(err);
    }
  };

  const handleOpenReview = async () => {
    const txs = await fetchPendientes();
    if (txs.length === 0) {
      notifyInfo('Sin pendientes', 'No hay transacciones por revisar.');
      return;
    }
    const first = txs[0];
    setReviewIdx(0);
    setReviewCat(first.categoria || 'Otros');
    setReviewTipoGasto(first.tipo_gasto || null);
    setReviewTipoTransaccion(null);
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
      fetchSummary();
      fetchPendientesCount();
    }, 250);
  };

  const handleConfirmReview = async () => {
    const tx = pendingTxs[reviewIdx];
    if (!tx) return false;
    setReviewSaving(true);
    const txType = reviewTipoTransaccion || tx.tipo_transaccion || 'gasto';
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
        notifyError('No se pudo guardar', 'La transacción quedó sin clasificar.');
        return false;
      }
      toast.success({ id: 'revision-tx', title: 'Clasificada', duration: 2000 });
      return true;
    } catch (err) {
      console.error(err);
      setReviewSaving(false);
      notifyError('Error de red', 'No se pudo guardar la transacción.');
      return false;
    }
  };

  const handleConfirmNoEs = async () => {
    const tx = pendingTxs[reviewIdx];
    if (!tx) return false;
    setReviewSaving(true);
    const txType = reviewTipoTransaccion || tx.tipo_transaccion || 'gasto';
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
        notifyError('No se pudo guardar', 'La transacción quedó sin clasificar.');
        return false;
      }
      toast.success({ id: 'revision-tx', title: 'Clasificada', duration: 2000 });
      return true;
    } catch (err) {
      console.error(err);
      setReviewSaving(false);
      notifyError('Error de red', 'No se pudo guardar la transacción.');
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
        fetchSummary();
        fetchPendientesCount();
      }, 200);
    } else {
      const nextIdx = reviewIdx + 1;
      setReviewDirection('forward');
      setReviewIdx(nextIdx);
      const next = pendingTxs[nextIdx];
      setReviewCat(next.categoria || 'Otros');
      setReviewTipoGasto(next.tipo_gasto || null);
      setReviewTipoTransaccion(null);
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
      setReviewTipoTransaccion(null);
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
    setReviewTipoTransaccion(null);
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
    // Si la transacción quedó marcada "no es gasto/ingreso", la tarjeta de
    // revisión debe partir asumiendo que se está reclasificando de vuelta a
    // gasto/ingreso real — si no, handleConfirmReview reusa tx.tipo_transaccion
    // (el valor viejo "no_es_gasto") y el check no cambia nada.
    const normalizedTipo = tx.tipo_transaccion === 'no_es_gasto' ? 'gasto'
      : tx.tipo_transaccion === 'no_es_ingreso' ? 'ingreso'
      : null;
    setReviewTipoTransaccion(normalizedTipo);
    setShowReview(true);
    setReviewVisible(true);
  };

  const currentReviewTx = pendingTxs[reviewIdx] || null;

  // Se repite arriba y abajo de la lista de transacciones, asi que va como
  // una sola definicion en vez de duplicar el bloque.
  const FilterRow = () => (
    <div ref={refFilaHorizontal} className="flex gap-2 overflow-x-auto no-scrollbar">
      <button onClick={() => { setShowFilterModal(true); setPendingDateRange(filterDateRange); }} className="flex-shrink-0 flex items-center gap-1.5 bg-white dark:bg-dark-normal hover:bg-slate-50 dark:hover:bg-dark-lighter text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-dark-lighter transition whitespace-nowrap">
        <Filter size={14} /> Filtrar{activeFilters.length > 0 && ` (${activeFilters.length})`}
      </button>
      <button onClick={refreshTable} disabled={pageLoading || loading} title="Actualizar" className="flex-shrink-0 flex items-center justify-center bg-white dark:bg-dark-normal hover:bg-slate-50 dark:hover:bg-dark-lighter text-slate-600 dark:text-slate-300 w-9 h-9 rounded-xl border border-slate-200 dark:border-dark-lighter transition disabled:opacity-50">
        <RefreshCw size={14} className={pageLoading ? 'animate-spin' : ''} />
      </button>
      <span className="w-px flex-shrink-0 bg-slate-200 dark:bg-dark-lighter mx-0.5" />
      <button
        onClick={() => setFilterTipo('')}
        className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
          filterTipo === '' ? `${theme.btnPrimary} text-white` : 'bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'
        }`}
      >
        Todos
      </button>
      <button
        onClick={() => setFilterTipo('gasto')}
        className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
          filterTipo === 'gasto' ? `${theme.btnPrimary} text-white` : 'bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'
        }`}
      >
        Gastos
      </button>
      <button
        onClick={() => setFilterTipo('ingreso')}
        className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
          filterTipo === 'ingreso' ? `${theme.btnPrimary} text-white` : 'bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter'
        }`}
      >
        Ingresos
      </button>
    </div>
  );

  if (gmailForwardingAuthorized === false) {
    return (
      <div className="animate-fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3">
            <Mail className={theme.tabText} size={20} /> Transacciones
          </h2>
        </div>
        <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-lighter p-8 text-center">
          <div className="max-w-md mx-auto">
            <Mail size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Configura el reenvío de correos</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Para recibir tus transacciones automáticamente, configura el reenvío de notificaciones bancarias desde Gmail hacia tu casilla en Kuentas Klaras.
            </p>
            <button onClick={() => onOpenTutorial(authStatus)} className={`flex items-center justify-center gap-2 mx-auto ${theme.btnPrimary} text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition`}>
              <ExternalLink size={16} /> Ver tutorial paso a paso
            </button>
          </div>
        </div>
      </div>
    );
  }

  // El presupuesto se guarda en el dashboard con la clave "Mes Año" ("Agosto
  // 2026"). Esta pantalla navega por fecha, asi que arma la misma clave desde
  // el mes visible: cada mes muestra el suyo.
  const mesPresupuestoKey = `${MONTH_NAMES[monthDate.getMonth()]} ${monthDate.getFullYear()}`;
  const presupuestoMes = presupuestos?.[mesPresupuestoKey] || 0;

  const widgetsLoading = summaryLoading;
  const listLoading = loading && transactions.length === 0;
  const hasWidgets = summary.length > 0 || bankTotals.length > 0;

  return (
    <>
      <div className="animate-fade-in duration-500 space-y-6 px-4 sm:px-6 w-full max-w-5xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        {/* En movil Pendientes se empuja al borde derecho: es la accion mas
            importante de la pantalla y ahi cae bajo el pulgar. */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            <Mail className={theme.tabText} size={20} /> Transacciones
          </h2>
          {pendientesCount > 0 ? (
            <button onClick={handleOpenReview} className="relative flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 dark:shadow-orange-900/40 transition active:scale-95 whitespace-nowrap">
              <Bell size={16} />
              Pendientes
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-black min-w-[22px] h-5 flex items-center justify-center rounded-full px-1 shadow-md ring-2 ring-white dark:ring-dark-normal">
                {pendientesCount}
              </span>
            </button>
          ) : (
            <button onClick={handleOpenReview} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-dark-normal text-slate-400 dark:text-slate-500 rounded-xl text-xs font-bold border border-slate-200 dark:border-dark-lighter transition active:scale-95 hover:bg-slate-200 dark:hover:bg-dark-lighter whitespace-nowrap">
              <Bell size={14} />
              Sin pendientes
            </button>
          )}
        </div>
      </div>

      {/* El mes manda sobre widgets y lista, asi que va primero, ocupando
          todo el ancho: abajo obligaba a bajar para cambiar de mes. */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-2xl px-2 py-2">
          <button onClick={goToPrevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-lighter rounded-xl transition text-slate-500 dark:text-slate-400">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => { setShowMonthPicker(!showMonthPicker); setPickerYear(monthDate.getFullYear()); }} className="flex-1 text-center text-sm font-black text-slate-700 dark:text-slate-200 capitalize hover:bg-slate-100 dark:hover:bg-dark-lighter px-2 py-1.5 rounded-xl transition">
            {formatMonthLabel(monthDate)}
          </button>
          <button onClick={goToNextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-lighter rounded-xl transition text-slate-500 dark:text-slate-400">
            <ChevronRight size={18} />
          </button>
        </div>
        {showMonthPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMonthPicker(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-2xl shadow-2xl p-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <button onClick={() => setPickerYear(pickerYear - 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-dark-lighter rounded-lg transition text-slate-500 dark:text-slate-400">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{pickerYear}</span>
                <button onClick={() => setPickerYear(pickerYear + 1)} className="p-1 hover:bg-slate-100 dark:hover:bg-dark-lighter rounded-lg transition text-slate-500 dark:text-slate-400">
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {MONTHS_SHORT.map((name, i) => {
                  const isCurrent = monthDate.getMonth() === i && monthDate.getFullYear() === pickerYear;
                  return (
                    <button
                      key={name}
                      onClick={() => {
                        const d = new Date(pickerYear, i, 1);
                        setMonthDate(d);
                        setFilterDateRange(getMonthRange(d));
                        setShowMonthPicker(false);
                      }}
                      className={`px-2 py-2 rounded-lg text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'hover:bg-slate-100 dark:hover:bg-dark-lighter text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Los bones los captura boneyard-js del UI real (`npm run bones`), asi
          que el skeleton sigue al widget aunque este cambie. <TxWidgetsSkeleton>
          es el fallback mientras no haya captura para este breakpoint. */}
      {(widgetsLoading || hasWidgets) && (
      <Skeleton name="tx-widgets" loading={widgetsLoading} animate="shimmer" transition={200} fallback={<TxWidgetsSkeleton />}>
      {hasWidgets ? (
        (() => {
        const bankGroups = {};
        for (const row of bankTotals) {
          if (row.total <= 0) continue;
          const bank = row.banco || 'Otros';
          // El COUNT de Postgres llega como texto: sin convertir, la suma
          // concatenaba y la tarjeta mostraba "014 movimientos".
          const cantidad = Number(row.count) || 0;
          if (!bankGroups[bank]) bankGroups[bank] = { bank, count: 0, sortTotal: 0, tipos: [] };
          bankGroups[bank].count += cantidad;
          bankGroups[bank].sortTotal += row.total;
          const tipo = normalizeTipoTarjeta(row.tipo_tarjeta);
          const yaVisto = bankGroups[bank].tipos.find(t => t.tipo === tipo);
          if (yaVisto) {
            yaVisto.total += row.total;
            yaVisto.count += cantidad;
          } else {
            bankGroups[bank].tipos.push({ tipo, total: row.total, count: cantidad });
          }
        }
        // Debito y credito son cupos distintos: cada uno se muestra en su
        // propia linea dentro de la tarjeta, nunca sumados en un solo total.
        const bankCards = Object.values(bankGroups).sort((a, b) => b.sortTotal - a.sortTotal);
        const gastoSummary = summary
          .filter(s => !['Interno', 'No es Gasto', 'No es Ingreso'].includes(s.categoria) && s.tipo !== 'ingreso')
          .sort((a, b) => b.total - a.total);
        const maxGasto = Math.max(...gastoSummary.map(s => s.total), 1);
        const stackTotal = Math.max(totalGastos, gastoSummary.reduce((acc, s) => acc + s.total, 0), 1);

        return (
          <div key={(filterDateRange.from?.toISOString() || '') + '-' + filterCat} className="animate-slide-fade space-y-5">

            <div className="flex flex-col gap-2.5 p-4 rounded-3xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter shadow-fluid">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Gastado en {formatMonthLabel(monthDate).split(' ')[0]}</div>
                  <div className="mt-0.5 text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">{formatCurrency(totalGastos)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Presupuesto</div>
                  <div className="mt-0.5 text-sm font-black text-slate-700 dark:text-slate-200">
                    {presupuestoMes > 0 ? formatCurrency(presupuestoMes) : 'Sin definir'}
                  </div>
                  <div className="mt-0.5 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                    Ingresos +{formatCurrency(totalIngresos)}
                  </div>
                </div>
              </div>
              {gastoSummary.length > 0 && (
                <div className="flex h-2 rounded-full overflow-hidden">
                  {gastoSummary.map(s => (
                    <span key={s.categoria} style={{ width: `${(s.total / stackTotal) * 100}%`, backgroundColor: catHex(s.categoria) }} />
                  ))}
                </div>
              )}
            </div>

            {gastoSummary.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Categorías con más gasto</span>
                  <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500">{gastoSummary.length} categoría{gastoSummary.length === 1 ? '' : 's'}</span>
                </div>
                <div className="rounded-3xl bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter shadow-fluid overflow-hidden">
                  <div className="max-h-[260px] overflow-y-auto custom-scrollbar p-4 space-y-3.5">
                    {gastoSummary.map(s => {
                      const hex = catHex(s.categoria);
                      return (
                        <div key={s.categoria} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: hexToRgba(hex, isDarkMode ? 0.22 : 0.16), color: hex }}>
                              <span className="text-sm leading-none">{CATEGORY_EMOJI[s.categoria] || CATEGORY_EMOJI_DEFAULT[s.categoria] || '💳'}</span>
                            </div>
                            <span className="flex-1 text-[13px] font-black text-slate-700 dark:text-slate-200 truncate">{s.categoria}</span>
                            <span className="text-[13px] font-black text-slate-700 dark:text-slate-200 flex-shrink-0">{formatCurrency(s.total)}</span>
                          </div>
                          <div className="h-[9px] rounded-full bg-slate-100 dark:bg-dark-lighter overflow-hidden ml-[38px]">
                            <div className="h-full rounded-full" style={{ width: `${(s.total / maxGasto) * 100}%`, background: `linear-gradient(90deg, ${hexToRgba(hex, 0.75)}, ${hex})` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {bankCards.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Gasto por tarjeta</span>
                  <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500">{bankCards.length} medio{bankCards.length === 1 ? '' : 's'}</span>
                </div>
                <div ref={refFilaHorizontal} className="flex gap-3 overflow-x-auto no-scrollbar pb-1.5">
                  {bankCards.map(group => {
                    const bank = group.bank;
                    const [c1, c2, c3] = BANK_GRADIENT[bank] || BANK_GRADIENT_FALLBACK;
                    return (
                      <div
                        key={bank}
                        className="flex-shrink-0 w-[210px] aspect-[1.586] rounded-2xl p-3.5 flex flex-col gap-2 relative overflow-hidden shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 55%, ${c3} 100%)` }}
                      >
                        <span className="absolute -right-5 -top-6 w-[110px] h-[110px] rounded-full bg-white/[0.06]" />
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {BANK_ICONS[bank] && (
                              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 p-[3px]">
                                <img src={BANK_ICONS[bank]} alt="" className="w-full h-full object-contain" />
                              </span>
                            )}
                            <span className="text-[11px] font-black text-white/90 truncate">{bank}</span>
                          </div>
                          <span className="w-5 h-3.5 rounded-[3px] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FDE68A, #F59E0B)' }} />
                        </div>
                        <div className="relative flex flex-col gap-1">
                          {group.tipos.map(t => (
                            <div key={t.tipo} className="flex items-center justify-between gap-2">
                              <span className="text-[9.5px] font-black uppercase tracking-wide text-white/60 truncate">{t.tipo}</span>
                              <span className="text-[13px] font-black text-white flex-shrink-0">{formatCurrency(t.total)}</span>
                            </div>
                          ))}
                        </div>
                        <span className="relative mt-auto text-[9.5px] font-bold text-white/50">{group.count} movimiento{group.count === 1 ? '' : 's'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        );
      })()
      ) : null}
      </Skeleton>
      )}



      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Transacciones</span>
      </div>

      <FilterRow />

      <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-lighter overflow-hidden">
        <Skeleton
          name="tx-list"
          loading={listLoading}
          animate="shimmer"
          transition={200}
          fallback={(
            <div className="p-3 sm:p-4 space-y-2.5">
              <div className="px-1 pb-1"><SortChips sortConfig={sortConfig} onSort={handleSort} /></div>
              {Array.from({ length: 8 }).map((_, i) => (
                <TransactionCardSkeleton key={i} />
              ))}
            </div>
          )}
        >
        {listLoading ? null : transactions.length === 0 && !loading ? (
          <div className="text-center py-16">
            <Inbox size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-2">No hay transacciones clasificadas</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Presiona "Configurar" para importar correos bancarios anteriores y luego clasifícalas en Pendientes</p>
          </div>
        ) : (
          <>
            <div className={`animate-slide-fade relative p-3 sm:p-4 ${pageLoading ? 'opacity-60 pointer-events-none transition-opacity duration-150' : ''}`}>
              {pageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 size={28} className="animate-spin text-slate-400 dark:text-slate-500" />
                </div>
              )}
              <div className="px-1 pb-3">
                <SortChips sortConfig={sortConfig} onSort={handleSort} />
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                {transactions.map((tx, txIdx) => (
                  <TransactionCard
                    key={tx.id}
                    idx={txIdx}
                    tx={tx}
                    hex={catHex(tx.categoria)}
                    emoji={CATEGORY_EMOJI[tx.categoria] || CATEGORY_EMOJI_DEFAULT[tx.categoria] || '💳'}
                    badge={catBadgeStyle(tx.categoria)}
                    isDarkMode={isDarkMode}
                    formatCurrency={formatCurrency}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    onEdit={handleReclasificarTx}
                    onDelete={handleDeleteTx}
                    onOpenDetail={setSelectedTx}
                  />
                ))}
              </div>
            </div>
            {totalCount > 10 && (() => {
              const totalPages = Math.ceil(totalCount / 10);
              const maxVisible = 5;
              let startPage = Math.max(0, page - Math.floor(maxVisible / 2));
              let endPage = Math.min(totalPages, startPage + maxVisible);
              if (endPage - startPage < maxVisible) startPage = Math.max(0, endPage - maxVisible);
              const pages = [];
              for (let i = startPage; i < endPage; i++) pages.push(i);

              return (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-dark-lighter">
                  <button onClick={() => { const newP = Math.max(0, page - 1); setPage(newP); fetchTransactions(true, newP); }} disabled={page === 0}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:cursor-not-allowed transition">
                    Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {startPage > 0 && (
                      <>
                        <button onClick={() => { setPage(0); fetchTransactions(true, 0); }} className="w-8 h-8 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter transition">1</button>
                        {startPage > 1 && <span className="px-1 text-slate-400 text-xs">…</span>}
                      </>
                    )}
                    {pages.map(p => (
                      <button key={p} onClick={() => { setPage(p); fetchTransactions(true, p); }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                          p === page
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter'
                        }`}>
                        {p + 1}
                      </button>
                    ))}
                    {endPage < totalPages && (
                      <>
                        {endPage < totalPages - 1 && <span className="px-1 text-slate-400 text-xs">…</span>}
                        <button onClick={() => { const lp = totalPages - 1; setPage(lp); fetchTransactions(true, lp); }} className="w-8 h-8 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter transition">{totalPages}</button>
                      </>
                    )}
                  </div>
                  <button onClick={() => { const newP = page + 1; setPage(newP); fetchTransactions(true, newP); }} disabled={(page + 1) * 10 >= totalCount}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:cursor-not-allowed transition">
                    Siguiente
                  </button>
                </div>
              );
            })()}
          </>
        )}
        </Skeleton>
      </div>

      {lastCheck > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
          Ultima revision: {new Date(lastCheck).toLocaleString('es-CL')}
        </p>
      )}


      {/* Edit Transaction Modal */}
      {showEditModal && editingTx && (
        <div className={`fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md ${showReview ? 'z-[60]' : 'z-50'} flex items-center justify-center p-3 sm:p-4`}>
          <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Comercio</label>
                <input value={editComercio} onChange={e => setEditComercio(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Monto</label>
                  <input type="number" value={editMonto} onChange={e => setEditMonto(e.target.value)} placeholder="0" className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Fecha</label>
                  <input type="date" value={editFecha} onChange={e => setEditFecha(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Tipo</label>
                <select value={editTipoTransaccion} onChange={e => setEditTipoTransaccion(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  <option value="gasto">Gasto</option>
                  <option value="ingreso">Ingreso</option>
                  <option value="interno">Interno</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Categoria</label>
                <select value={editCategoria} onChange={e => setEditCategoria(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  {CATEGORY_LIST.map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
                {onCreateCategoria && (
                  <button
                    onClick={() => {
                      const name = prompt('Nombre de la nueva categoría:');
                      if (name) onCreateCategoria({ nombre: name, tipo: 'gasto' }).then(c => setEditCategoria(c.nombre)).catch(e => console.error(e));
                    }}
                    className="mt-1.5 flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-500 transition"
                  >
                    <Plus size={12} /> Nueva categoría
                  </button>
                )}
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Tipo de tarjeta</label>
                <select value={editTipoTarjeta} onChange={e => setEditTipoTarjeta(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  <option value="">—</option>
                  <option value="Débito">Débito</option>
                  <option value="Crédito">Crédito</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Banco / Medio de pago</label>
                <select value={editBanco} onChange={e => setEditBanco(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  <option value="">—</option>
                  {Object.keys(BANK_ICONS).map(b => (<option key={b} value={b}>{b}</option>))}
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition">Cancelar</button>
                <button onClick={handleUpdateTx} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition">
                  <Save size={16} /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-sm p-4 sm:p-6 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <Filter size={20} className={theme.tabText} /> Filtros de tabla
              </h3>
              <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Rango de fechas</label>
                <Calendar
                  mode="range"
                  selected={pendingDateRange}
                  onSelect={(range) => {
                    if (range?.from) setPendingDateRange(range);
                  }}
                  numberOfMonths={1}
                  captionLayout="dropdown"
                  fromYear={2020}
                  toYear={new Date().getFullYear() + 1}
                  className="rounded-lg mx-auto"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Categoría</label>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  <option value="">Todas las categorías</option>
                  {CATEGORY_LIST.map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Tipo</label>
                <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  <option value="">Todos los tipos</option>
                  <option value="gasto">Gasto</option>
                  <option value="ingreso">Ingreso</option>
                  <option value="interno">Interno</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Banco</label>
                <select value={filterBanco} onChange={e => setFilterBanco(e.target.value)} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  <option value="">Todos los bancos</option>
                  {Object.keys(BANK_ICONS).map(b => (<option key={b} value={b}>{b}</option>))}
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Ordenar por</label>
                <select value={`${sortConfig.key}-${sortConfig.dir}`} onChange={e => { const [key, dir] = e.target.value.split('-'); setSortConfig({ key, dir }); }} className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition dark:text-slate-200">
                  <option value="fecha-desc">Fecha ↓</option>
                  <option value="fecha-asc">Fecha ↑</option>
                  <option value="monto-desc">Monto ↓</option>
                  <option value="monto-asc">Monto ↑</option>
                  <option value="comercio-asc">Comercio A-Z</option>
                  <option value="comercio-desc">Comercio Z-A</option>
                </select>
              </div>
              {activeFilters.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-dark-lighter">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {activeFilters.map(f => (
                      <span key={f.key} className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {f.label}
                        <button onClick={() => { f.clear(); }} className="hover:text-red-500 transition-colors"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={handleClearFilters} className="flex-1 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition">Limpiar</button>
                <button onClick={() => { setFilterDateRange(pendingDateRange); setShowFilterModal(false); }} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition">
                  <Check size={16} /> Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        </div>

      {/* Review Panel - Full Screen */}
      {showReview && currentReviewTx && (
        <div className={`fixed inset-0 bg-white/60 dark:bg-zinc-900/80 z-50 flex items-center justify-center p-3 sm:p-4 transition duration-300 ${reviewVisible ? 'opacity-100 backdrop-blur-md' : 'opacity-0 invisible'}`}>
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
            reviewTipoTransaccion={reviewTipoTransaccion}
            setReviewTipoTransaccion={setReviewTipoTransaccion}
            reviewSaving={reviewSaving}
            theme={theme}
            isDarkMode={isDarkMode}
            onClose={handleCloseReview}
            onPrev={handlePrevReview}
            onNext={handleSkipReview}
            onConfirm={handleConfirmReview}
            onConfirmNoEs={handleConfirmNoEs}
            onConfirmComplete={handleConfirmComplete}
            onEdit={handleEditReviewTx}
            CATEGORY_LIST={CATEGORY_LIST}
            CATEGORY_EMOJI={CATEGORY_EMOJI}
            CATEGORY_ICON_BG={CATEGORY_ICON_BG}
            CATEGORY_ICON_COLOR={CATEGORY_ICON_COLOR}
            CATEGORY_COLORS={CATEGORY_COLORS}
            onCreateCategoria={onCreateCategoria}
            categorias={categorias}
          />
        </div>
      )}

      <ManualTransactionPanel
        show={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        onCreated={() => { fetchTransactions(); fetchSummary(); }}
        theme={theme}
        token={token}
        isDarkMode={isDarkMode}
      />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteModal.onConfirm}
        title={deleteModal.title}
        itemName={deleteModal.itemName}
        itemType={deleteModal.itemType}
        message={deleteModal.message}
        isDeleting={isDeleting}
      />
      <TransactionDetailModal
        tx={selectedTx}
        hex={selectedTx ? catHex(selectedTx.categoria) : null}
        emoji={selectedTx ? (CATEGORY_EMOJI[selectedTx.categoria] || CATEGORY_EMOJI_DEFAULT[selectedTx.categoria] || '💳') : null}
        badge={selectedTx ? catBadgeStyle(selectedTx.categoria) : null}
        isDarkMode={isDarkMode}
        formatCurrency={formatCurrency}
        onClose={() => setSelectedTx(null)}
        onEdit={handleReclasificarTx}
        onDelete={handleDeleteTx}
      />
    </>
  );
};

export default Transacciones;
