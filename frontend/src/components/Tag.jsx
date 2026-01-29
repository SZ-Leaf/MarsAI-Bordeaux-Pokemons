import React from 'react';
import '../components/ui/tags.css';

/**
 * Tag Component - Composant visuel pour les tags
 */
export default function Tag({ variant = 'dark', tags = [], status = null }) {
  return (
    <div className="tag-input-container">
      {/* Affichage du statut (tag spécial) */}
      {status && (
        <div className="status-section">
          <div className={`tag tag-status tag-${variant}`}>
            {status}
          </div>
        </div>
      )}

      {/* Affichage des tags */}
      {tags.length > 0 && (
        <div className="tags-section">
          <div className="tags-list">
            {tags.map((tag, index) => (
              <div key={index} className={`tag tag-${variant}`}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
