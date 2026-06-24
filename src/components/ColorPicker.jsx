import React, { useRef } from 'react';

const PRESET_COLORS = [
  '#64748b', '#78716c', '#ef4444', '#f97316', '#d97706',
  '#eab308', '#65a30d', '#16a34a', '#059669', '#0d9488',
  '#06b6d4', '#0284c7', '#2563eb', '#4f46e5', '#7c3aed',
  '#9333ea', '#c026d3', '#db2777', '#e11d48', '#71717a',
];

export default function ColorPicker({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="w-9 h-9 rounded-xl border-2 border-slate-300 dark:border-slate-600 shadow-sm hover:scale-105 transition-transform flex items-center justify-center"
          style={{ backgroundColor: value }}
          title="Selector de color"
        >
          <span className="text-white text-xs font-black mix-blend-difference">+</span>
        </button>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="text-[10px] font-mono text-slate-400">{value}</span>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-lg transition-all hover:scale-110 ${
              value === color ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-offset-dark-normal scale-110' : ''
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
