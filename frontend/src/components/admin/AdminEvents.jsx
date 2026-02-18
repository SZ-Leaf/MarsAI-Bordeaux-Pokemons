import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, ChevronRight, Edit2, Trash2, Loader2, Search, Info } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';
import AdminEventFormModal from './AdminEventFormModal';
import useAdminEvents from '../../hooks/useAdminEvents';

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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher par titre ou lieu..."
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#1a1a1a] rounded-[2.5rem] border border-gray-800/50">
              <Loader2 className="animate-spin text-orange-500 mb-4" size={32} />
              <p className="text-gray-500 text-sm">Chargement des événements...</p>
            </div>
          ) : error ? (
            <div className="p-10 bg-red-500/5 border border-red-500/10 rounded-[2.5rem] text-center">
              <Info className="text-red-500 mx-auto mb-3" size={32} />
              <p className="text-white font-bold mb-1">Erreur de chargement</p>
              <p className="text-red-500/70 text-xs">{error}</p>
              <button onClick={fetchEvents} className="mt-4 text-xs text-orange-500 underline uppercase font-bold">Réessayer</button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-20 bg-[#1a1a1a] border border-gray-800 rounded-[2.5rem] text-center">
              <p className="text-gray-500 text-sm">Aucun événement trouvé.</p>
              <button onClick={openCreateModal} className="mt-4 text-xs text-orange-500 uppercase font-bold border border-orange-500/30 px-4 py-2 rounded-xl hover:bg-orange-500/10 transition-all">
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
                <div key={event.id} className="bg-[#1a1a1a] p-6 rounded-[2rem] border border-gray-800/50 hover:border-orange-500/30 transition-all group">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-[#0a0a0a] rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-orange-500 group-hover:border-orange-500/20 transition-all shadow-lg">
                        <span className="text-xl font-bold leading-none">{day}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-500 mt-1">{month}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">{event.title}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-gray-500">
                          <div className="flex items-center text-xs">
                            <Clock size={14} className="mr-1 text-orange-500/60" />
                            {time}
                          </div>
                          <div className="flex items-center text-xs">
                            <MapPin size={14} className="mr-1 text-orange-500/60" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-auto">
                      <div className="text-right hidden md:block border-r border-gray-800 pr-4 mr-2">
                        <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Capacité</div>
                        <div className="text-lg font-bold text-gray-300">{event.places}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => openEditModal(event, e)}
                          className="p-3 bg-white/5 hover:bg-orange-500/20 text-gray-400 hover:text-orange-500 rounded-xl transition-all border border-white/5"
                          title="Modifier"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={(e) => removeEvent(event.id, e)}
                          className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-white/5"
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
