import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const EMOJI_GROUPS = [
  {
    label: 'Dinero',
    emojis: ['💰', '💵', '💲', '💸', '🪙', '🏦', '🐷', '📈', '📉', '%', '💳', '🧾'],
  },
  {
    label: 'Casa',
    emojis: ['🏠', '🏡', '💡', '💧', '🔌', '🔥', '🛁', '🪣', '🧹', '🛏️', '🪴', '🔑'],
  },
  {
    label: 'Comida',
    emojis: ['🍕', '🍔', '🌮', '🍣', '🥗', '☕', '🍺', '🍷', '🍩', '🎂', '🍎', '🥑'],
  },
  {
    label: 'Transporte',
    emojis: ['🚗', '🚌', '🚇', '✈️', '🚲', '⛽', '🅿️', '🚕', '🏍️', '🚢', '🛴', '🚶'],
  },
  {
    label: 'Salud',
    emojis: ['❤️', '🏥', '💊', '🩺', '🦷', '👁️', '🧘', '🏋️', '💪', '🩹', '🧠', '🫁'],
  },
  {
    label: 'Ocio',
    emojis: ['🎮', '🎬', '🎵', '📱', '📺', '🎧', '📚', '🎨', '🎭', '🏖️', '⛰️', '🎪'],
  },
  {
    label: 'Compras',
    emojis: ['🛒', '🛍️', '👗', '👟', '💄', '🕶️', '⌚', '🎁', '📦', '🏪', '🛠️', '📐'],
  },
  {
    label: 'Otros',
    emojis: ['👤', '👶', '🐶', '🎓', '📄', '⭐', '✅', '➖', '📌', '🔔', '🤖', '🌟'],
  },
];

export default function EmojiPicker({ value, onChange, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return EMOJI_GROUPS;
    const q = search.toLowerCase();
    return EMOJI_GROUPS
      .map(g => ({
        label: g.label,
        emojis: g.emojis.filter(e => e.includes(q) || g.label.toLowerCase().includes(q)),
      }))
      .filter(g => g.emojis.length > 0);
  }, [search]);

  return (
    <div className="bg-white dark:bg-dark-normal border border-slate-200 dark:border-dark-lighter rounded-2xl shadow-xl p-3 w-72">
      <div className="relative mb-2">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar emoji..."
          className="w-full bg-slate-100 dark:bg-dark-lighter border-0 rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium outline-none text-slate-700 dark:text-slate-200"
          autoFocus
        />
      </div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2">
        {filtered.map(group => (
          <div key={group.label}>
            <p className="text-[9px] font-black uppercase text-slate-400 mb-1 px-0.5">{group.label}</p>
            <div className="grid grid-cols-8 gap-1">
              {group.emojis.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { onChange(emoji); onClose?.(); }}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-base hover:bg-slate-100 dark:hover:bg-dark-lighter transition-all ${
                    value === emoji ? 'bg-slate-200 dark:bg-dark-lighter ring-1 ring-slate-300' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">Sin resultados</p>
        )}
      </div>
    </div>
  );
}
