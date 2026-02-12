import React, { useEffect } from 'react';
import './modal.css';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true 
}) {
  
  // Fermer avec la touche Échap
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Empêcher le scroll du body quand la modal est ouverte
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={`modal-container modal-${size}`}>
        {/* Header avec titre et bouton fermer */}
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button 
                className="modal-close-btn" 
                onClick={onClose}
                aria-label="Fermer la modal"
              ><i className="pi pi-times"></i>
              </button>
            )}
          </div>
        )}

        {/* Contenu de la modal */}
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}
