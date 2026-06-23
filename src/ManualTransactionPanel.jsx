import React, { useState, useRef, useEffect } from 'react';
import {
  X, Check, Loader2, Plus, ChevronLeft, ChevronRight,
  Zap, CalendarDays, CalendarRange, ShoppingCart, TrendingUp
} from 'lucide-react';
import {
  CATEGORY_LIST, CATEGORY_COLORS, CATEGORY_ICON_BG,
  CATEGORY_ICON_COLOR, CATEGORY_EMOJI, BANK_ICONS
} from './constants.js';

const ManualTransactionPanel = ({ show, onClose, onCreated, theme, token }) => {
  const [tipo, setTipo] = useState('gasto');
  const [monto, setMonto] = useState('');
  const [comercio, setComercio] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [banco, setBanco] = useState('');
  const [tipoTarjeta, setTipoTarjeta] = useState('');
  const [categoria, setCategoria] = useState('Otros');
  const [tipoGasto, setTipoGasto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
  }, [show]);

  const resetForm = () => {
    setTipo('gasto');
    setMonto('');
    setComercio('');
    setFecha(new Date().toISOString().slice(0, 10));
    setBanco('');
    setTipoTarjeta('');
    setCategoria('Otros');
    setTipoGasto(null);
    setError('');
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      resetForm();
      onClose();
    }, 250);
  };

  const handleConfirm = async () => {
    if (!monto || parseFloat(monto) === 0) {
      setError('Ingresa un monto válido');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/transacciones/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo_transaccion: tipo,
          monto: parseFloat(monto),
          comercio: comercio || 'Ingreso manual',
          fecha,
          banco: banco || null,
          tipo_tarjeta: tipoTarjeta || null,
          categoria,
          tipo_gasto: tipo === 'gasto' ? tipoGasto : null
        })
      });
      const data = await res.json();
      if (res.ok) {
        setVisible(false);
        setTimeout(() => {
          resetForm();
          if (typeof onCreated === 'function') onCreated();
          onClose();
        }, 250);
      } else {
        setError(data.error || 'Error al guardar');
      }
    } catch (err) {
      setError('Error de red al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmNoEs = async () => {
    if (!monto || parseFloat(monto) === 0) {
      setError('Ingresa un monto válido');
      return;
    }
    setSaving(true);
    setError('');
    const newType = tipo === 'gasto' ? 'no_es_gasto' : 'no_es_ingreso';
    const newCat = tipo === 'gasto' ? 'No es Gasto' : 'No es Ingreso';
    try {
      const res = await fetch('/api/transacciones/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo_transaccion: newType,
          monto: parseFloat(monto),
          comercio: comercio || 'Ingreso manual',
          fecha,
          banco: banco || null,
          tipo_tarjeta: tipoTarjeta || null,
          categoria: newCat,
          tipo_gasto: null
        })
      });
      const data = await res.json();
      if (res.ok) {
        setVisible(false);
        setTimeout(() => {
          resetForm();
          if (typeof onCreated === 'function') onCreated();
          onClose();
        }, 250);
      } else {
        setError(data.error || 'Error al guardar');
      }
    } catch (err) {
      setError('Error de red al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  const isGasto = tipo === 'gasto';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
      <div
        className={`w-full max-w-md mx-auto max-h-screen sm:max-h-[90vh] flex flex-col bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b border-slate-200 dark:border-dark-lighter bg-slate-50 dark:bg-dark-lighter">
          <button onClick={handleClose} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white transition-all px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-dark-lightest">
            <X size={18} /> <span className="text-xs font-bold">Cancelar</span>
          </button>
          <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Plus size={16} /> Ingreso Manual
          </h3>
        </div>

        <div className="flex-1 px-4 py-4 overflow-y-scroll no-scrollbar flex flex-col gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTipo('gasto')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                tipo === 'gasto'
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/50 shadow-sm'
                  : 'bg-slate-100 dark:bg-dark-lighter border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-dark-lightest'
              }`}
            >
              <ShoppingCart size={14} /> Gasto
            </button>
            <button
              onClick={() => setTipo('ingreso')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                tipo === 'ingreso'
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/50 shadow-sm'
                  : 'bg-slate-100 dark:bg-dark-lighter border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-dark-lightest'
              }`}
            >
              <TrendingUp size={14} /> Ingreso
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1 block">Monto *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">$</span>
              <input
                type="number"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="0"
                className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1 block">Comercio</label>
              <input
                value={comercio}
                onChange={e => setComercio(e.target.value)}
                placeholder="Ej: Starbucks"
                className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1 block">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1 block">Banco</label>
              <select
                value={banco}
                onChange={e => setBanco(e.target.value)}
                className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200"
              >
                <option value="">—</option>
                {Object.keys(BANK_ICONS).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1 block">Tipo tarjeta</label>
              <select
                value={tipoTarjeta}
                onChange={e => setTipoTarjeta(e.target.value)}
                className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200"
              >
                <option value="">—</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">Categoría</label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[categoria] || CATEGORY_COLORS['Otros']}`}>{categoria}</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => sliderRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                className="flex-shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-dark-lightest transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <div ref={sliderRef} className="flex-1 flex gap-1.5 overflow-x-scroll no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {CATEGORY_LIST.map(cat => {
                  const selected = categoria === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoria(cat)}
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
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {isGasto && (
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-2 block px-1">Frecuencia</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'variable', label: 'Variable', icon: Zap, color: 'text-amber-600 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-500/20', border: 'border-amber-300 dark:border-amber-500/50' },
                  { key: 'mensual', label: 'Mensual', icon: CalendarDays, color: 'text-sky-600 dark:text-sky-300', bg: 'bg-sky-100 dark:bg-sky-500/20', border: 'border-sky-300 dark:border-sky-500/50' },
                  { key: 'anual', label: 'Anual', icon: CalendarRange, color: 'text-violet-600 dark:text-violet-300', bg: 'bg-violet-100 dark:bg-violet-500/20', border: 'border-violet-300 dark:border-violet-500/50' },
                ].map(opt => {
                  const selected = tipoGasto === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setTipoGasto(tipoGasto === opt.key ? null : opt.key)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                        selected
                          ? `${opt.bg} ${opt.color} ${opt.border} shadow-sm`
                          : 'bg-slate-100 dark:bg-dark-lighter border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-dark-lightest'
                      }`}
                    >
                      <opt.icon size={13} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-3 py-2 rounded-xl text-xs font-bold">{error}</div>
          )}
        </div>

        <div className="flex-shrink-0 px-4 py-3 space-y-2 border-t border-slate-200 dark:border-dark-lighter bg-slate-50 dark:bg-dark-lighter">
          <button
            onClick={handleConfirm}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-2.5 ${theme.btnPrimary} text-white rounded-xl font-bold text-sm shadow-lg transition-all disabled:opacity-50 active:scale-95`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {isGasto ? 'Confirmar gasto' : 'Confirmar ingreso'}
          </button>
          <button
            onClick={handleConfirmNoEs}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all disabled:opacity-50"
          >
            {isGasto ? 'No es Gasto' : 'No es Ingreso'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualTransactionPanel;
