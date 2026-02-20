import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Clock, Users, Info, ChevronDown, ChevronUp } from 'lucide-react';
import '../../../../styles/main.css';

const EventDetailModal = ({ event, isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!event) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const imageUrl = event.cover ? `${API_URL}${event.cover}` : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop';

  const dateStart = new Date(event.start_date);
  const dateEnd = new Date(event.end_date);
  
  const formattedDate = dateStart.toLocaleDateString('fr-FR', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });
  
  const formattedTime = `${dateStart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${dateEnd.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="event-modal-overlay">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="event-modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="event-modal-container"
          >
            <div className="event-modal-scrollable">
              {/* Header / Image de couverture */}
              <div className="event-modal-header-image">
                <img 
                  src={imageUrl} 
                  alt={event.title} 
                  className="event-modal-header-image-img"
                />
                <div className="event-modal-header-gradient" />
                
                <button 
                  onClick={onClose}
                  className="event-modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenu */}
              <div className="event-modal-content">
                <div className="event-modal-badges">
                  <span className="event-modal-badge-primary">
                    Événement Officiel
                  </span>
                  <span className="event-modal-badge-secondary">
                    {event.places} PLACES DISPONIBLES
                  </span>
                </div>

                <h2 className="event-modal-title">
                  {event.title}
                </h2>

                <div className="event-modal-info-grid">
                  <div className="event-modal-info-section">
                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <Calendar className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Date</p>
                        <p className="event-modal-info-value-capitalize">{formattedDate}</p>
                      </div>
                    </div>
                    
                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <Clock className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Horaires</p>
                        <p className="event-modal-info-value">{formattedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="event-modal-info-section">
                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <MapPin className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Lieu</p>
                        <p className="event-modal-info-value">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <Users className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Capacité</p>
                        <p className="event-modal-info-value">{event.places} inscrits max</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="event-modal-description-section">
                  <div className="event-modal-description-header">
                    <Info size={16} className="event-modal-description-header-icon" />
                    <h3 className="event-modal-description-header-title">À propos</h3>
                  </div>
                  <div className="event-modal-description-content">
                    <p className={!isExpanded ? 'event-modal-description-text-clamped' : 'event-modal-description-text'}>
                      {event.description}
                    </p>
                    {event.description && (event.description.length > 150 || event.description.split('\n').length > 3) && (
                      <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="event-modal-description-toggle"
                      >
                        {isExpanded ? (
                          <>Voir moins <ChevronUp size={12} className="ml-1" /></>
                        ) : (
                          <>Voir plus <ChevronDown size={12} className="ml-1" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer fixe avec bouton d'inscription */}
            <div className="event-modal-footer">
              <button 
                className="event-modal-footer-button"
                onClick={() => alert("Inscription bientôt disponible")}
              >
                S'inscrire à l'événement
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailModal;
