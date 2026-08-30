import React, { useState, useRef, useEffect } from 'react';
import {
  X, Check, Loader2, Plus, Zap, CalendarDays, CalendarRange, ShoppingCart, TrendingUp,
} from 'lucide-react';
import {
  CATEGORY_LIST, CATEGORY_EMOJI, CATEGORY_HEX, CATEGORY_ICON_MAP, CATEGORY_RING_COLOR,
  BANK_ICONS, hexToRgba,
} from './constants.js';

const ManualTransactionPanel = ({ show, onClose, onCreated, theme, token, isDarkMode }) => {
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
  const inputClass = `w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-3.5 py-3 text-sm font-bold outline-none ${theme.focusBorder} transition text-slate-800 dark:text-slate-200`;

  return (
    <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
      <div
        className={`w-full max-w-md mx-auto max-h-screen sm:max-h-[90vh] flex flex-col bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-3xl shadow-2xl overflow-hidden transition duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="relative flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
          <button onClick={handleClose} aria-label="Cancelar" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition active:scale-90">
            <X size={16} />
          </button>
          <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Plus size={15} /> Ingreso manual
          </h3>
          <span className="w-9" />
        </div>

        <div className="flex-1 px-5 py-1 overflow-y-scroll no-scrollbar flex flex-col gap-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

          <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1 gap-1">
            <button
              onClick={() => setTipo('gasto')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                isGasto ? 'bg-white dark:bg-dark-lighter shadow-sm text-amber-600 dark:text-amber-300' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <ShoppingCart size={13} /> Gasto
            </button>
            <button
              onClick={() => setTipo('ingreso')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                !isGasto ? 'bg-white dark:bg-dark-lighter shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              <TrendingUp size={13} /> Ingreso
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">Monto *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-slate-400">$</span>
              <input
                type="number"
                value={monto}
                onChange={e => setMonto(e.target.value)}
                placeholder="0"
                className={`${inputClass} pl-8 text-lg`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">Comercio</label>
              <input
                value={comercio}
                onChange={e => setComercio(e.target.value)}
                placeholder="Ej: Starbucks"
                className={inputClass}
              />
            </div>
            <div className="min-w-0">
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className={`${inputClass} min-w-0 [color-scheme:light] dark:[color-scheme:dark]`}
                style={{ paddingLeft: '10px', paddingRight: '8px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">Banco</label>
              <select
                value={banco}
                onChange={e => setBanco(e.target.value)}
                className={inputClass}
              >
                <option value="">—</option>
                {Object.keys(BANK_ICONS).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">Tipo tarjeta</label>
              <select
                value={tipoTarjeta}
                onChange={e => setTipoTarjeta(e.target.value)}
                className={inputClass}
              >
                <option value="">—</option>
                <option value="Débito">Débito</option>
                <option value="Crédito">Crédito</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-0.5">
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500">Categoría</label>
              <span className="text-xs font-black text-slate-500 dark:text-slate-400">{categoria}</span>
            </div>
            <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-0.5 pt-2 pb-2.5" style={{ scrollbarWidth: 'none' }}>
              {CATEGORY_LIST.map(cat => {
                const selected = categoria === cat;
                const hex = CATEGORY_HEX[cat] || CATEGORY_HEX['Otros'];
                const CatIcon = CATEGORY_ICON_MAP[cat];
                const ringClass = CATEGORY_RING_COLOR[cat] || 'ring-slate-400 dark:ring-slate-300/60';
                return (
                  <button key={cat} onClick={() => setCategoria(cat)} className="flex-shrink-0 flex flex-col items-center gap-1.5">
                    <span
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl leading-none transition duration-200 ${
                        selected
                          ? `scale-110 shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-normal ${ringClass}`
                          : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500'
                      }`}
                      style={selected ? { backgroundColor: hexToRgba(hex, isDarkMode ? 0.22 : 0.16), color: hex } : {}}
                    >
                      {CatIcon ? <CatIcon size={20} strokeWidth={selected ? 2.3 : 1.8} /> : CATEGORY_EMOJI[cat]}
                    </span>
                    <span className={`text-[10px] leading-tight text-center whitespace-nowrap transition ${selected ? 'font-black text-slate-700 dark:text-slate-200' : 'font-bold text-slate-400 dark:text-slate-500'}`}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {isGasto && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-wide text-slate-400 dark:text-slate-500 px-0.5">Frecuencia</label>
              <div className="flex bg-slate-100 dark:bg-white/5 rounded-2xl p-1 gap-1">
                {[
                  { key: 'variable', label: 'Variable', icon: Zap, color: 'text-amber-600 dark:text-amber-300' },
                  { key: 'mensual', label: 'Mensual', icon: CalendarDays, color: 'text-sky-600 dark:text-sky-300' },
                  { key: 'anual', label: 'Anual', icon: CalendarRange, color: 'text-violet-600 dark:text-violet-300' },
                ].map(opt => {
                  const selected = tipoGasto === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setTipoGasto(tipoGasto === opt.key ? null : opt.key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 ${
                        selected ? `bg-white dark:bg-dark-lighter shadow-sm ${opt.color}` : 'text-slate-400 dark:text-slate-500'
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
            <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 px-3.5 py-2.5 rounded-2xl text-xs font-bold">{error}</div>
          )}

          <div className="pb-1" />
        </div>

        <div className="flex-shrink-0 px-5 pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))] space-y-2 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-dark-normal/70 backdrop-blur-xl">
          <button
            onClick={handleConfirm}
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-3 ${theme.btnPrimary} text-white rounded-2xl font-bold text-sm shadow-lg transition disabled:opacity-50 active:scale-95`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {isGasto ? 'Confirmar gasto' : 'Confirmar ingreso'}
          </button>
          <button
            onClick={handleConfirmNoEs}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition disabled:opacity-50"
          >
            {isGasto ? 'No es Gasto' : 'No es Ingreso'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualTransactionPanel;
