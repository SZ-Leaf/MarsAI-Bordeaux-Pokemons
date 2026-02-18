import { useState, useEffect } from 'react';
import { getEvents, deleteEvent } from '../services/event.service';

const useAdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents();
      setEvents(response.data.events || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des événements:', err);
      setError('Impossible de charger les événements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEventToEdit(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (event, e) => {
    e?.stopPropagation();
    setEventToEdit(event);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  const removeEvent = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) return;
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (err) {
      alert("Erreur lors de la suppression de l'événement.");
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    events,
    filteredEvents,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    isFormModalOpen,
    eventToEdit,
    openCreateModal,
    openEditModal,
    closeFormModal,
    removeEvent,
    fetchEvents,
  };
};

export default useAdminEvents;
