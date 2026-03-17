import React from 'react';
import { Plus } from 'lucide-react';
import SectionCard from '../SectionCard';
import BilingualField from '../BilingualField';

const FeaturesTab = ({ data, onChange }) => {
  const updateItem = (i, key, val) => {
    onChange(data.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)));
  };

  const addItem = () =>
    onChange([
      ...data,
      { title: { fr: '', en: '' }, description: { fr: '', en: '' }, className: 'card-blue' },
    ]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {data.map((feature, i) => (
        <SectionCard key={i} title={`Carte #${i + 1}`} onDelete={() => removeItem(i)}>
          <BilingualField
            label="Titre"
            value={feature.title}
            onChange={(v) => updateItem(i, 'title', v)}
          />
          <BilingualField
            label="Description"
            value={feature.description}
            onChange={(v) => updateItem(i, 'description', v)}
            multiline
          />
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 px-3 py-2 md:p-0 text-sm text-blue/80 hover:text-blue transition-colors self-start border border-blue/20 md:border-none rounded-xl"
      >
        <Plus size={16} /> <span className="hidden md:inline">Ajouter une carte</span>
      </button>
    </div>
  );
};

export default FeaturesTab;

