import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail, RefreshCw, Trash2, ExternalLink, Loader2, Inbox, Filter,
  Settings2, Plus, X, Edit3, Check, ChevronLeft, ChevronRight,
  Utensils, Bus, Wrench, Clapperboard, HeartPulse, Home, ShoppingBag,
  MoreHorizontal, ArrowRight, Zap, CalendarDays, CalendarRange, Ban,
  Banknote, TrendingUp, Wallet, Clock, Save, ShoppingCart, ArrowLeftRight
} from 'lucide-react';
import ManualTransactionPanel from './ManualTransactionPanel.jsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.jsx';

import {
  CATEGORY_LIST as CATEGORY_LIST_DEFAULT,
  CATEGORY_COLORS as CATEGORY_COLORS_DEFAULT,
  CATEGORY_BAR_COLORS as CATEGORY_BAR_COLORS_DEFAULT,
  CATEGORY_ICON_BG as CATEGORY_ICON_BG_DEFAULT,
  CATEGORY_ICON_COLOR as CATEGORY_ICON_COLOR_DEFAULT,
  CATEGORY_EMOJI as CATEGORY_EMOJI_DEFAULT,
  BANK_COLORS, BANK_ACCENT, BANK_ICONS
} from './constants.js';

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
              <img src={BANK_ICONS[tx.banco]} alt="" className={`w-8 h-8 rounded-full shadow ${isDarkMode && tx.banco === 'Banco de Chile' ? 'brightness-0 invert' : ''}`} />
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
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={CATEGORY_COLORS[reviewCat]?.backgroundColor ? { backgroundColor: CATEGORY_COLORS[reviewCat].backgroundColor, color: CATEGORY_COLORS[reviewCat].color, border: `1px solid ${CATEGORY_COLORS[reviewCat].borderColor || 'transparent'}` } : {}}>
              <span className={!CATEGORY_COLORS[reviewCat]?.backgroundColor ? CATEGORY_COLORS[reviewCat] || CATEGORY_COLORS['Otros'] : ''}>{reviewCat}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sortedCats.map(cat => {
              const selected = reviewCat === cat;
              const iconBg = CATEGORY_ICON_BG[cat];
              const iconCol = CATEGORY_ICON_COLOR[cat];
              const isStyle = iconBg?.backgroundColor !== undefined;
              return (
                <button
                  key={cat}
                  onClick={() => setReviewCat(cat)}
                  style={selected && isStyle ? { backgroundColor: iconBg.backgroundColor, color: iconCol.color, borderColor: iconCol.color } : {}}
                  className={`flex flex-col items-center text-center gap-1 flex-shrink-0 w-[4.5rem] min-h-[4rem] px-1 py-2 rounded-xl transition-all duration-200 border ${
                    selected
                      ? (isStyle ? 'shadow-sm scale-105' : `${iconBg} border-current shadow-sm scale-105`)
                      : 'bg-slate-100 dark:bg-dark-lighter border-slate-200 dark:border-dark-lighter hover:border-slate-300 dark:hover:border-dark-lightest'
                  }`}
                >
                  <span className="text-xl leading-none">{CATEGORY_EMOJI[cat]}</span>
                  <span className={`text-[8px] font-bold leading-tight text-center ${selected && !isStyle ? iconCol : ''}`} style={selected && isStyle ? { color: iconCol.color } : {}}>
                    {cat}
                  </span>
                </button>
              );
            })}
            {onCreateCategoria && (
              <button
                onClick={() => {
                  const name = prompt('Nombre de la nueva categoría:');
                  if (name) onCreateCategoria({ nombre: name, tipo: 'gasto' }).then(c => setReviewCat(c.nombre)).catch(e => alert(e.message));
                }}
                className="flex flex-col items-center text-center gap-1 flex-shrink-0 w-[4.5rem] min-h-[4rem] px-1 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-dark-lighter transition-all"
                title="Agregar categoría"
              >
                <span className="text-xl leading-none">+</span>
                <span className="text-[8px] font-bold leading-tight text-center">Nueva</span>
              </button>
            )}
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

        {detectedAsInterno && !reviewTipoTransaccion && (
          <div className="space-y-2">
            <div className="bg-slate-50 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter rounded-2xl p-3 text-center">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Detectado como traspaso entre cuentas</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Selecciona el tipo real de esta transacción</p>
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
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-bold transition-all border ${
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

const Transacciones = ({ token, theme, isDarkMode, categorias, gastosCats, ingresosCats, onCreateCategoria, getCatStyle, getCatBar, getCatIconBg, getCatIconColor, getCatText, onOpenTutorial }) => {
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

  const catBarStyle = (catName) => {
    const val = CATEGORY_BAR_COLORS[catName] || CATEGORY_BAR_COLORS['Otros'];
    if (typeof val === 'string') return { className: val };
    return { style: { backgroundColor: val.backgroundColor } };
  };

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [bankTotals, setBankTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [gmailForwardingAuthorized, setGmailForwardingAuthorized] = useState(null);
  const [filterCat, setFilterCat] = useState('');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [statusMsg, setStatusMsg] = useState(null);
  const [filters, setFilters] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
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
  const [reviewTipoTransaccion, setReviewTipoTransaccion] = useState(null);
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewDirection, setReviewDirection] = useState('forward');
  const [reprocessing, setReprocessing] = useState(false);
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
      if (filterCat) params.set('categoria', filterCat);
      if (filterMonth) params.set('mes', filterMonth);
      params.set('revisado', 'true');
      params.set('limit', '10');
      params.set('offset', String(currentPage * 10));
      const res = await fetch(`/api/transacciones?${params.toString()}`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
        setSummary(data.summary || []);
        setBankTotals(data.bankTotals || []);
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
  }, [getHeaders, filterCat, filterMonth, page]);

  const refreshTable = useCallback(async () => {
    try {
      setPageLoading(true);
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
        setBankTotals(data.bankTotals || []);
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
      setGmailForwardingAuthorized(data.gmail_forwarding_authorized || false);
    } catch (e) {
      setAuthStatus(false);
      setGmailForwardingAuthorized(false);
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

  const handleReprocess = async () => {
    setReprocessing(true);
    setStatusMsg({ type: 'info', text: 'Reprocesando transacciones con IA...' });
    try {
      const res = await fetch('/api/transacciones/reprocesar', { method: 'POST', headers: getHeaders() });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      const skipped = result.skipped || 0;
      const msg = skipped > 0
        ? `Reprocesadas ${result.processed} de ${result.total} (${skipped} no encontradas en Gmail)`
        : `Reprocesadas ${result.processed} de ${result.total} transacciones`;
      setStatusMsg({ type: 'success', text: msg });
      await fetchPendientes();
      fetchTransactions();
      fetchMonths();
      fetchPendientesCount();
    } catch (e) {
      setStatusMsg({ type: 'error', text: `Error al reprocesar: ${e.message}` });
    } finally {
      setReprocessing(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchTransactions(false);
    fetchFilters();
    fetchConfig();
    fetchMonths();
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

  useEffect(() => {
    setPage(0);
    fetchTransactions(false, 0);
  }, [filterCat, filterMonth]);

  useEffect(() => {
    const handleOpenConfig = () => setShowConfigModal(true);
    const handleOpenFilters = () => setShowFilterModal(true);
    const handleOpenManual = () => setShowManualEntry(true);
    window.addEventListener('opencode:open-config', handleOpenConfig);
    window.addEventListener('opencode:open-filters', handleOpenFilters);
    window.addEventListener('opencode:open-manual', handleOpenManual);
    return () => {
      window.removeEventListener('opencode:open-config', handleOpenConfig);
      window.removeEventListener('opencode:open-filters', handleOpenFilters);
      window.removeEventListener('opencode:open-manual', handleOpenManual);
    };
  }, []);

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

  const handleDeleteTx = async (id) => {
    const txToDelete = transactions.find(t => t.id === id);
    await confirmDelete({
      title: '¿Eliminar transacción?',
      itemName: txToDelete ? `${txToDelete.comercio || 'Transacción'} - $${Math.abs(txToDelete.monto)}` : 'esta transacción',
      itemType: 'transacción',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/transacciones/${id}`, { method: 'DELETE', headers: getHeaders() });
          if (res.ok) {
            setTransactions(prev => prev.filter(tx => tx.id !== id));
            fetchTransactions();
            fetchMonths();
          }
        } catch (err) { console.error(err); }
        return Promise.resolve();
      }
    });
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
    const filterToDelete = filters.find(f => f.id === id);
    await confirmDelete({
      title: '¿Eliminar filtro?',
      itemName: filterToDelete ? filterToDelete.remitente : 'este filtro',
      itemType: 'filtro',
      message: 'Ya no se filtrarán emails de este remitente.',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/filtros/${id}`, { method: 'DELETE', headers: getHeaders() });
          if (res.ok) fetchFilters();
        } catch (err) { console.error(err); }
        return Promise.resolve();
      }
    });
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
      fetchMonths();
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
    setReviewTipoTransaccion(null);
    setShowReview(true);
    setReviewVisible(true);
  };

  const currentReviewTx = pendingTxs[reviewIdx] || null;

  if (gmailForwardingAuthorized === false) {
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
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Configura el reenvío de correos</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Para recibir tus transacciones automáticamente, configura el reenvío de notificaciones bancarias desde Gmail hacia tu casilla en Kuentas Klaras.
            </p>
            <button onClick={() => onOpenTutorial(authStatus)} className={`flex items-center justify-center gap-2 mx-auto ${theme.btnPrimary} text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition-all`}>
              <ExternalLink size={16} /> Ver tutorial paso a paso
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-in fade-in duration-500 space-y-6 px-4 sm:px-6 lg:px-8 pb-24">
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
        </div>
      </div>

      {loading && !pageLoading ? (
        <div className="grid portrait:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 animate-slide-fade">
          <div className="bg-white dark:bg-dark-normal rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter p-2.5 sm:p-3 space-y-2">
            <SkeletonBar w="65px" h="12px" />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5"><SkeletonBar w="100px" h="14px" className="rounded-full" /><div className="flex-1 h-2 skeleton rounded-full" /><SkeletonBar w="50px" h="10px" /></div>
              <div className="flex items-center gap-1.5"><SkeletonBar w="80px" h="14px" className="rounded-full" /><div className="flex-1 h-2 skeleton rounded-full" /><SkeletonBar w="45px" h="10px" /></div>
              <div className="flex items-center gap-1.5"><SkeletonBar w="90px" h="14px" className="rounded-full" /><div className="flex-1 h-2 skeleton rounded-full" /><SkeletonBar w="55px" h="10px" /></div>
            </div>
            <div className="border-t border-slate-100 dark:border-dark-lighter pt-1 flex justify-between">
              <SkeletonBar w="30px" h="10px" /><SkeletonBar w="55px" h="10px" />
            </div>
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white dark:bg-dark-normal rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter p-3 sm:p-4 space-y-3">
              <div className="flex items-center gap-3">
                <SkeletonBar w="32px" h="32px" className="rounded-full" />
                <SkeletonBar w="100px" h="14px" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between"><SkeletonBar w="50px" h="10px" /><SkeletonBar w="80px" h="10px" /></div>
                <div className="flex items-center justify-between"><SkeletonBar w="55px" h="10px" /><SkeletonBar w="80px" h="10px" /></div>
              </div>
              <div className="border-t border-slate-100 dark:border-dark-lighter pt-1.5 flex justify-between">
                <SkeletonBar w="35px" h="10px" /><SkeletonBar w="85px" h="10px" />
              </div>
            </div>
          ))}
        </div>
      ) : (summary.length > 0 || bankTotals.length > 0) ? (
        (() => {
        const bankTotalsMap = {};
        for (const row of bankTotals) {
          const bank = row.banco || 'Otros';
          if (!bankTotalsMap[bank]) bankTotalsMap[bank] = {};
          bankTotalsMap[bank][row.tipo_tarjeta] = { total: row.total, count: row.count };
        }
        const filteredSummary = summary.filter(s => !['Interno', 'No es Gasto', 'No es Ingreso'].includes(s.categoria));
        return (
          <div key={filterMonth + '-' + filterCat} className="animate-slide-fade grid portrait:grid-cols-1 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
            {filteredSummary.length > 0 && (
              <div className="bg-white dark:bg-dark-normal rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter p-2.5 sm:p-3">
                <div className="text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300 mb-1.5">Categorías</div>
                <div className="space-y-0.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                  {(() => {
                    const maxTotal = Math.max(...filteredSummary.map(s => s.total), 1);
                    return filteredSummary.map(s => (
                      <div key={s.categoria} className="flex items-center gap-1.5 text-[10px] sm:text-xs leading-tight">
                        <span {...catBadgeStyle(s.categoria)} className={`font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 w-28 sm:w-32 text-left leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${catBadgeStyle(s.categoria).className || ''}`}>{s.categoria}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-dark-lighter overflow-hidden">
                          <div {...catBarStyle(s.categoria)} className={`h-full rounded-full ${catBarStyle(s.categoria).className || ''}`} style={{ width: `${(s.total / maxTotal) * 100}%`, ...(catBarStyle(s.categoria).style || {}) }} />
                        </div>
                        <span className="font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">{formatCurrency(s.total)}</span>
                      </div>
                    ));
                  })()}



                </div>
                <div className="border-t border-slate-100 dark:border-dark-lighter mt-1 pt-1 flex items-center justify-between text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-200">
                  <span>Total</span>
                  <span>{formatCurrency(filteredSummary.reduce((acc, s) => acc + s.total, 0))}</span>
                </div>
              </div>
            )}
            {Object.entries(bankTotalsMap).map(([bank, tipos]) => {
              const totalBank = Object.values(tipos).reduce((acc, t) => acc + t.total, 0);
              const totalCount = Object.values(tipos).reduce((acc, t) => acc + t.count, 0);
              return (
                <div key={bank} className={`bg-white dark:bg-dark-normal rounded-xl sm:rounded-2xl shadow-lg border border-slate-200 dark:border-dark-lighter p-3 sm:p-4 ${BANK_ACCENT[bank] || ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {BANK_ICONS[bank] && <img src={BANK_ICONS[bank]} alt="" className={`w-8 h-8 rounded-full ${isDarkMode && bank === 'Banco de Chile' ? 'brightness-0 invert' : ''}`} />}
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
      })() ) : null }



      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
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
          <button onClick={handleOpenReview} className="flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800 transition-all">
            <Check size={14} />
            Pendientes <span className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-full text-[10px]">{pendientesCount}</span>
          </button>
          <button onClick={handleReprocess} disabled={reprocessing || pageLoading || loading} className="flex items-center justify-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-2 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-all disabled:opacity-50">
            <RefreshCw size={14} className={reprocessing ? 'animate-spin' : ''} /> Reprocesar
          </button>
        </div>
        <button onClick={refreshTable} disabled={pageLoading || loading} className="flex items-center justify-center gap-1.5 bg-white dark:bg-dark-normal hover:bg-slate-50 dark:hover:bg-dark-lighter text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-dark-lighter transition-all disabled:opacity-50">
          <RefreshCw size={14} className={pageLoading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-dark-lighter overflow-hidden">
        {loading && transactions.length === 0 ? (
          <div className="overflow-x-auto">
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
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50 dark:border-dark-lighter/50">
                    <td className="p-2 sm:p-4"><SkeletonBar w="68px" /></td>
                    <td className="p-2 sm:p-4"><SkeletonBar w="85px" /></td>
                    <td className="p-2 sm:p-4"><SkeletonBar w="130px" /></td>
                    <td className="p-2 sm:p-4 text-right"><span className="inline-flex justify-end w-full"><SkeletonBar w="70px" /></span></td>
                    <td className="p-2 sm:p-4 text-center hidden sm:table-cell"><span className="inline-flex justify-center w-full"><SkeletonBar w="55px" /></span></td>
                    <td className="p-2 sm:p-4 text-center hidden sm:table-cell"><span className="inline-flex justify-center w-full"><SkeletonBar w="65px" /></span></td>
                    <td className="p-2 sm:p-4 text-center"><span className="inline-flex justify-center gap-2 w-full"><SkeletonBar w="22px" h="22px" /><SkeletonBar w="22px" h="22px" /></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : transactions.length === 0 && !loading ? (
          <div className="text-center py-16">
            <Inbox size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-2">No hay transacciones clasificadas</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Presiona "Configurar" para importar correos bancarios anteriores y luego clasifícalas en Pendientes</p>
          </div>
        ) : (
          <>
            <div className={`animate-slide-fade overflow-x-auto relative ${pageLoading ? 'opacity-60 pointer-events-none transition-opacity duration-150' : ''}`}>
              {pageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Loader2 size={28} className="animate-spin text-slate-400 dark:text-slate-500" />
                </div>
              )}
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
                    <tr key={tx.id} className={`border-b border-slate-50 dark:border-dark-lighter/50 transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-dark-normal' : 'bg-slate-50/30 dark:bg-dark-lighter/10'} ${isMuted ? 'italic' : ''}`}>
                      <td className={`p-2 sm:p-4 text-xs sm:text-sm font-bold whitespace-nowrap ${isMuted ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'}`}>{formatDate(tx.fecha)}</td>
                      <td className="p-2 sm:p-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${isMuted ? 'bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500' : BANK_COLORS[tx.banco] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {BANK_ICONS[tx.banco] && <img src={BANK_ICONS[tx.banco]} alt="" className={`w-4 h-4 rounded-full ${isMuted ? 'opacity-50' : ''} ${isDarkMode && tx.banco === 'Banco de Chile' ? 'brightness-0 invert' : ''}`} />}
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
                        <span {...catBadgeStyle(tx.categoria)} className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${catBadgeStyle(tx.categoria).className || ''}`}>{tx.categoria}</span>
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
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {startPage > 0 && (
                      <>
                        <button onClick={() => { setPage(0); fetchTransactions(true, 0); }} className="w-8 h-8 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter transition-all">1</button>
                        {startPage > 1 && <span className="px-1 text-slate-400 text-xs">…</span>}
                      </>
                    )}
                    {pages.map(p => (
                      <button key={p} onClick={() => { setPage(p); fetchTransactions(true, p); }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
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
                        <button onClick={() => { const lp = totalPages - 1; setPage(lp); fetchTransactions(true, lp); }} className="w-8 h-8 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter transition-all">{totalPages}</button>
                      </>
                    )}
                  </div>
                  <button onClick={() => { const newP = page + 1; setPage(newP); fetchTransactions(true, newP); }} disabled={(page + 1) * 10 >= totalCount}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                    Siguiente
                  </button>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {lastCheck > 0 && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
          Ultima revision: {new Date(lastCheck).toLocaleString('es-CL')}
        </p>
      )}

      <button
        onClick={() => setShowManualEntry(true)}
        className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-40 ${theme.btnPrimary} text-white px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${theme.shadowBtn}`}
      >
        <Plus size={20} /> Ingreso Manual
      </button>

      {/* Edit Transaction Modal */}
      {showEditModal && editingTx && (
        <div className={`fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md ${showReview ? 'z-[60]' : 'z-50'} flex items-center justify-center p-3 sm:p-4`}>
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
                {onCreateCategoria && (
                  <button
                    onClick={() => {
                      const name = prompt('Nombre de la nueva categoría:');
                      if (name) onCreateCategoria({ nombre: name, tipo: 'gasto' }).then(c => setEditCategoria(c.nombre)).catch(e => alert(e.message));
                    }}
                    className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-all"
                  >
                    <Plus size={12} /> Nueva categoría
                  </button>
                )}
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
        <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
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
        <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
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
                Configura un filtro en Gmail para reenviar las notificaciones bancarias automáticamente.
              </p>
              <button onClick={() => onOpenTutorial(authStatus)} className={`flex items-center justify-center gap-2 w-full ${theme.btnPrimary} text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg transition-all`}>
                <ExternalLink size={16} /> Ver tutorial paso a paso
              </button>
            </div>
          </div>
        </div>
      )}

        </div>

      {/* Review Panel - Full Screen */}
      {showReview && currentReviewTx && (
        <div className={`fixed inset-0 bg-white/60 dark:bg-zinc-900/80 z-50 flex items-center justify-center p-0 sm:p-4 transition-all duration-300 ${reviewVisible ? 'opacity-100 backdrop-blur-md' : 'opacity-0 invisible'}`}>
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
        onCreated={() => { fetchTransactions(); fetchMonths(); }}
        theme={theme}
        token={token}
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
    </>
  );
};

export default Transacciones;
