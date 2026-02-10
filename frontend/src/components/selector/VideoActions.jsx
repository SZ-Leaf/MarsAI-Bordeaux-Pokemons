import { useState, useCallback } from 'react';
import { Heart, Clock, Flag, Star } from 'lucide-react';
import RatingModal from '../modals/RatingModal';
import FavoriteButton from '../playlists/AddToFavoritesBtn';
import WatchLaterButton from '../playlists/AddToWatchLaterBtn';
import ReportButton from '../playlists/AddToReport';

import {useSubmissionPlaylistStatus} from "../../hooks/useSubmissionPlaylistStatus";

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
  const { selection, loading, toggle } = useSubmissionPlaylistStatus(submission.id);

  const onFav = useCallback(() => toggle("FAVORITES"), [toggle]);
  const onWatch = useCallback(() => toggle("WATCH_LATER"), [toggle]);
  const onReport = useCallback(() => toggle("REPORT"), [toggle]);

  // const handlePlaylistAction = async (playlistType) => {
  //   try {
  //     await addToPlaylist(submission.id, playlistType);
  //     // TODO: Ajouter un toast de succès
  //   } catch (err) {
  //     console.error(err);
  //     // TODO: Ajouter un toast d'erreur
  //   }
  // };

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
        <FavoriteButton
          submissionId={submission.id}
          active={selection === "FAVORITES"}
          onToggle={onFav}
        />
        <WatchLaterButton
          submissionId={submission.id}
          active={selection === "WATCH_LATER"}
          onToggle={onWatch}
        />
        <ActionButton
          onClick={() => setShowRatingModal(true)}
          icon={Star}
          title="Noter"
          isActive={rating > 0}
        />
        <ReportButton
          submissionId={submission.id}
          active={selection === "REPORT"}
          onToggle={onReport}
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
