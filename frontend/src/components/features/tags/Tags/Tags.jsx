import React from 'react';
import { useCallback } from 'react';
import '../../../../styles.css';
import TagSelectCreatable from '../TagSelectCreate/TagSelectCreate';
import { useTags } from '../../../../hooks/useTags';

export default function Tag({
  variant = "dark",
  status = null,
  value = [],
  onChange = () => {},
}) {
  const { 
    popularTags, 
    loading, 
    error, 
    searchTags,
  } = useTags();

    const addOption = useCallback(
    (opt) => {
      const exists = (value || []).some(
        (v) =>
          // même id
          (v?.value != null && opt.value != null && v.value === opt.value) ||
          // ou même label
          String(v?.label || "").toLowerCase() === String(opt?.label || "").toLowerCase()
      );
      if (!exists) onChange([...(value || []), opt]);
    },
    [value, onChange]
  );

  const handlePopularClick = (tag) => {
    addOption({ value: tag.id, label: tag.title });
  };

  if (loading) {
    return <p>Chargement tags…</p>;
  }

  return (
    <div className="tag-input-container flex flex-col gap-4">
      <TagSelectCreatable
        allTags={popularTags}
        value={value}
        onChange={onChange}
        onSearchTags={searchTags}
      />
      
            {status && (
        <div className="status-section">
          <div className={`tag tag-status tag-${variant}`}>{status}</div>
        </div>
      )}

      {error && <p>{error}</p>}

      {popularTags.length > 0 && (
        <div className="tags-section">
          <h2 className="my-2">Tags les plus populaires</h2>

          <div className="tags-list">
            {popularTags.map((tag) => {
              const selected = (value || []).some((v) => v?.value === tag.id);

              return (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag tag-${variant} cursor-pointer select-none ${selected ? "is-selected" : ""}`}
                  onClick={() => handlePopularClick(tag)}
                  title={selected ? "Déjà sélectionné" : "Ajouter ce tag"}
                >
                  {tag.title}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
