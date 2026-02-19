import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import '../../../../styles.css';

const EventCard = ({ event, onClick }) => {
  const { title, cover, start_date, location } = event;
  
  // Formater la date (ex: 20 Mai 2026)
  const dateObj = new Date(start_date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
  const time = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const imageUrl = cover ? `${API_URL}${cover}` : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop';

  return (
    <div 
      className="event-card group"
      onClick={() => onClick(event)}
    >
      {/* Image de couverture */}
      <div className="event-card-image-container">
        <img 
          src={imageUrl} 
          alt={title} 
          className="event-card-image"
        />
        <div className="event-card-date-badge">
          <span className="event-card-date-day">{day}</span>
          <span className="event-card-date-month">{month}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="event-card-content">
        <h3 className="event-card-title">
          {title}
        </h3>
        
        <div className="event-card-info-container">
          <div className="event-card-info-item">
            <Clock size={16} className="event-card-info-icon" />
            <span>{time}</span>
          </div>
          <div className="event-card-info-item">
            <MapPin size={16} className="event-card-info-icon" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        <button className="event-card-button">
          Voir les détails
        </button>
      </div>
    </div>
  );
};

export default EventCard;
