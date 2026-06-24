import React, { useState, useRef } from 'react';
import { X, Plus, GripVertical, Edit3, Trash2, ArrowLeft } from 'lucide-react';
import ColorPicker from './ColorPicker.jsx';
import EmojiPicker from './EmojiPicker.jsx';

const TIPO_LABELS = { gasto: 'Gasto', ingreso: 'Ingreso', ambos: 'Ambos' };
const TIPO_ORDER = ['gasto', 'ingreso', 'ambos'];

export default function CategoriasConfig({
  show,
  onClose,
  categorias,
  onCreateCategoria,
  onUpdateCategoria,
  onDeleteCategoria,
  theme,
  isDarkMode,
  getCatStyle,
}) {
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#64748b');
  const [editEmoji, setEditEmoji] = useState('📦');
  const [editTipo, setEditTipo] = useState('gasto');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [dragOverTipo, setDragOverTipo] = useState(null);
  const dragCounter = useRef(0);

  if (!show) return null;

  const grouped = {};
  for (const t of TIPO_ORDER) {
    grouped[t] = categorias.filter(c => c.tipo === t).sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }

  const openEdit = (cat) => {
    setEditing({ ...cat, isNew: false });
    setEditName(cat.nombre);
    setEditColor(cat.color_hex);
    setEditEmoji(cat.emoji);
    setEditTipo(cat.tipo);
    setShowEmojiPicker(false);
  };

  const openCreate = (tipo) => {
    setEditing({ isNew: true, tipo });
    setEditName('');
    setEditColor('#64748b');
    setEditEmoji('📦');
    setEditTipo(tipo || 'gasto');
    setShowEmojiPicker(false);
  };

  const closeModal = () => {
    setEditing(null);
    setShowEmojiPicker(false);
  };

  const save = async () => {
    if (!editName.trim()) return;
    try {
      if (editing.isNew) {
        await onCreateCategoria({ nombre: editName.trim(), color_hex: editColor, emoji: editEmoji, tipo: editTipo });
      } else {
        await onUpdateCategoria(editing.id, { nombre: editName.trim(), color_hex: editColor, emoji: editEmoji, tipo: editTipo });
      }
      closeModal();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Eliminar "${cat.nombre}"?\nLas transacciones pasarán a "Sin categoría".`)) return;
    try {
      await onDeleteCategoria(cat.id);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDragStart = (e, cat, idx, tipo) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: cat.id, idx, tipo }));
  };

  const handleDrop = async (e, targetIdx, targetTipo) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragOverTipo(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data.tipo !== targetTipo) return;

      const cats = [...grouped[targetTipo]];
      const dragged = cats[data.idx];
      cats.splice(data.idx, 1);
      cats.splice(targetIdx, 0, dragged);

      const orderedIds = cats.map(c => c.id);
      for (let i = 0; i < orderedIds.length; i++) {
        await onUpdateCategoria(orderedIds[i], { orden: i });
      }
    } catch (err) {
      console.error('Error reordering:', err);
    }
  };

  const catBadge = (cat) => {
    const style = getCatStyle ? getCatStyle(cat.color_hex) : { backgroundColor: 'rgba(100,116,139,0.15)', color: cat.color_hex };
    return (
      <span
        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: style.backgroundColor || 'rgba(100,116,139,0.15)', color: style.color || cat.color_hex }}
      >
        {cat.nombre}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-40 bg-white dark:bg-dark-normal flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-dark-lighter bg-white dark:bg-dark-normal">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-lighter"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-bold">Volver</span>
        </button>
        <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200">Categorías</h2>
        <button
          onClick={() => openCreate('gasto')}
          className={`flex items-center gap-1.5 ${theme?.btnPrimary || 'bg-emerald-500 hover:bg-emerald-600'} text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all`}
        >
          <Plus size={16} /> Agregar
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:px-12 py-6">
        {TIPO_ORDER.map(tipo => {
          const cats = grouped[tipo] || [];
          if (cats.length === 0) return null;

          return (
            <div key={tipo} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-black uppercase ${
                  tipo === 'gasto' ? 'text-amber-600' : tipo === 'ingreso' ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                  {TIPO_LABELS[tipo]}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{cats.length} categoría{cats.length !== 1 ? 's' : ''}</span>
              </div>

              <div className={`bg-slate-50/50 dark:bg-dark-lighter/30 rounded-2xl overflow-hidden border border-slate-200 dark:border-dark-lighter ${
                dragOverTipo === tipo ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''
              }`}
                onDragOver={(e) => { e.preventDefault(); setDragOverTipo(tipo); }}
                onDragEnter={() => { dragCounter.current++; }}
                onDragLeave={() => { dragCounter.current--; if (dragCounter.current === 0) setDragOverTipo(null); }}
              >
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-dark-lighter">
                      <th className="w-8 p-2 sm:p-3"></th>
                      <th className="w-10 p-2 sm:p-3"></th>
                      <th className="p-2 sm:p-3 text-left text-[10px] font-black text-slate-400 uppercase">Nombre</th>
                      <th className="p-2 sm:p-3 text-center text-[10px] font-black text-slate-400 uppercase">Tipo</th>
                      <th className="p-2 sm:p-3 text-center text-[10px] font-black text-slate-400 uppercase">Color</th>
                      <th className="w-16 p-2 sm:p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cats.map((cat, idx) => (
                      <tr
                        key={cat.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, cat, idx, tipo)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, idx, tipo)}
                        className="border-b border-slate-100 dark:border-dark-lighter/50 hover:bg-slate-100/50 dark:hover:bg-dark-lighter/50 transition-colors cursor-default"
                      >
                        <td className="p-2 sm:p-3">
                          <button
                            className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors"
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <GripVertical size={14} />
                          </button>
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className="text-lg">{cat.emoji}</span>
                        </td>
                        <td className="p-2 sm:p-3">
                          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">{cat.nombre}</span>
                        </td>
                        <td className="p-2 sm:p-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cat.tipo === 'gasto' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                            cat.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                            'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          }`}>
                            {TIPO_LABELS[cat.tipo]}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-center">
                          <div
                            className="w-6 h-6 rounded-full mx-auto border-2 border-slate-200 dark:border-slate-600 shadow-sm"
                            style={{ backgroundColor: cat.color_hex }}
                          />
                        </td>
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => openEdit(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-lighter transition-all"
                              title="Editar"
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(cat)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                              title="Eliminar"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {categorias.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 dark:text-slate-500 font-bold mb-2">No hay categorías</p>
            <button onClick={() => openCreate('gasto')} className={`${theme?.btnPrimary || 'bg-emerald-500 hover:bg-emerald-600'} text-white px-4 py-2 rounded-xl text-sm font-bold`}>
              <Plus size={16} className="inline mr-1" /> Crear primera categoría
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editing && (
        <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-sm p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">
                {editing.isNew ? 'Nueva categoría' : 'Editar categoría'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Emoji */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Icono</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-12 h-12 flex items-center justify-center text-2xl bg-slate-100 dark:bg-dark-lighter rounded-xl border border-slate-200 dark:border-dark-lighter hover:border-slate-300 transition-all"
                  >
                    {editEmoji}
                  </button>
                  <span className="text-[10px] text-slate-400">Click para cambiar</span>
                </div>
                {showEmojiPicker && (
                  <div className="mt-2 relative z-10">
                    <div className="absolute left-0 top-0">
                      <EmojiPicker
                        value={editEmoji}
                        onChange={setEditEmoji}
                        onClose={() => setShowEmojiPicker(false)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">Nombre</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save(); }}
                  placeholder="Nombre de la categoría"
                  className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-blue-500 transition-all dark:text-slate-200"
                  autoFocus
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Color</label>
                <ColorPicker value={editColor} onChange={setEditColor} />
              </div>

              {/* Tipo */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {TIPO_ORDER.map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => setEditTipo(tipo)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        editTipo === tipo
                          ? tipo === 'gasto'
                            ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/50'
                            : tipo === 'ingreso'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/50'
                            : 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/50'
                          : 'bg-slate-100 dark:bg-dark-lighter border-slate-200 dark:border-dark-lighter text-slate-500 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {TIPO_LABELS[tipo]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 bg-slate-100 dark:bg-dark-lighter hover:bg-slate-200 dark:hover:bg-dark-lightest text-slate-600 dark:text-slate-300 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={save}
                disabled={!editName.trim()}
                className={`flex-1 ${theme?.btnPrimary || 'bg-emerald-500 hover:bg-emerald-600'} text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50`}
              >
                {editing.isNew ? 'Crear' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
