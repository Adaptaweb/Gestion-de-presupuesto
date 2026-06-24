import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, ChevronUp, ChevronDown, Trash2, Check, Edit3 } from 'lucide-react';
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
}) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#64748b');
  const [editEmoji, setEditEmoji] = useState('📦');
  const [editTipo, setEditTipo] = useState('gasto');
  const [showEmojiPicker, setShowEmojiPicker] = useState(null);
  const [addingTipo, setAddingTipo] = useState(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#64748b');
  const [newEmoji, setNewEmoji] = useState('📦');
  const [newTipo, setNewTipo] = useState('gasto');
  const [showNewEmojiPicker, setShowNewEmojiPicker] = useState(false);
  const nameRef = useRef(null);

  useEffect(() => {
    if (editingId && nameRef.current) nameRef.current.focus();
  }, [editingId]);

  if (!show) return null;

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.nombre);
    setEditColor(cat.color_hex);
    setEditEmoji(cat.emoji);
    setEditTipo(cat.tipo);
    setShowEmojiPicker(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowEmojiPicker(null);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    try {
      await onUpdateCategoria(editingId, {
        nombre: editName.trim(),
        color_hex: editColor,
        emoji: editEmoji,
        tipo: editTipo,
      });
      cancelEdit();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Eliminar "${cat.nombre}"?\nLas transacciones con esta categoría quedarán como "Sin categoría".`)) return;
    try {
      await onDeleteCategoria(cat.id);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await onCreateCategoria({
        nombre: newName.trim(),
        color_hex: newColor,
        emoji: newEmoji,
        tipo: newTipo,
      });
      setAddingTipo(null);
      setNewName('');
      setNewColor('#64748b');
      setNewEmoji('📦');
      setNewTipo('gasto');
      setShowNewEmojiPicker(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const toggleTipo = async (cat, newTipo) => {
    try {
      await onUpdateCategoria(cat.id, { tipo: newTipo });
    } catch (e) {
      alert(e.message);
    }
  };

  const moveOrder = async (cat, direction) => {
    const sameTipo = categorias.filter(c => c.tipo === cat.tipo);
    const idx = sameTipo.findIndex(c => c.id === cat.id);
    const target = sameTipo[idx + direction];
    if (!target) return;
    const reordered = [...sameTipo];
    reordered.splice(idx, 1);
    reordered.splice(idx + direction, 0, cat);
    const orderedIds = reordered.map(c => c.id);
    try {
      await onUpdateCategoria(cat.id, { orden: target.orden });
    } catch (e) {
      alert(e.message);
    }
  };

  const grouped = {};
  for (const t of TIPO_ORDER) {
    grouped[t] = categorias.filter(c => c.tipo === t);
  }

  const renderCatRow = (cat, idx, totalInGroup) => {
    const isEditing = editingId === cat.id;
    return (
      <div
        key={cat.id}
        className={`flex items-center gap-2 py-2 px-2 rounded-xl transition-all ${
          isEditing ? 'bg-slate-100 dark:bg-dark-lighter ring-1 ring-slate-200 dark:ring-dark-lightest' : 'hover:bg-slate-50 dark:hover:bg-dark-lighter/50'
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => moveOrder(cat, -1)}
            disabled={idx === 0}
            className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed"
            title="Subir"
          >
            <ChevronUp size={12} />
          </button>
          <button
            onClick={() => moveOrder(cat, 1)}
            disabled={idx === totalInGroup - 1}
            className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed"
            title="Bajar"
          >
            <ChevronDown size={12} />
          </button>
        </div>

        {isEditing ? (
          <button
            onClick={() => setShowEmojiPicker(showEmojiPicker === cat.id ? null : cat.id)}
            className="text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-dark-normal transition-all flex-shrink-0"
          >
            {editEmoji}
          </button>
        ) : (
          <span className="text-xl w-8 h-8 flex items-center justify-center flex-shrink-0">{cat.emoji}</span>
        )}

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={nameRef}
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
              className="w-full bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200"
            />
          ) : (
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate block">{cat.nombre}</span>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => toggleTipo(cat, 'gasto')}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                editTipo === 'gasto' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-slate-100 text-slate-400 dark:bg-dark-lighter dark:text-slate-500'
              }`}
            >
              Gasto
            </button>
            <button
              onClick={() => toggleTipo(cat, 'ingreso')}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                editTipo === 'ingreso' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-100 text-slate-400 dark:bg-dark-lighter dark:text-slate-500'
              }`}
            >
              Ingreso
            </button>
            <button
              onClick={() => toggleTipo(cat, 'ambos')}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                editTipo === 'ambos' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-slate-100 text-slate-400 dark:bg-dark-lighter dark:text-slate-500'
              }`}
            >
              Ambos
            </button>
          </div>
        ) : (
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
            cat.tipo === 'gasto' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
            cat.tipo === 'ingreso' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
            'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
          }`}>
            {TIPO_LABELS[cat.tipo]}
          </span>
        )}

        <button
          onClick={() => setEditingId(cat.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-lighter transition-all flex-shrink-0"
          title="Editar"
        >
          <Edit3 size={13} />
        </button>

        {isEditing ? (
          <>
            <button onClick={saveEdit} className="p-1 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex-shrink-0" title="Guardar">
              <Check size={14} />
            </button>
            <button onClick={cancelEdit} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-lighter transition-all flex-shrink-0" title="Cancelar">
              <X size={14} />
            </button>
          </>
        ) : (
          <button onClick={() => handleDelete(cat)} className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0" title="Eliminar">
            <Trash2 size={13} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white/60 dark:bg-zinc-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-dark-normal rounded-2xl sm:rounded-[2rem] w-full max-w-lg p-4 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-200">
            Categorías
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
            <X size={20} />
          </button>
        </div>

        {TIPO_ORDER.map(tipo => {
          const cats = grouped[tipo] || [];
          if (cats.length === 0 && addingTipo !== tipo) return null;

          return (
            <div key={tipo} className="mb-4">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className={`text-[10px] font-black uppercase ${
                  tipo === 'gasto' ? 'text-amber-600' : tipo === 'ingreso' ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                  {TIPO_LABELS[tipo]}
                </span>
                <button
                  onClick={() => setAddingTipo(tipo)}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
                >
                  <Plus size={12} /> Agregar
                </button>
              </div>

              <div className="bg-slate-50/50 dark:bg-dark-lighter/30 rounded-xl p-2 space-y-0.5">
                {cats.map((cat, idx) => renderCatRow(cat, idx, cats.length))}

                {addingTipo === tipo && (
                  <div className="flex items-center gap-2 py-2 px-2 bg-white dark:bg-dark-normal rounded-xl ring-1 ring-blue-200 dark:ring-blue-800">
                    <button
                      onClick={() => setShowNewEmojiPicker(!showNewEmojiPicker)}
                      className="text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-dark-lighter transition-all flex-shrink-0"
                    >
                      {newEmoji}
                    </button>
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setAddingTipo(null); }}
                      placeholder="Nombre categoría"
                      className="flex-1 bg-slate-50 dark:bg-dark-lighter border border-slate-200 dark:border-dark-lighter rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200"
                      autoFocus
                    />
                    <button onClick={handleCreate} disabled={!newName.trim()} className="px-2 py-1 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-all disabled:opacity-50 flex-shrink-0">
                      Crear
                    </button>
                    <button onClick={() => setAddingTipo(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Color picker (shown when editing) */}
        {editingId && (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-dark-lighter rounded-xl">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Color</p>
            <ColorPicker value={editColor} onChange={setEditColor} />
          </div>
        )}

        {/* Emoji picker popover */}
        {showEmojiPicker && (
          <div className="mt-2 relative z-10">
            <div className="absolute left-0 top-0">
              <EmojiPicker
                value={editEmoji}
                onChange={setEditEmoji}
                onClose={() => setShowEmojiPicker(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
