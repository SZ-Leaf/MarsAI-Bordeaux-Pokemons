import React from 'react';
import { Calendar, Search, Filter, Loader2, Info } from 'lucide-react';
import useEvents from '../hooks/useEvents';
import { EventCard, EventDetailModal } from '../components/features/events';
import '../styles/main.css';

const Events = () => {
  const {
    events,
    filteredEvents,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    timeframe,
    setTimeframe,
    selectedEvent,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
  } = useEvents();

  return (
    <div className="home-container page-events min-h-screen pt-24 pb-20 px-4 md:px-8">
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
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-black/40 border border-white/10 rounded-3xl px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
          <div className="event-search-container w-full md:w-auto flex-1">
            <Search className="event-search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher un titre ou un lieu..."
              className="event-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              className={`event-filter-button ${timeframe === 'all' ? 'bg-white/10 text-white' : ''}`}
              onClick={() => setTimeframe('all')}
            >
              <Filter size={16} />
              Tous
            </button>
            <button
              className={`event-filter-button ${timeframe === 'upcoming' ? 'bg-white/10 text-white' : ''}`}
              onClick={() => setTimeframe('upcoming')}
            >
              À venir
            </button>
            <button
              className={`event-filter-button ${timeframe === 'past' ? 'bg-white/10 text-white' : ''}`}
              onClick={() => setTimeframe('past')}
            >
              Passés
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs md:text-sm text-gray-400 px-1">
          <span>
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} affiché{filteredEvents.length > 1 ? 's' : ''} 
            {timeframe === 'upcoming'
              ? ' · à venir'
              : timeframe === 'past'
              ? ' · passés'
              : ''}
          </span>
          <span className="hidden md:inline text-gray-500">
            Total programme : {events.length} événement{events.length > 1 ? 's' : ''}.
          </span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
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
