import { useState, useEffect } from 'react';
import { getEvents } from '../services/event.service';

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState('all'); // all | upcoming | past
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      setEvents(response.data.events || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des événements:', err);
      setError('Impossible de charger les événements. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openDetailModal = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
  };

  const filteredEvents = events.filter((event) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      event.title.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (timeframe === 'all') return true;

    const now = new Date();
    const end = new Date(event.end_date);

    if (timeframe === 'upcoming') {
      // événements à venir tant que la date de fin n'est pas passée
      return end >= now;
    }
    if (timeframe === 'past') {
      return end < now;
    }
    return true;
  });

  return {
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
  };
};

export default useEvents;
