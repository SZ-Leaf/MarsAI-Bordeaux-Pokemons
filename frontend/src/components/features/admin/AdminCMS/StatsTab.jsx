import React from 'react';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard';
import BilingualField from './BilingualField';

const inputClass =
  'w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60 transition-colors';

const StatsTab = ({ data, onChange }) => {
  const updateItem = (i, key, val) => {
    onChange(data.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  };

  const addItem = () =>
    onChange([
      ...data,
      {
        title: { fr: '', en: '' },
        subtitle: { fr: '', en: '' },
        color: 'text-blue-400',
        borderClass: 'border-blue',
      },
    ]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {data.map((stat, i) => (
        <SectionCard key={i} title={`Stat #${i + 1}`} onDelete={() => removeItem(i)}>
          <BilingualField
            label="Valeur"
            value={stat.title}
            onChange={(v) => updateItem(i, 'title', v)}
          />
          <BilingualField
            label="Sous-titre"
            value={stat.subtitle}
            onChange={(v) => updateItem(i, 'subtitle', v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">Couleur du texte</span>
              <input
                type="text"
                className={inputClass}
                value={stat.color}
                onChange={(e) => updateItem(i, 'color', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">Classe de bordure</span>
              <input
                type="text"
                className={inputClass}
                value={stat.borderClass}
                onChange={(e) => updateItem(i, 'borderClass', e.target.value)}
              />
            </div>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> Ajouter une stat
      </button>
    </div>
  );
};

export default StatsTab;

