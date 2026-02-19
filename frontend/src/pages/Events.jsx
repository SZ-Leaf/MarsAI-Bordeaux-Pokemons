import React from 'react';
import { Calendar, Search, Filter, Loader2, Info } from 'lucide-react';
import useEvents from '../hooks/useEvents';
import EventCard from '../components/events/EventCard';
import EventDetailModal from '../components/events/EventDetailModal';
import '../styles.css';

const Events = () => {
  const {
    filteredEvents,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedEvent,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
  } = useEvents();

  return (
    <div className="home-container min-h-screen pt-24 pb-20 px-4 md:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center animate-fade-in">
        <div className="hero-badge mb-6 inline-flex mx-auto">
          <Calendar size={14} className="mr-2" />
          AGENDA OFFICIEL 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tighter">
          LES ÉVÉNEMENTS MARS<span className="gradient-text">AI</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Découvrez notre programmation exclusive de workshops, conférences et projections 
          pour explorer les futurs souhaitables de l'intelligence artificielle.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="event-search-container">
          <Search className="event-search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un événement ou un lieu..." 
            className="event-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button className="event-filter-button">
            <Filter size={16} />
            Filtrer par date
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="event-loading-container">
            <Loader2 className="event-loading-spinner" size={40} />
            <p className="event-loading-text">Chargement des événements stellaires...</p>
          </div>
        ) : error ? (
          <div className="event-error-container">
            <Info className="event-error-icon" size={32} />
            <p className="event-error-title">Erreur système</p>
            <p className="event-error-message">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="event-empty-container">
            <p className="event-empty-text">Aucun événement ne correspond à votre recherche.</p>
            <p className="event-empty-subtext">Essayez d'autres mots clés ou revenez plus tard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={openDetailModal}
              />
            ))}
          </div>
        )}
      </div>

      <EventDetailModal 
        event={selectedEvent} 
        isOpen={isDetailModalOpen} 
        onClose={closeDetailModal}
      />
    </div>
  );
};

export default Events;
