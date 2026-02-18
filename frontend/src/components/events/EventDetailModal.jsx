import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Clock, Users, Info, ChevronDown, ChevronUp } from 'lucide-react';

const EventDetailModal = ({ event, isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!event) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const imageUrl = event.cover ? `${API_URL}${event.cover}` : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop';

  const dateStart = new Date(event.start_date);
  const dateEnd = new Date(event.end_date);
  
  const formattedDate = dateStart.toLocaleDateString('fr-FR', { 
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
  });
  
  const formattedTime = `${dateStart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${dateEnd.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-[#111111] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden"
          >
            <div className="overflow-y-auto flex-grow custom-scrollbar">
              {/* Header / Image de couverture */}
              <div className="relative h-48 md:h-56 w-full overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-orange-600 text-white rounded-full transition-all border border-white/10 z-10"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenu */}
              <div className="px-8 pb-4 -mt-10 relative">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Événement Officiel
                  </span>
                  <span className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                    {event.places} PLACES DISPONIBLES
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {event.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="p-2 bg-orange-600/10 rounded-xl mr-3 border border-orange-500/20">
                        <Calendar className="text-orange-500" size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase">Date</p>
                        <p className="text-sm text-gray-200 capitalize">{formattedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="p-2 bg-orange-600/10 rounded-xl mr-3 border border-orange-500/20">
                        <Clock className="text-orange-500" size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase">Horaires</p>
                        <p className="text-sm text-gray-200">{formattedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="p-2 bg-orange-600/10 rounded-xl mr-3 border border-orange-500/20">
                        <MapPin className="text-orange-500" size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase">Lieu</p>
                        <p className="text-sm text-gray-200">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="p-2 bg-orange-600/10 rounded-xl mr-3 border border-orange-500/20">
                        <Users className="text-orange-500" size={16} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase">Capacité</p>
                        <p className="text-sm text-gray-200">{event.places} inscrits max</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Info size={16} className="text-orange-500" />
                    <h3 className="font-bold uppercase text-[10px] tracking-widest text-white">À propos</h3>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative">
                    <p className={`text-gray-400 text-sm leading-relaxed whitespace-pre-line ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {event.description}
                    </p>
                    {event.description && (event.description.length > 150 || event.description.split('\n').length > 3) && (
                      <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 flex items-center text-orange-500 text-[10px] font-bold uppercase tracking-wider hover:text-orange-400 transition-colors"
                      >
                        {isExpanded ? (
                          <>Voir moins <ChevronUp size={12} className="ml-1" /></>
                        ) : (
                          <>Voir plus <ChevronDown size={12} className="ml-1" /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer fixe avec bouton d'inscription */}
            <div className="p-6 bg-[#111111] border-t border-gray-800/50 flex justify-center">
              <button 
                className="w-full md:w-auto px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/20 transform hover:-translate-y-1 active:scale-95"
                onClick={() => alert("Inscription bientôt disponible")}
              >
                S'inscrire à l'événement
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailModal;
