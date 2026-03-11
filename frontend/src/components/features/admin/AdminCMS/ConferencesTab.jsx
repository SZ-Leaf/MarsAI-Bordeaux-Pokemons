import React from 'react';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard';
import BilingualField from './BilingualField';

const ICONS = ['Play', 'Users', 'Award', 'Target', 'Zap', 'Rocket'];

const ConferencesTab = ({ data, onChange }) => {
  const updateItem = (i, key, val) => {
    onChange(data.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));
  };

  const addItem = () =>
    onChange([
      ...data,
      { title: { fr: '', en: '' }, description: { fr: '', en: '' }, icon: 'Play' },
    ]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {data.map((conf, i) => (
        <SectionCard key={i} title={`Conférence #${i + 1}`} onDelete={() => removeItem(i)}>
          <BilingualField
            label="Titre"
            value={conf.title}
            onChange={(v) => updateItem(i, 'title', v)}
          />
          <BilingualField
            label="Description"
            value={conf.description}
            onChange={(v) => updateItem(i, 'description', v)}
            multiline
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">Icône</span>
            <select
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60"
              value={conf.icon}
              onChange={(e) => updateItem(i, 'icon', e.target.value)}
            >
              {ICONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
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
        <Plus size={15} /> Ajouter une conférence
      </button>
    </div>
  );
};

export default ConferencesTab;

