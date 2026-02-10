import { Heart, Clock, Flag, Star } from 'lucide-react';
import RatingModal from '../modals/RatingModal';
import { useRatingModal } from '../../hooks/useRatingModal';
import { usePlaylistActions } from '../../hooks/usePlaylistActions';

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
  const { showRatingModal, rating, handleRatingSubmit, openModal, closeModal } = useRatingModal(rateSubmission);
  const { handlePlaylistAction } = usePlaylistActions(addToPlaylist, submission.id);

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
          onClick={openModal}
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
        onClose={closeModal}
        submission={submission}
        onSubmit={handleRatingSubmit}
      />
    </>
  );
};

export default VideoActions;
