import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Mail, RefreshCw, Trash2, ExternalLink, Loader2, Inbox, Filter,
  Settings2, Plus, X, Edit3, Check, ChevronLeft, ChevronRight,
  Utensils, Bus, Wrench, Clapperboard, HeartPulse, Home, ShoppingBag,
  MoreHorizontal, ArrowRight, Zap, CalendarDays, CalendarRange, Ban,
  Banknote, TrendingUp, Wallet, Clock, Save
} from 'lucide-react';

const CATEGORY_COLORS = {
  'Alimentos': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Transporte': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'Servicios': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Entretención': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Salud': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Hogar': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'Compras Generales': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'Otros': 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300',
};

const CATEGORY_BAR_COLORS = {
  'Alimentos': 'bg-orange-400 dark:bg-orange-500',
  'Transporte': 'bg-blue-400 dark:bg-blue-500',
  'Servicios': 'bg-yellow-400 dark:bg-yellow-500',
  'Entretención': 'bg-purple-400 dark:bg-purple-500',
  'Salud': 'bg-green-400 dark:bg-green-500',
  'Hogar': 'bg-rose-400 dark:bg-rose-500',
  'Compras Generales': 'bg-pink-400 dark:bg-pink-500',
  'Otros': 'bg-slate-400 dark:bg-slate-500',
};

const CATEGORY_ICONS = {
  'Alimentos': Utensils,
  'Transporte': Bus,
  'Servicios': Wrench,
  'Entretención': Clapperboard,
  'Salud': HeartPulse,
  'Hogar': Home,
  'Compras Generales': ShoppingBag,
  'Otros': MoreHorizontal,
};

const CATEGORY_SOLID = {
  'Alimentos': 'bg-orange-500 dark:bg-orange-400',
  'Transporte': 'bg-blue-500 dark:bg-blue-400',
  'Servicios': 'bg-yellow-500 dark:bg-yellow-400',
  'Entretención': 'bg-purple-500 dark:bg-purple-400',
  'Salud': 'bg-green-500 dark:bg-green-400',
  'Hogar': 'bg-rose-500 dark:bg-rose-400',
  'Compras Generales': 'bg-pink-500 dark:bg-pink-400',
  'Otros': 'bg-slate-500 dark:bg-slate-400',
};

const CATEGORY_LIST = ['Alimentos', 'Transporte', 'Servicios', 'Entretención', 'Salud', 'Hogar', 'Compras Generales', 'Otros'];

