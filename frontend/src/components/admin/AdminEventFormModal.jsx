import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Calendar, MapPin, Users, Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import { createEvent, updateEvent } from '../../services/event.service';

const AdminEventFormModal = ({ isOpen, onClose, eventToEdit, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    places: 100
  });
  
  const [cover, setCover] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Pré-remplissage si mode édition
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        start_date: eventToEdit.start_date ? new Date(eventToEdit.start_date).toISOString().slice(0, 16) : '',
        end_date: eventToEdit.end_date ? new Date(eventToEdit.end_date).toISOString().slice(0, 16) : '',
        location: eventToEdit.location || '',
        places: eventToEdit.places || 100
      });
      
      if (eventToEdit.cover) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        setPreviewUrl(`${API_URL}${eventToEdit.cover}`);
      } else {
        setPreviewUrl(null);
      }
    } else {
      // Reset si mode création
      setFormData({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        location: '',
        places: 100
      });
      setPreviewUrl(null);
      setCover(null);
    }
    setError(null);
  }, [eventToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (cover) {
        data.append('cover', cover);
      }

      if (eventToEdit) {
        await updateEvent(eventToEdit.id, data);
      } else {
        await createEvent(data);
      }

      onRefresh(); // Recharger la liste
      onClose(); // Fermer la modale
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err);
      setError(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#1a1a1a] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-gray-800 shadow-2xl p-8 md:p-10"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {eventToEdit ? 'Modifier l\'événement' : 'Nouvel événement'}
                </h2>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">
                  {eventToEdit ? 'Édition des paramètres stellaires' : 'Configuration d\'une nouvelle mission'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-2xl transition-all border border-white/5"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section Image */}
              <div className="relative group">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative h-48 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center
                    ${previewUrl ? 'border-orange-500/50' : 'border-gray-800 hover:border-orange-500/30 bg-black/20'}`}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-orange-600 p-3 rounded-full text-white">
                          <Upload size={20} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="bg-orange-600/10 p-4 rounded-3xl inline-block mb-3 border border-orange-500/20">
                        <ImageIcon size={32} className="text-orange-500" />
                      </div>
                      <p className="text-white font-bold text-sm">Ajouter une image de couverture</p>
                      <p className="text-gray-500 text-[10px] uppercase mt-1">Recommandé : 1200 x 600 px</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Titre de l'événement</label>
                  <input 
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Conférence IA & Créativité"
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                {/* Date Début */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center">
                    <Calendar size={12} className="mr-1" /> Date de début
                  </label>
                  <input 
                    type="datetime-local"
                    name="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Date Fin */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center">
                    <Clock size={12} className="mr-1" /> Date de fin
                  </label>
                  <input 
                    type="datetime-local"
                    name="end_date"
                    required
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500 transition-all [color-scheme:dark]"
                  />
                </div>

                {/* Lieu */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center">
                    <MapPin size={12} className="mr-1" /> Lieu
                  </label>
                  <input 
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Palais des Congrès, Bordeaux"
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                {/* Places */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1 flex items-center">
                    <Users size={12} className="mr-1" /> Capacité (places)
                  </label>
                  <input 
                    type="number"
                    name="places"
                    required
                    min="1"
                    value={formData.places}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Description</label>
                  <textarea 
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez l'événement en quelques lignes..."
                    className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/5"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-2 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                  {eventToEdit ? 'Enregistrer les modifications' : 'Créer l\'événement'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminEventFormModal;
