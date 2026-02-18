import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  const { title, cover, start_date, location } = event;
  
  // Formater la date (ex: 20 Mai 2026)
  const dateObj = new Date(start_date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('fr-FR', { month: 'short' }).toUpperCase().replace('.', '');
  const fullDate = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const imageUrl = cover ? `${API_URL}${cover}` : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop';

  return (
    <div 
      className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800/50 hover:border-orange-500/50 transition-all group cursor-pointer flex flex-col h-full"
      onClick={() => onClick(event)}
    >
      {/* Image de couverture */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-2 min-w-[60px] flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-orange-500">{day}</span>
          <span className="text-[10px] font-bold text-gray-300 uppercase">{month}</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-gray-400 text-sm">
            <Clock size={16} className="mr-2 text-orange-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin size={16} className="mr-2 text-orange-500" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        <button className="mt-6 w-full py-3 bg-white/5 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all border border-white/10 hover:border-orange-500">
          Voir les détails
        </button>
      </div>
    </div>
  );
};

export default EventCard;
