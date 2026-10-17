import React, { useMemo, useState } from 'react';
import { Loader2, Sparkles, Search, CheckCircle } from 'lucide-react';
import { notifyOk, notifyError } from '../lib/notify.js';

const REGLAS = {
  marca: { texto: 'Marca conocida', clase: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  limpieza: { texto: 'Limpieza', clase: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
};

const n = (v) => Number(v || 0).toLocaleString('es-CL');

// Panel de admin para limpiar los nombres de comercio ya guardados: primero se
// simula (solo lectura) y se aplican solo los cambios que quedan marcados.
const LimpiezaComercios = ({ token }) => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [aplicando, setAplicando] = useState(false);
  const [omitidos, setOmitidos] = useState(() => new Set());
  const [filtro, setFiltro] = useState('');

  const simular = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/admin/comercios/simulacion', { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      setDatos(json);
      setOmitidos(new Set());
    } catch (e) {
      notifyError(e.message || 'No se pudo simular');
    } finally {
      setCargando(false);
    }
  };

  const visibles = useMemo(() => {
    if (!datos) return [];
    const q = filtro.trim().toLowerCase();
    return q ? datos.cambios.filter(c => c.actual.toLowerCase().includes(q) || c.propuesto.toLowerCase().includes(q)) : datos.cambios;
  }, [datos, filtro]);

  const seleccionados = datos ? datos.cambios.filter(c => !omitidos.has(c.actual)) : [];
  const movimientosSel = seleccionados.reduce((t, c) => t + c.movimientos, 0);

  const alternar = (actual) => setOmitidos(prev => {
    const s = new Set(prev);
    if (s.has(actual)) s.delete(actual); else s.add(actual);
    return s;
  });

  const aplicar = async () => {
    if (!seleccionados.length) return;
    if (!window.confirm(`Se renombrarán ${n(movimientosSel)} movimientos (${n(seleccionados.length)} nombres). El texto original queda guardado. ¿Aplicar?`)) return;
    setAplicando(true);
    try {
      const res = await fetch('/api/admin/comercios/aplicar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cambios: seleccionados.map(({ actual, propuesto }) => ({ actual, propuesto })), marcarResto: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      notifyOk(`Listo: ${n(json.renombrados)} movimientos renombrados`);
      await simular();
    } catch (e) {
      notifyError(e.message || 'No se pudo aplicar');
    } finally {
      setAplicando(false);
    }
  };

  const r = datos?.resumen;

  return (
    <section className="mt-8 bg-white dark:bg-dark-normal rounded-[2rem] shadow-2xl shadow-slate-200 dark:shadow-dark-darker/50 border border-slate-200 dark:border-dark-lighter p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
            <Sparkles size={20} className="text-kk-primary" /> Nombres de comercio
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Simula cómo quedarían los nombres ya guardados. Nada cambia hasta que presiones Aplicar.
          </p>
        </div>
        <button
          type="button"
          onClick={simular}
          disabled={cargando}
          className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 min-h-[44px] rounded-xl text-sm font-black disabled:opacity-60"
        >
          {cargando ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {datos ? 'Volver a simular' : 'Simular'}
        </button>
      </div>

      {r && (
        <>
          <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              ['Movimientos guardados', r.movimientos],
              ['Sin procesar', r.sinProcesar],
              ['Nombres que cambian', `${n(r.nombresQueCambian)} de ${n(r.nombresDistintos)}`],
              ['Movimientos que cambian', r.movimientosQueCambian],
            ].map(([t, v]) => (
              <div key={t} className="rounded-2xl bg-slate-50 dark:bg-dark-lighter/60 p-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{t}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{typeof v === 'number' ? n(v) : v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            De los que cambian, {n(r.movimientosRevisadosQueCambian)} ya estaban revisados por el usuario. Desmarca cualquier nombre que no quieras tocar.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar nombre…"
              className="flex-1 bg-slate-50 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lightest rounded-xl px-3 min-h-[44px] text-sm font-semibold outline-none focus:border-kk-primary dark:text-slate-200"
            />
            <button
              type="button"
              onClick={aplicar}
              disabled={aplicando || !seleccionados.length}
              className="inline-flex items-center justify-center gap-2 bg-kk-primary text-white px-4 min-h-[44px] rounded-xl text-sm font-black disabled:opacity-50"
            >
              {aplicando ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              Aplicar {n(seleccionados.length)} nombres ({n(movimientosSel)} mov.)
            </button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto rounded-2xl border border-slate-100 dark:border-dark-lighter divide-y divide-slate-100 dark:divide-dark-lighter">
            {visibles.length === 0 && (
              <p className="p-6 text-center text-sm font-semibold text-slate-400">No hay nombres por cambiar.</p>
            )}
            {visibles.map(c => {
              const regla = REGLAS[c.regla];
              const marcado = !omitidos.has(c.actual);
              return (
                <label key={c.actual} className={`flex items-start gap-3 p-3 cursor-pointer ${marcado ? '' : 'opacity-50'}`}>
                  <input type="checkbox" checked={marcado} onChange={() => alternar(c.actual)} className="mt-1 w-4 h-4 accent-kk-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-slate-400 break-words">{c.actual}</span>
                    <span className="block text-sm font-black text-slate-900 dark:text-white break-words">→ {c.propuesto}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1 flex-shrink-0">
                    {regla && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${regla.clase}`}>{regla.texto}</span>}
                    <span className="text-[11px] font-bold text-slate-500 tabular-nums">{n(c.movimientos)} mov · {n(c.usuarios)} usu.</span>
                  </span>
                </label>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default LimpiezaComercios;
