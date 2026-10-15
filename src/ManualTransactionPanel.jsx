import React, { useState } from 'react';
import { marcarCambioTx } from './lib/txFresco.js';
import {
  Loader2, Plus, CalendarDays, ShoppingCart, TrendingUp, Check,
} from 'lucide-react';
import {
  CATEGORY_LIST, CATEGORY_EMOJI, CATEGORY_HEX, CATEGORY_RING_COLOR,
  hexToRgba,
} from './constants.js';
import { notifyOk, notifyError } from './lib/notify.js';
import { useFilaHorizontal } from './hooks/useFilaHorizontal.js';
import { Hoja, Grupo, Seccion, Fila, FilaCampo, Pastilla, Segmentado, SelectorBanco, fondoDe, filtrarBancos, bancosParaTransacciones } from './components/HojaFormulario.jsx';
import { BANCOS_CHILE } from './constants/dashboard.js';

const SALIDA_MS = 320;
// Misma lista de bancos que el resto de la app.
const BANCOS = bancosParaTransacciones(BANCOS_CHILE);

const ManualTransactionPanel = ({ show, onClose, onCreated, theme, token, isDarkMode }) => {
  const [tipo, setTipo] = useState('gasto');
  const [monto, setMonto] = useState('');
  const [comercio, setComercio] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [banco, setBanco] = useState('');
  const [tipoTarjeta, setTipoTarjeta] = useState('');
  const [categoria, setCategoria] = useState('Otros');
  // Al abrir el panel la fila arranca sobre la categoria preseleccionada.
  const filaCategorias = useFilaHorizontal(show ? 'abierto' : undefined);
  const [tipoGasto, setTipoGasto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [bancoBusqueda, setBancoBusqueda] = useState('');
  // Salida animada: { guardado } mientras la hoja sale; se desmonta al terminar.
  const [saliendo, setSaliendo] = useState(null);

  const salir = (guardado, despues) => {
    setSaliendo({ guardado });
    setTimeout(() => {
      resetForm();
      setSaliendo(null);
      if (typeof despues === 'function') despues();
      onClose();
    }, SALIDA_MS);
  };

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
    setBancoBusqueda('');
  };

  const handleClose = () => {
    if (saliendo) return;
    salir(false);
  };

  const handleConfirm = async () => {
    if (!monto || parseFloat(monto) === 0) {
      setError('Ingresa un monto válido');
      return;
    }
    setSaving(true);
    setError('');
    try {
      marcarCambioTx();
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
        notifyOk('Transacción guardada', `${comercio || 'Ingreso manual'} · $${new Intl.NumberFormat('es-CL').format(Math.abs(parseFloat(monto) || 0))}`);
        salir(true, onCreated);
      } else {
        // La validacion del formulario sigue inline; el fallo al guardar sale
        // como toast porque el panel se cierra al terminar.
        notifyError('No se pudo guardar', data.error || 'Intenta de nuevo.');
      }
    } catch (err) {
      notifyError('Error de red', 'No se pudo guardar la transacción.');
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
      marcarCambioTx();
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
        notifyOk('Transacción guardada', `${comercio || 'Ingreso manual'} · $${new Intl.NumberFormat('es-CL').format(Math.abs(parseFloat(monto) || 0))}`);
        salir(true, onCreated);
      } else {
        // La validacion del formulario sigue inline; el fallo al guardar sale
        // como toast porque el panel se cierra al terminar.
        notifyError('No se pudo guardar', data.error || 'Intenta de nuevo.');
      }
    } catch (err) {
      notifyError('Error de red', 'No se pudo guardar la transacción.');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  const isGasto = tipo === 'gasto';
  // Ingreso en verde; gasto en el color del tema.
  const fondoHero = isGasto ? fondoDe(theme.btnPrimary) : 'bg-emerald-600';
  const animTarjeta = saliendo
    ? { animation: `${saliendo.guardado ? 'kkModalGuardado' : 'kkModalCierre'} ${SALIDA_MS}ms cubic-bezier(0.4, 0, 0.9, 0.6) forwards` }
    : undefined;
  const animFondo = saliendo
    ? { animation: `kkModalScrimOut ${SALIDA_MS}ms ease-in forwards` }
    : { animation: 'kkModalScrimIn 300ms ease-out' };

  return (
    <Hoja
      onSubmit={(e) => { e.preventDefault(); if (!saving && !saliendo) handleConfirm(); }}
      onClose={handleClose}
      icono={Plus}
      titulo="Ingreso manual"
      subtitulo={isGasto ? 'Registra un gasto' : 'Registra un ingreso'}
      tono={`${theme.bgModalLight} ${theme.tabText}`}
      zClase="z-50"
      estiloFondo={animFondo}
      estiloTarjeta={animTarjeta}
      pie={(
        <>
          <button
            type="button"
            onClick={handleConfirmNoEs}
            disabled={saving}
            className="flex-1 min-h-[54px] rounded-[18px] bg-white/70 dark:bg-white/[0.06] border border-white/80 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-extrabold transition active:scale-[0.98] disabled:opacity-50"
          >
            {isGasto ? 'No es gasto' : 'No es ingreso'}
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`flex-[2] min-h-[54px] rounded-[18px] ${isGasto ? theme.btnPrimary : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-[15px] font-extrabold flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98] disabled:opacity-60`}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={2.6} />}
            {isGasto ? 'Guardar gasto' : 'Guardar ingreso'}
          </button>
        </>
      )}
    >
      <label className={`rounded-3xl p-[18px] ${fondoHero} text-white flex flex-col gap-1.5 transition-colors duration-300`}>
        <span className="text-xs font-extrabold uppercase tracking-wider opacity-90">{isGasto ? 'Monto del gasto' : 'Monto del ingreso'}</span>
        <span className="flex items-center gap-1">
          <span className="text-4xl font-extrabold opacity-80">{isGasto ? '$' : '+$'}</span>
          <input
            type="number"
            inputMode="decimal"
            value={monto}
            onChange={e => { setMonto(e.target.value); if (error) setError(''); }}
            placeholder="0"
            aria-label="Monto"
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-4xl font-extrabold text-white placeholder:text-white/50 tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </span>
      </label>

      <Segmentado
        opciones={[{ valor: 'gasto', texto: 'Gasto' }, { valor: 'ingreso', texto: 'Ingreso' }]}
        valor={tipo}
        onChange={setTipo}
      />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-300 px-3.5 py-2.5 rounded-2xl text-sm font-bold">{error}</div>
      )}

      <Grupo>
        <FilaCampo icono={isGasto ? ShoppingCart : TrendingUp} etiqueta="Comercio" value={comercio} onChange={e => setComercio(e.target.value)} placeholder="Ej: Starbucks" />
        <Fila icono={CalendarDays} texto="Fecha">
          <Pastilla type="date" value={fecha} onChange={e => setFecha(e.target.value)} aria-label="Fecha" style={{ width: 160 }} />
        </Fila>
      </Grupo>

      <Seccion titulo={`Categoría · ${categoria}`}>
        <div ref={filaCategorias} className="flex gap-3 overflow-x-auto no-scrollbar px-0.5 pt-1.5 pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORY_LIST.map(cat => {
            const selected = categoria === cat;
            const hex = CATEGORY_HEX[cat] || CATEGORY_HEX['Otros'];
            const ringClass = CATEGORY_RING_COLOR[cat] || 'ring-slate-400 dark:ring-slate-300/60';
            return (
              <button key={cat} type="button" onClick={() => setCategoria(cat)} aria-pressed={selected} data-seleccionado={selected ? 'true' : undefined} className="flex-shrink-0 w-[68px] flex flex-col items-center gap-1.5">
                <span
                  className={`w-12 h-12 rounded-full grid place-items-center text-xl leading-none transition duration-200 ${
                    selected
                      ? `scale-110 shadow-md ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-dark-normal ${ringClass}`
                      : 'bg-white/70 dark:bg-white/[0.06] border border-white/80 dark:border-white/10'
                  }`}
                  style={selected ? { backgroundColor: hexToRgba(hex, isDarkMode ? 0.22 : 0.16), color: hex } : {}}
                >
                  {CATEGORY_EMOJI[cat]}
                </span>
                <span className={`text-[11px] leading-tight text-center w-full truncate ${selected ? 'font-extrabold text-slate-800 dark:text-slate-100' : 'font-bold text-slate-500 dark:text-slate-400'}`}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>
      </Seccion>

      {isGasto && (
        <Seccion titulo="Frecuencia">
          <Segmentado
            opciones={[{ valor: 'variable', texto: 'Variable' }, { valor: 'mensual', texto: 'Mensual' }, { valor: 'anual', texto: 'Anual' }]}
            valor={tipoGasto}
            onChange={v => setTipoGasto(tipoGasto === v ? null : v)}
          />
        </Seccion>
      )}

      <Seccion titulo="Tarjeta">
        <Segmentado
          opciones={[{ valor: '', texto: 'Sin dato' }, { valor: 'Débito', texto: 'Débito' }, { valor: 'Crédito', texto: 'Crédito' }]}
          valor={tipoTarjeta}
          onChange={setTipoTarjeta}
        />
      </Seccion>

      <Seccion titulo="Banco o medio de pago">
        <SelectorBanco
          bancos={filtrarBancos(BANCOS, bancoBusqueda)}
          busqueda={bancoBusqueda}
          onBuscar={setBancoBusqueda}
          seleccionado={banco}
          onElegir={b => setBanco(banco === b.valor ? '' : b.valor)}
        />
      </Seccion>
    </Hoja>
  );
};

export default ManualTransactionPanel;
