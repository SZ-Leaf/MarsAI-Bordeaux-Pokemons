import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Clock, Users, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { createReservation } from '../../../../services/event.service';
import '../../../../styles/main.css';

const EventDetailModal = ({ event, isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  if (!event) return null;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const imageUrl = event.cover
    ? (event.cover.startsWith('http') ? event.cover : `${API_URL}${event.cover}`)
    : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop';

  const dateStart = new Date(event.start_date);
  const dateEnd = new Date(event.end_date);
  const now = new Date();

  const totalPlaces = typeof event.places === 'number' ? event.places : null;
  const usedReservations = typeof event.reservations === 'number' ? event.reservations : 0;
  const remainingPlaces = totalPlaces != null ? Math.max(totalPlaces - usedReservations, 0) : null;

  const isPast = dateEnd < now;
  const isFull = remainingPlaces === 0;
  const canRegister = !isPast && !isFull;

  const formattedDate = dateStart.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const formattedTime = `${dateStart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${dateEnd.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (submitting || !canRegister) return;

    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const res = await createReservation(event.id, form);
      if (res?.data) {
        setMessage(
          "Merci ! Vérifiez votre boîte mail pour confirmer définitivement votre réservation."
        );
      } else {
        setMessage(
          "Votre demande de réservation a été prise en compte. Vérifiez vos e-mails pour la confirmation."
        );
      }
    } catch (err) {
      const m = err?.message;
      if (typeof m === 'string') {
        setError(m);
      } else if (m && typeof m === 'object' && (m.fr || m.en)) {
        setError(m.fr || m.en);
      } else {
        setError("Impossible d'enregistrer votre réservation. Merci de réessayer.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="event-modal-overlay">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="event-modal-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="event-modal-container"
          >
            <div className="event-modal-scrollable">
              {/* Header / Image de couverture */}
              <div className="event-modal-header-image">
                <img
                  src={imageUrl}
                  alt={event.title}
                  className="event-modal-header-image-img"
                />
                <div className="event-modal-header-gradient" />

                <button
                  onClick={onClose}
                  className="event-modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Contenu */}
              <div className="event-modal-content">
                <div className="event-modal-badges">
                  <span className="event-modal-badge-primary">
                    {isPast ? 'Événement passé' : 'Événement officiel'}
                  </span>
                  <span className="event-modal-badge-secondary">
                    {remainingPlaces != null
                      ? `${remainingPlaces} place${remainingPlaces > 1 ? 's' : ''} restante${remainingPlaces > 1 ? 's' : ''}`
                      : `${event.places} places disponibles`}
                  </span>
                </div>

                <h2 className="event-modal-title">
                  {event.title}
                </h2>

                <div className="event-modal-info-grid">
                  <div className="event-modal-info-section">
                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <Calendar className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Date</p>
                        <p className="event-modal-info-value-capitalize">{formattedDate}</p>
                      </div>
                    </div>

                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <Clock className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Horaires</p>
                        <p className="event-modal-info-value">{formattedTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="event-modal-info-section">
                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <MapPin className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Lieu</p>
                        <p className="event-modal-info-value">{event.location}</p>
                      </div>
                    </div>

                    <div className="event-modal-info-item">
                      <div className="event-modal-info-icon-container">
                        <Users className="event-modal-info-icon" size={16} />
                      </div>
                      <div>
                        <p className="event-modal-info-label">Capacité</p>
                        <p className="event-modal-info-value">{event.places} inscrits max</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="event-modal-description-section">
                  <div className="event-modal-description-header">
                    <Info size={16} className="event-modal-description-header-icon" />
                    <h3 className="event-modal-description-header-title">À propos</h3>
                  </div>
                  <div className="event-modal-description-content">
                    <p className={!isExpanded ? 'event-modal-description-text-clamped' : 'event-modal-description-text'}>
                      {event.description}
                    </p>
                    {event.description && (event.description.length > 150 || event.description.split('\n').length > 3) && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="event-modal-description-toggle"
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

                {/* Formulaire de réservation */}
                <div className="event-modal-description-section mt-6">
                  {canRegister && (
                    <div className="w-full flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setMessage(null);
                          setError(null);
                          setIsRegistrationOpen(true);
                        }}
                        className="mt-2 event-modal-footer-button disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        S'inscrire maintenant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modal d'inscription */}
          <AnimatePresence>
            {isRegistrationOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75"
                onClick={() => setIsRegistrationOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md mx-4 rounded-3xl bg-[#05060b] border border-white/10 p-6 md:p-7 space-y-5 shadow-[0_22px_60px_rgba(0,0,0,0.9)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-white">
                        Réserver ma place
                      </h3>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                        {event.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsRegistrationOpen(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-white/10 text-gray-400 hover:text-white hover:border-orange-500/70 hover:bg-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-300">
                      Renseignez vos informations pour bloquer votre place. Vous recevrez un{" "}
                      <span className="text-orange-400 font-medium">e‑mail de confirmation</span> avec un lien à valider.
                    </p>

                    {remainingPlaces != null && (
                      <div className="inline-flex items-center gap-2 rounded-full bg-black/60 border border-orange-500/60 px-3 py-1 text-[11px] text-orange-300 mt-1">
                        <Users size={12} className="text-orange-400" />
                        <span>
                          {remainingPlaces} place{remainingPlaces > 1 ? 's' : ''} restante{remainingPlaces > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {message && (
                    <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/40 rounded-lg px-3 py-2">
                      {message}
                    </p>
                  )}
                  {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  {!canRegister && (
                    <p className="text-sm text-amber-300 bg-black/60 border border-amber-500/60 rounded-lg px-3 py-2">
                      {isPast
                        ? "Cet événement est terminé, les inscriptions sont closes."
                        : "Cet événement est complet, aucune place n'est disponible pour le moment."}
                    </p>
                  )}

                  {canRegister && (
                    <form className="space-y-3" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Prénom
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            required
                            value={form.first_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                            placeholder="Ada"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            required
                            value={form.last_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                            placeholder="Lovelace"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-md bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                          placeholder="vous@example.com"
                        />
                      </div>
                      <div className="w-full flex justify-center">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="mt-2 event-modal-footer-button disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Envoi en cours..." : "Recevoir mon lien de confirmation"}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailModal;
