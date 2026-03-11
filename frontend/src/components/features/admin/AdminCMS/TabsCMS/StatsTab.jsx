import React from 'react';
import { Plus } from 'lucide-react';
import SectionCard from '../SectionCard';
import BilingualField from '../BilingualField';

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

