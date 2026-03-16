import React from 'react';
import { Plus } from 'lucide-react';
import SectionCard from '../SectionCard';
import BilingualField from '../BilingualField';

const inputClass =
  'w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white outline-none focus:border-blue/60 transition-colors';

const FilmsTab = ({ data, onChange }) => {
  const updateItem = (i, key, val) => {
    onChange(data.map((f, idx) => (idx === i ? { ...f, [key]: val } : f)));
  };

  const addItem = () =>
    onChange([...data, { title: { fr: '', en: '' }, director: '', image: '' }]);

  const removeItem = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {data.map((film, i) => (
        <SectionCard key={i} title={`Film #${i + 1}`} onDelete={() => removeItem(i)}>
          <BilingualField
            label="Titre"
            value={film.title}
            onChange={(v) => updateItem(i, 'title', v)}
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">Réalisateur</span>
            <input
              type="text"
              className={inputClass}
              value={film.director}
              onChange={(e) => updateItem(i, 'director', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-white/60">URL de l'image</span>
            <input
              type="text"
              className={inputClass}
              value={film.image}
              onChange={(e) => updateItem(i, 'image', e.target.value)}
            />
            {film.image && (
              <img
                src={film.image}
                alt=""
                className="mt-1 h-16 w-28 object-cover rounded-md opacity-70"
              />
            )}
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-2 text-sm text-blue/80 hover:text-blue transition-colors self-start"
      >
        <Plus size={15} /> Ajouter un film
      </button>
    </div>
  );
};

export default FilmsTab;

