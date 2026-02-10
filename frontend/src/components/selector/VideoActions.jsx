import { useState } from 'react';
import { Heart, Clock, Flag, Star } from 'lucide-react';
import RatingModal from '../modals/RatingModal';

// Composant de bouton d'action réutilisable
const ActionButton = ({ onClick, icon: Icon, title, isActive = false }) => (
  <button
    onClick={onClick}
    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
    title={title}
  >
    <Icon 
      size={20} 
      className="text-white" 
      fill={isActive ? 'currentColor' : 'none'} 
    />
  </button>
);

const VideoActions = ({ submission, addToPlaylist, rateSubmission }) => {
  const [rating, setRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handlePlaylistAction = async (playlistType) => {
    try {
      await addToPlaylist(submission.id, playlistType);
      // TODO: Ajouter un toast de succès
    } catch (err) {
      console.error(err);
      // TODO: Ajouter un toast d'erreur
    }
  };

  const handleRatingSubmit = async (submissionId, ratingValue, comment) => {
    try {
      await rateSubmission(submissionId, ratingValue, comment);
      setRating(ratingValue);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <>
      {/* Boutons d'action horizontaux */}
      <div className="flex gap-2 pointer-events-auto">
        <ActionButton
          onClick={() => handlePlaylistAction('favorites')}
          icon={Heart}
          title="Favoris"
        />
        <ActionButton
          onClick={() => handlePlaylistAction('watch_later')}
          icon={Clock}
          title="À voir plus tard"
        />
        <ActionButton
          onClick={() => setShowRatingModal(true)}
          icon={Star}
          title="Noter"
          isActive={rating > 0}
        />
        <ActionButton
          onClick={() => handlePlaylistAction('report')}
          icon={Flag}
          title="Signaler"
        />
      </div>

      {/* Modal de notation */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        submission={submission}
        onSubmit={handleRatingSubmit}
      />
    </>
  );
};

export default VideoActions;
