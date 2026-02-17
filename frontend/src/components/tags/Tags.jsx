import React from 'react';
import './tags.css';
import TagSelectCreatable from './TagSelectCreate';
import { useTags } from '../../hooks/useTags';

export default function Tag({
  variant = "dark",
  status = null,
  value = [],
  onChange = () => {},
}) {
  const { 
    allTags, 
    loading, 
    error, 
    searchTags, 
    createTag 
  } = useTags();

  if (loading) {
    return <p>Chargement tags…</p>;
  }

  return (
    <div className="tag-input-container flex flex-col gap-4">
      <TagSelectCreatable
        allTags={allTags}
        value={value}
        onChange={onChange}
        onSearchTags={searchTags}
        onCreateTag={createTag}
      />
      
      <div className="tag-input-container">
        {/* Affichage du statut (tag spécial) */}
        {status && (
          <div className="status-section">
            <div className={`tag tag-status tag-${variant}`}>
              {status}
            </div>
          </div>
        )}

        {/* Message d'erreur / info */}
        {error && <p>{error}</p>}

        {/* Affichage des tags récupérés depuis l'API */}
        {allTags.length > 0 && (

          <div className="tags-section">
            <div>
              <h2 className='my-2'>Tags les plus populaires</h2>
            </div>
            <div className="tags-list">
              {allTags.map((tag) => (
                <div key={tag.id} className={`tag tag-${variant}`}>
                  {tag.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
