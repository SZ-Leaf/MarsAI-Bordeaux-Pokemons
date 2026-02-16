import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, ChevronRight } from 'lucide-react';
import AdminSectionHeader from './shared/AdminSectionHeader';

const AdminEvents = () => {
  const events = [
    { id: 1, title: 'Cérémonie d\'ouverture', date: '20 Mai 2024', time: '19:00', location: 'Grand Amphithéâtre', status: 'Confirmé', attendees: 450 },
    { id: 2, title: 'Workshop IA & Cinéma', date: '21 Mai 2024', time: '14:30', location: 'Salle Mars', status: 'Complet', attendees: 80 },
    { id: 3, title: 'Projection Red Horizon', date: '22 Mai 2024', time: '21:00', location: 'Cinéma Galaxie', status: 'Confirmé', attendees: 320 },
    { id: 4, title: 'Dîner de Gala', date: '24 Mai 2024', time: '20:30', location: 'Terrasse Étoilée', status: 'En attente', attendees: 150 },
  ];

  return (
    <div className="p-2">
      <AdminSectionHeader 
        title="Évènements" 
        subtitle="Planifiez et gérez les moments forts du festival Mars AI."
        action={{
          label: "Nouvel évènement",
          icon: Plus,
          onClick: () => console.log('New event'),
          color: 'orange'
        }}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800/50 hover:border-orange-500/30 transition-all group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-[#0a0a0a] rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-orange-500">
                    <span className="text-xl font-bold">{event.date.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase font-bold text-gray-500">{event.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">{event.title}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-gray-500">
                      <div className="flex items-center text-xs">
                        <Clock size={14} className="mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-xs">
                        <MapPin size={14} className="mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-right hidden md:block">
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">Inscrits</div>
                    <div className="text-lg font-bold">{event.attendees}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    event.status === 'Complet' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {event.status}
                  </div>
                  <ChevronRight className="text-gray-700 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800/50">
            <h3 className="font-bold mb-4 flex items-center">
              <CalendarIcon size={18} className="mr-2 text-orange-500" />
              Calendrier rapide
            </h3>
            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                <span key={d} className="text-[10px] text-gray-600 font-bold">{d}</span>
              ))}
              {Array.from({ length: 31 }).map((_, i) => (
                <div key={i} className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-colors cursor-pointer ${
                  i + 1 === 20 ? 'bg-orange-600 text-white' : 'hover:bg-white/5'
                }`}>
                  {i + 1}
                </div>
              ))}
            </div>
            <button className="w-full py-2 text-[10px] font-bold uppercase text-gray-500 hover:text-white transition-colors border-t border-gray-800 pt-4">
              Voir tout le calendrier
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-transparent p-6 rounded-3xl border border-orange-500/20">
            <h3 className="font-bold text-orange-400 mb-2">Statistiques d'affluence</h3>
            <p className="text-xs text-gray-400 mb-4">Le taux d'occupation moyen des workshops est de 86% cette année.</p>
            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 w-[86%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
