import { useState } from 'react';
import { Heart, Clock, Flag, Star } from 'lucide-react';

const VideoActions = ({ submission, addToPlaylist, rateSubmission }) => {
  const [rating, setRating] = useState(0);
  const [showRatingPanel, setShowRatingPanel] = useState(false);

  const handlePlaylistAction = async (playlistType) => {
    try {
      await addToPlaylist(submission.id, playlistType);
      // TODO: Ajouter un toast de succès
    } catch (err) {
      console.error(err);
      // TODO: Ajouter un toast d'erreur
    }
  };

  const handleRating = async (value) => {
    setRating(value);
    try {
      await rateSubmission(submission.id, value, '');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Boutons d'action horizontaux */}
      <div className="flex gap-2 pointer-events-auto">
        <button
          onClick={() => handlePlaylistAction('favorites')}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
          title="Favoris"
        >
          <Heart size={20} className="text-white" />
        </button>
        <button
          onClick={() => handlePlaylistAction('watch_later')}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
          title="À voir plus tard"
        >
          <Clock size={20} className="text-white" />
        </button>
        <button
          onClick={() => setShowRatingPanel(true)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
          title="Noter"
        >
          <Star 
            size={20} 
            className="text-white" 
            fill={rating > 0 ? 'currentColor' : 'none'} 
          />
        </button>
        <button
          onClick={() => handlePlaylistAction('report')}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
          title="Signaler"
        >
          <Flag size={20} className="text-white" />
        </button>
      </div>

      {/* Panel de notation */}
      {showRatingPanel && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Noter cette vidéo</h3>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => {
                    handleRating(value);
                    setShowRatingPanel(false);
                  }}
                  className="p-2 hover:scale-110 transition"
                >
                  <Star
                    size={36}
                    fill={value <= rating ? '#FFD700' : 'none'}
                    stroke={value <= rating ? '#FFD700' : '#999'}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRatingPanel(false)}
              className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoActions;
