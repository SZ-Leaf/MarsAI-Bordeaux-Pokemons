import React from 'react';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard';
import BilingualField from './BilingualField';

const CLASS_OPTIONS = ['card-purple', 'card-green', 'card-pink', 'card-blue'];

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
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">Style</span>
            <select
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60"
              value={feature.className}
              onChange={(e) => updateItem(i, 'className', e.target.value)}
            >
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> Ajouter une carte
      </button>
    </div>
  );
};

export default FeaturesTab;

