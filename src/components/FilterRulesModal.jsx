import React, { useState, useEffect, useCallback } from 'react';
import { Settings2, Plus, X, Trash2, Loader2 } from 'lucide-react';

const FilterRulesModal = ({ isOpen, onClose, token, theme }) => {
  const [filters, setFilters] = useState([]);
  const [newFilterRemitente, setNewFilterRemitente] = useState('');
  const [newFilterAsunto, setNewFilterAsunto] = useState('');
  const [bulkRemitentes, setBulkRemitentes] = useState('');
  const [diasAtras, setDiasAtras] = useState(3);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }), [token]);

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

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([fetchFilters(), fetchConfig()]).finally(() => setLoading(false));
  }, [isOpen, fetchFilters, fetchConfig]);

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/config-extraccion', {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ dias_atras: diasAtras })
      });
      if (!res.ok) console.error('Error guardando config');
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
    const filterToDelete = filters.find(f => f.id === id);
    const confirmed = window.confirm(`¿Eliminar filtro para ${filterToDelete ? filterToDelete.remitente : 'este remitente'}?\nYa no se filtrarán emails de este remitente.`);
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/filtros/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) fetchFilters();
    } catch (err) { console.error(err); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-md p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
            <Settings2 className={theme.tabText} size={20} /> Reglas de filtrado
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-400" size={24} /></div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default FilterRulesModal;
