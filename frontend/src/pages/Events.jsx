import React, { useState, useEffect } from 'react';
import { getEvents } from '../services/event.service';
import EventCard from '../components/events/EventCard';
import EventDetailModal from '../components/events/EventDetailModal';
import { Calendar, Search, Filter, Loader2, Info } from 'lucide-react';
import './home.css'; // Pour réutiliser certains styles si besoin

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents();
        setEvents(response.data.events || []);
      } catch (err) {
        console.error('Erreur lors du chargement des événements:', err);
        setError("Impossible de charger les événements. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container min-h-screen pt-24 pb-20 px-4 md:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16 text-center animate-fade-in">
        <div className="hero-badge mb-6 inline-flex mx-auto">
          <Calendar size={14} className="mr-2" />
          AGENDA OFFICIEL 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tighter">
          LES ÉVÉNEMENTS <span className="gradient-text">MARS AI</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Découvrez notre programmation exclusive de workshops, conférences et projections 
          pour explorer les futurs souhaitables de l'intelligence artificielle.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un événement ou un lieu..." 
            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] border border-gray-800 rounded-2xl text-gray-400 text-sm hover:border-white/20 transition-all">
            <Filter size={16} />
            Filtrer par date
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
            <p className="text-gray-500">Chargement des événements stellaires...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center max-w-xl mx-auto">
            <Info className="text-red-500 mx-auto mb-4" size={32} />
            <p className="text-white font-bold mb-2">Erreur système</p>
            <p className="text-red-500/70 text-sm">{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-gray-800 p-20 rounded-[3rem] text-center">
            <p className="text-gray-500 text-lg mb-2">Aucun événement ne correspond à votre recherche.</p>
            <p className="text-gray-600 text-sm">Essayez d'autres mots clés ou revenez plus tard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onClick={handleOpenModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <EventDetailModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Events;
