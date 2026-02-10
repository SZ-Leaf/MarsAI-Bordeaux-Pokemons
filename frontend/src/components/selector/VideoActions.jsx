import { useState, useCallback } from 'react';
import RatingModal from '../modals/RatingModal';
import FavoriteButton from '../playlists/AddToFavoritesBtn';
import WatchLaterButton from '../playlists/AddToWatchLaterBtn';
import ReportButton from '../playlists/AddToReport';
import RatingButton from '../playlists/AddToRatingBtn';


const VideoActions = ({ submission, addToPlaylist, rateSubmission, selection, toggle, hasRating, markAsRated }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);

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
      markAsRated();
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
        <RatingButton
          submissionId={submission.id}
          active={hasRating}
          onToggle={() => setShowRatingModal(true)}
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
