import { Plus, X } from 'lucide-react';

const PRESETS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b',
  '#10b981', '#14b8a6', '#3b82f6', '#0ea5e9', '#111827',
];

export default function ColorPicker({ colors, onChange }) {
  const add = (c) => {
    if (colors.includes(c) || colors.length >= 5) return;
    onChange([...colors, c]);
  };
  const remove = (c) => onChange(colors.filter((x) => x !== c));
  const update = (i, v) => {
    const next = [...colors];
    next[i] = v;
    onChange(next);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {colors.map((c, i) => (
          <div key={i} className="group relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white pl-1 pr-2 py-1">
            <label className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-lg ring-1 ring-slate-200" style={{ background: c }}>
              <input
                type="color"
                value={c}
                onChange={(e) => update(i, e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <span className="text-xs font-mono text-slate-600">{c}</span>
            <button
              onClick={() => remove(c)}
              className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Supprimer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {colors.length < 5 && (
          <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:border-indigo-300 hover:text-indigo-600">
            <Plus className="h-4 w-4" />
            <span>Couleur</span>
            <input
              type="color"
              onChange={(e) => add(e.target.value)}
              className="absolute h-0 w-0 opacity-0"
            />
          </label>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-slate-500 mr-1 self-center">Presets:</span>
        {PRESETS.map((c) => (
          <button
            key={c}
            onClick={() => add(c)}
            className="h-6 w-6 rounded-md ring-1 ring-slate-200 transition hover:scale-110 hover:ring-2 hover:ring-indigo-300"
            style={{ background: c }}
            aria-label={c}
            title={c}
          />
        ))}
      </div>
    </div>
  );
}
