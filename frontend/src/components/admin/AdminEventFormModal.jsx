import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Calendar, MapPin, Users, Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import useEventForm from '../../hooks/useEventForm';
import './admin.css';

const AdminEventFormModal = ({ isOpen, onClose, eventToEdit, onRefresh }) => {
  const {
    formData,
    previewUrl,
    loading,
    error,
    fileInputRef,
    onFieldChange,
    onFileChange,
    onSubmit,
  } = useEventForm({ eventToEdit, isOpen, onRefresh, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-backdrop"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-container"
          >
            <div className="modal-header">
              <div>
                <h2 className="modal-title">
                  {eventToEdit ? "Modifier l'événement" : 'Nouvel événement'}
                </h2>
                <p className="modal-subtitle">
                  {eventToEdit ? 'Édition des paramètres stellaires' : "Configuration d'une nouvelle mission"}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="modal-error">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="modal-form">
              {/* Image de couverture */}
              <div className="modal-image-upload-container group">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`modal-image-upload-area ${previewUrl ? 'modal-image-upload-area-filled' : 'modal-image-upload-area-empty'}`}
                >
                  {previewUrl ? (
                    <>
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="modal-image-overlay">
                        <div className="modal-image-upload-icon">
                          <Upload size={20} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="modal-image-placeholder">
                      <div className="modal-image-icon-container">
                        <ImageIcon size={32} className="modal-image-icon" />
                      </div>
                      <p className="modal-image-text">Ajouter une image de couverture</p>
                      <p className="modal-image-hint">Recommandé : 1200 x 600 px</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={onFileChange}
                />
              </div>

              <div className="modal-form-grid">
                <div className="modal-form-grid-full">
                  <label className="modal-label">Titre de l'événement</label>
                  <input 
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={onFieldChange}
                    placeholder="Ex: Conférence IA & Créativité"
                    className="modal-input"
                  />
                </div>

                <div>
                  <label className="modal-label-with-icon">
                    <Calendar size={12} className="mr-1" /> Date et heure de début
                  </label>
                  <div className="modal-date-time-grid">
                    <input
                      type="date"
                      required
                      value={formData.start_date ? formData.start_date.split('T')[0] : ''}
                      onChange={(e) => {
                        const time = formData.start_date ? formData.start_date.split('T')[1] : '00:00';
                        onFieldChange({ target: { name: 'start_date', value: `${e.target.value}T${time}` } });
                      }}
                      className="modal-input-date-time"
                    />
                    <input
                      type="time"
                      required
                      value={formData.start_date ? formData.start_date.split('T')[1] : ''}
                      onChange={(e) => {
                        const date = formData.start_date ? formData.start_date.split('T')[0] : '';
                        onFieldChange({ target: { name: 'start_date', value: `${date}T${e.target.value}` } });
                      }}
                      className="modal-input-date-time"
                    />
                  </div>
                </div>

                <div>
                  <label className="modal-label-with-icon">
                    <Clock size={12} className="mr-1" /> Date et heure de fin
                  </label>
                  <div className="modal-date-time-grid">
                    <input
                      type="date"
                      required
                      value={formData.end_date ? formData.end_date.split('T')[0] : ''}
                      onChange={(e) => {
                        const time = formData.end_date ? formData.end_date.split('T')[1] : '00:00';
                        onFieldChange({ target: { name: 'end_date', value: `${e.target.value}T${time}` } });
                      }}
                      className="modal-input-date-time"
                    />
                    <input
                      type="time"
                      required
                      value={formData.end_date ? formData.end_date.split('T')[1] : ''}
                      onChange={(e) => {
                        const date = formData.end_date ? formData.end_date.split('T')[0] : '';
                        onFieldChange({ target: { name: 'end_date', value: `${date}T${e.target.value}` } });
                      }}
                      className="modal-input-date-time"
                    />
                  </div>
                </div>

                <div>
                  <label className="modal-label-with-icon">
                    <MapPin size={12} className="mr-1" /> Lieu
                  </label>
                  <input 
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={onFieldChange}
                    placeholder="Ex: Palais des Congrès, Bordeaux"
                    className="modal-input"
                  />
                </div>

                <div>
                  <label className="modal-label-with-icon">
                    <Users size={12} className="mr-1" /> Capacité (places)
                  </label>
                  <input 
                    type="number"
                    name="places"
                    required
                    min="1"
                    value={formData.places}
                    onChange={onFieldChange}
                    className="modal-input"
                  />
                </div>

                <div className="modal-form-grid-full">
                  <label className="modal-label">Description</label>
                  <textarea 
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={onFieldChange}
                    placeholder="Décrivez l'événement en quelques lignes..."
                    className="modal-textarea"
                  />
                </div>
              </div>

              <div className="modal-form-actions">
                <button 
                  type="button"
                  onClick={onClose}
                  className="modal-btn-cancel"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="modal-btn-submit"
                >
                  {loading && <Loader2 className="animate-spin mr-2" size={20} />}
                  {eventToEdit ? 'Enregistrer les modifications' : "Créer l'événement"}
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
