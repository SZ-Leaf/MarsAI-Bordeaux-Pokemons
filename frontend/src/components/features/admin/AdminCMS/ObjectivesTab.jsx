import React from 'react';
import { Plus } from 'lucide-react';
import SectionCard from './SectionCard';
import BilingualField from './BilingualField';

const ICONS = ['Play', 'Users', 'Award', 'Target', 'Zap', 'Rocket'];

const inputClass =
  'w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60 transition-colors';

const ObjectivesTab = ({ data, onChange }) => {
  const updateItem = (i, key, val) => {
    onChange(data.map((o, idx) => (idx === i ? { ...o, [key]: val } : o)));
  };

  const addItem = () =>
    onChange([
      ...data,
      {
        title: { fr: '', en: '' },
        description: { fr: '', en: '' },
        icon: 'Target',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        borderClass: 'border-blue',
      },
    ]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {data.map((obj, i) => (
        <SectionCard key={i} title={`Objectif #${i + 1}`} onDelete={() => removeItem(i)}>
          <BilingualField
            label="Titre"
            value={obj.title}
            onChange={(v) => updateItem(i, 'title', v)}
          />
          <BilingualField
            label="Description"
            value={obj.description}
            onChange={(v) => updateItem(i, 'description', v)}
            multiline
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">Icône</span>
              <select
                className="px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60"
                value={obj.icon}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
              >
                {ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">Classe de bordure</span>
              <input
                type="text"
                className={inputClass}
                value={obj.borderClass}
                onChange={(e) => updateItem(i, 'borderClass', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">Couleur du texte</span>
              <input
                type="text"
                className={inputClass}
                value={obj.color}
                onChange={(e) => updateItem(i, 'color', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-white/60">Couleur de fond de l'icône</span>
              <input
                type="text"
                className={inputClass}
                value={obj.bgColor}
                onChange={(e) => updateItem(i, 'bgColor', e.target.value)}
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
        <Plus size={15} /> Ajouter un objectif
      </button>
    </div>
  );
};

export default ObjectivesTab;

