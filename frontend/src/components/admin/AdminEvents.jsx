import React from 'react';
import { MapPin, Clock, Plus, Edit2, Trash2, Loader2, Search, Info } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';
import AdminEventFormModal from './AdminEventFormModal';
import useAdminEvents from '../../hooks/useAdminEvents';
import '../../styles.css';

const AdminEvents = () => {
  const {
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
  } = useAdminEvents();

  return (
    <div className="p-2">
      <AdminSectionHeader 
        title="Évènements" 
        subtitle="Planifiez et gérez les moments forts du festival Mars AI."
        action={{
          label: "Nouvel évènement",
          icon: Plus,
          onClick: openCreateModal,
          color: 'orange'
        }}
      />

      <div className="mb-8 relative max-w-md">
        <Search className="event-search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher par titre ou lieu..."
          className="event-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="event-admin-loading-container">
            <Loader2 className="event-admin-loading-spinner" size={32} />
            <p className="event-admin-loading-text">Chargement des événements...</p>
          </div>
        ) : error ? (
          <div className="event-admin-error-container">
            <Info className="event-admin-error-icon" size={32} />
            <p className="event-admin-error-title">Erreur de chargement</p>
            <p className="event-admin-error-message">{error}</p>
            <button onClick={fetchEvents} className="event-admin-error-retry">Réessayer</button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="event-admin-empty-container">
            <p className="event-admin-empty-text">Aucun événement trouvé.</p>
            <button onClick={openCreateModal} className="event-admin-empty-button">
              Créer votre premier événement
            </button>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const dateStart = new Date(event.start_date);
            const day = dateStart.getDate();
            const month = dateStart.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
            const time = dateStart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={event.id} className="event-list-item group">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-6">
                    <div className="event-list-item-date-badge">
                      <span className="event-list-item-date-day">{day}</span>
                      <span className="event-list-item-date-month">{month}</span>
                    </div>
                    <div>
                      <h3 className="event-list-item-title">{event.title}</h3>
                      <div className="event-list-item-info">
                        <div className="event-list-item-info-item">
                          <Clock size={14} className="event-list-item-info-icon" />
                          {time}
                        </div>
                        <div className="event-list-item-info-item">
                          <MapPin size={14} className="event-list-item-info-icon" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-auto">
                    <div className="event-list-item-capacity">
                      <div className="event-list-item-capacity-label">Capacité</div>
                      <div className="event-list-item-capacity-value">{event.places}</div>
                    </div>
                    
                    <div className="event-list-item-actions">
                      <button 
                        onClick={(e) => openEditModal(event, e)}
                        className="event-list-item-action-btn"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => removeEvent(event.id, e)}
                        className="event-list-item-action-btn-danger"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdminEventFormModal 
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        eventToEdit={eventToEdit}
        onRefresh={fetchEvents}
      />
    </div>
  );
};

export default AdminEvents;