const BANK_COLORS = {
  'BCI': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Santander': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'Banco de Chile': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
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
  const [newFilterRemitente, setNewFilterRemitente] = useState('');
  const [newFilterAsunto, setNewFilterAsunto] = useState('');
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
  const [reviewTipoTransaccion, setReviewTipoTransaccion] = useState('gasto');
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
    setStatusMsg(null);
    try {
      const res = await fetch('/api/transacciones/revisar', { method: 'POST', headers: getHeaders() });
      const data = await res.json();
      if (data.needsReauth) {
        setStatusMsg({ type: 'error', text: `✗ ${data.message || 'Vuelve a autorizar Gmail'}` });
        fetchStatus();
      } else if (res.ok && !data.error) {
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
    } catch (err) {
      setStatusMsg({ type: 'error', text: `✗ ${err.message}` });
    } finally {
      setChecking(false);
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
        if (data.updatedCount > 0) {
          setStatusMsg({ type: 'success', text: `✓ Categoría aplicada a ${data.updatedCount + 1} transacciones` });
          setTimeout(() => setStatusMsg(null), 4000);
        }
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
      setStatusMsg({ type: 'success', text: '✓ No hay transacciones pendientes' });
      setTimeout(() => setStatusMsg(null), 4000);
      return;
    }
    const first = txs[0];
    setReviewIdx(0);
    setReviewCat(first.categoria || 'Otros');
    setReviewTipoGasto(first.tipo_gasto || null);
    setReviewTipoTransaccion(first.tipo_transaccion || 'gasto');
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
    setReviewSaving(true);
    const tx = pendingTxs[reviewIdx];
    if (!tx) { setReviewSaving(false); return; }
    try {
      await fetch(`/api/transacciones/${tx.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({
          categoria: reviewCat,
          tipo_gasto: reviewTipoTransaccion === 'gasto' ? reviewTipoGasto : null,
          tipo_transaccion: reviewTipoTransaccion,
          revisado: true
        })
      });
      const remaining = pendingTxs.length - 1;
      setPendientesCount(remaining);
      if (reviewIdx >= pendingTxs.length - 1) {
        setReviewVisible(false);
        setTimeout(() => {
          setShowReview(false);
          setPendingTxs([]);
          fetchTransactions();
          fetchMonths();
        }, 200);
      } else {
        const nextIdx = reviewIdx + 1;
        setReviewDirection('forward');
        setReviewIdx(nextIdx);
        const next = pendingTxs[nextIdx];
        setReviewCat(next.categoria || 'Otros');
        setReviewTipoGasto(next.tipo_gasto || null);
        setReviewTipoTransaccion(next.tipo_transaccion || 'gasto');
      }
    } catch (err) { console.error(err); }
    setReviewSaving(false);
  };

  const handleSkipReview = () => {
    if (reviewIdx >= pendingTxs.length - 1) {
      setReviewVisible(false);
      setTimeout(() => {
        setShowReview(false);
        setPendingTxs([]);
      }, 200);
    } else {
      const nextIdx = reviewIdx + 1;
      setReviewDirection('forward');
      setReviewIdx(nextIdx);
      const next = pendingTxs[nextIdx];
      setReviewCat(next.categoria || 'Otros');
      setReviewTipoGasto(next.tipo_gasto || null);
      setReviewTipoTransaccion(next.tipo_transaccion || 'gasto');
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
          {pendientesCount > 0 && (
            <button onClick={handleOpenReview} className="flex items-center justify-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-2 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-800 transition-all">
              <Check size={14} />
              Pendientes <span className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-full text-[10px]">{pendientesCount}</span>
            </button>
          )}
          <button onClick={() => setShowFilterModal(true)} className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all">
            <Settings2 size={14} /> <span className="hidden sm:inline">Reglas</span>
          </button>
          <button onClick={handleCheckEmails} disabled={checking} className={`flex items-center justify-center gap-2 ${theme.btnPrimary} text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg ${theme.shadowBtn} transition-all disabled:opacity-50`}>
            {checking ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            <span className="hidden sm:inline">Revisar correos</span><span className="sm:hidden">Revisar</span>
          </button>
        </div>
      </div>

      {(summary.length > 0 || transactions.filter(tx => tx.tipo_tarjeta).length > 0) && (() => {
        const bankTotals = {};
        for (const tx of transactions) {
          if (!tx.tipo_tarjeta) continue;
          const bank = tx.banco || 'Otros';
          if (!bankTotals[bank]) bankTotals[bank] = {};
          const tipo = tx.tipo_tarjeta;
          if (!bankTotals[bank][tipo]) bankTotals[bank][tipo] = { total: 0, count: 0 };
          bankTotals[bank][tipo].total += tx.monto;
          bankTotals[bank][tipo].count += 1;
        }
        return (
          <div key={filterMonth + '-' + filterCat} className="animate-slide-fade grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
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
            <p className="text-xs text-slate-400 dark:text-slate-500">Presiona "Revisar correos" para buscar notificaciones bancarias y luego clasifícalas en Pendientes</p>
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
                  {transactions.map((tx, idx) => (
                    <tr key={tx.id} onClick={() => handleEditTx(tx)} className={`border-b border-slate-50 dark:border-dark-lighter/50 transition-colors hover:bg-slate-50/50 dark:hover:bg-dark-lighter/30 cursor-pointer ${idx % 2 === 0 ? 'bg-white dark:bg-dark-normal' : 'bg-slate-50/30 dark:bg-dark-lighter/10'}`}>
                      <td className="p-2 sm:p-4 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatDate(tx.fecha)}</td>
                      <td className="p-2 sm:p-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full ${BANK_COLORS[tx.banco] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                          {BANK_ICONS[tx.banco] && <img src={BANK_ICONS[tx.banco]} alt="" className="w-4 h-4 rounded-full" />}
                          {tx.banco || '-'}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{tx.comercio || '-'}</td>
                      <td className="p-2 sm:p-4 text-xs sm:text-sm font-black text-right text-slate-700 dark:text-slate-200">{formatCurrency(tx.monto)}</td>
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
                        <button onClick={(e) => { e.stopPropagation(); handleEditTx(tx); }} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Editar"><Edit3 size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteTx(tx.id); }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Eliminar"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
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
              Define que correos revisar. Gmail buscara solo los que coincidan con el remitente y asunto indicados.
            </p>
            <div className="mb-4 p-3 sm:p-4 bg-slate-50 dark:bg-dark-lighter rounded-xl">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Dias hacia atras</label>
              <div className="flex items-center gap-2">
                <input type="number" min="1" max="999" value={diasAtras} onChange={e => setDiasAtras(parseInt(e.target.value) || 3)} className="flex-1 bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200" />
                <button type="button" onClick={handleSaveConfig} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex-shrink-0">Guardar</button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">Cuantos dias hacia atras revisar en Gmail (max. 999)</p>
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

      {/* Review Panel - Full Screen */}
      {showReview && currentReviewTx && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-0 sm:p-4 transition-opacity duration-300" style={{ opacity: reviewVisible ? 1 : 0 }}>
          <div
            key={`panel-${reviewIdx}-${reviewDirection}`}
            className={`w-full max-w-md mx-auto max-h-screen sm:max-h-[90vh] flex flex-col bg-slate-900/70 border border-slate-700/50 sm:rounded-3xl shadow-2xl backdrop-blur-md transition-all duration-300 ease-out ${
              reviewVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            } ${reviewDirection === 'forward' ? 'animate-in slide-in-from-right-4' : 'animate-in slide-in-from-left-4'}`}
          >
            <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-slate-800/50">
              <button onClick={handleCloseReview} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-all px-2 py-1.5 rounded-lg hover:bg-slate-800/50">
                <X size={18} /> <span className="text-xs font-bold">Salir</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-300 tabular-nums">{reviewIdx + 1} <span className="text-slate-600">/</span> {pendingTxs.length}</span>
              </div>
            </div>

            <div className="w-full bg-slate-800/30 h-0.5 flex-shrink-0">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500 ease-out" style={{ width: `${((reviewIdx + 1) / pendingTxs.length) * 100}%` }} />
            </div>

            <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
              {/* Transaction Card */}
              <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 text-center space-y-2 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-2">
                  {BANK_ICONS[currentReviewTx.banco] && (
                    <img src={BANK_ICONS[currentReviewTx.banco]} alt="" className="w-8 h-8 rounded-full shadow-lg" />
                  )}
                  <span className="text-sm font-bold text-slate-300">{currentReviewTx.banco || 'Banco'}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {formatCurrency(currentReviewTx.monto)}
                </div>
                <div className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1.5">
                  <span>{formatDate(currentReviewTx.fecha)}</span>
                  {formatTime(currentReviewTx.fecha_extraccion) && (
                    <>
                      <span className="text-slate-600">·</span>
                      <Clock size={11} className="text-slate-500" />
                      <span className="tabular-nums">{formatTime(currentReviewTx.fecha_extraccion)}</span>
                    </>
                  )}
                </div>
                <div className="text-base font-bold text-white">
                  {currentReviewTx.comercio || 'Comercio no detectado'}
                </div>
                {currentReviewTx.tipo_tarjeta && (
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    currentReviewTx.tipo_tarjeta === 'Débito' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-orange-900/40 text-orange-300'
                  }`}>{currentReviewTx.tipo_tarjeta}</span>
                )}
              </div>

              {/* Category Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <label className="text-[10px] font-black uppercase text-slate-500">Categoria</label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[reviewCat] || CATEGORY_COLORS['Otros']}`}>{reviewCat}</span>
                </div>
                <div ref={reviewSliderRef} className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                  {CATEGORY_LIST.map(cat => {
                    const Icon = CATEGORY_ICONS[cat];
                    const selected = reviewCat === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setReviewCat(cat)}
                        className={`flex flex-col items-center gap-1 flex-shrink-0 px-2.5 py-2 rounded-xl transition-all duration-200 ${
                          selected
                            ? `bg-amber-500/20 border border-amber-500/50 shadow-lg shadow-amber-500/10`
                            : 'bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50'
                        }`}
                      >
                        <Icon size={16} className={selected ? 'text-amber-400' : 'text-slate-400'} />
                        <span className={`text-[8px] font-bold whitespace-nowrap leading-none ${selected ? 'text-amber-300' : 'text-slate-500'}`}>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de transaccion: Gasto / Ingreso / Interno */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-1.5 block px-1">Tipo de transaccion</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: 'gasto', label: 'Gasto', icon: Banknote, color: 'amber' },
                    { key: 'ingreso', label: 'Ingreso', icon: TrendingUp, color: 'emerald' },
                    { key: 'interno', label: 'Interno', icon: Ban, color: 'red' },
                  ].map(tipo => {
                    const selected = reviewTipoTransaccion === tipo.key;
                    return (
                      <button
                        key={tipo.key}
                        onClick={() => {
                          setReviewTipoTransaccion(tipo.key);
                          if (tipo.key !== 'gasto') setReviewTipoGasto(null);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                          selected
                            ? tipo.key === 'gasto' ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/10' :
                              tipo.key === 'ingreso' ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10' :
                              'bg-red-500/20 border border-red-500/50 text-red-300 shadow-lg shadow-red-500/10'
                            : 'bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:border-slate-600/50'
                        }`}
                      >
                        <tipo.icon size={13} />
                        {tipo.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tipo de gasto: solo si es gasto */}
              {reviewTipoTransaccion === 'gasto' && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-1.5 block px-1">Frecuencia</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: 'variable', label: 'Variable', icon: Zap },
                      { key: 'mensual', label: 'Mensual', icon: CalendarDays },
                      { key: 'anual', label: 'Anual', icon: CalendarRange },
                    ].map(tipo => {
                      const selected = reviewTipoGasto === tipo.key;
                      return (
                        <button
                          key={tipo.key}
                          onClick={() => setReviewTipoGasto(reviewTipoGasto === tipo.key ? null : tipo.key)}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                            selected
                              ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10'
                              : 'bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:border-slate-600/50'
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
            </div>

            {/* Bottom Actions - siempre justo debajo del contenido */}
            <div className="flex-shrink-0 px-4 py-3 space-y-2 border-t border-slate-800/50 bg-slate-900/40">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevReview}
                  disabled={reviewIdx === 0}
                  className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  title="Anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleConfirmReview}
                  disabled={reviewSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {reviewSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Confirmar
                </button>
                <button
                  onClick={handleSkipReview}
                  className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-slate-200 transition-all"
                  title="Siguiente"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <button
                onClick={handleEditReviewTx}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-slate-800/40 border border-slate-700/30 text-slate-400 hover:text-slate-200 transition-all"
              >
                <Edit3 size={12} /> Editar datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transacciones;
