import { useState } from 'react';
import { Heart, Clock, Flag, Star } from 'lucide-react';
import { useSelector } from '../../hooks/useSelector';

const RatingOverlay = ({ submission }) => {
  const { addToPlaylist, rateSubmission } = useSelector();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showRatingPanel, setShowRatingPanel] = useState(false);

  // ajouter à la playlist (mobilefirst)
  const handlePlaylistAction = async (playlistType) => {
    try {
      await addToPlaylist(submission.id, playlistType);
      // Afficher un toast de succès
    } catch (err) {
      console.error(err);
    }
  };

  // noter la vidéo (mobilefirst)
  const handleRating = async (value) => {
    setRating(value);
    setComment('');
    
    await rateSubmission(submission.id, value, comment);
  };

  return (
    <>
      {/* Boutons d'action latéraux */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6">
        {/* Favoris */}
        <button
          onClick={() => handlePlaylistAction('favorites')}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition">
            <Heart size={28} />
          </div>
          <span className="text-xs">Favoris</span>
        </button>

        {/* À voir plus tard */}
        <button
          onClick={() => handlePlaylistAction('watch_later')}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition">
            <Clock size={28} />
          </div>
          <span className="text-xs">Plus tard</span>
        </button>

        {/* Signaler */}
        <button
          onClick={() => handlePlaylistAction('report')}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition">
            <Flag size={28} />
          </div>
          <span className="text-xs">Signaler</span>
        </button>

        {/* Noter */}
        <button
          onClick={() => setShowRatingPanel(true)}
          className="flex flex-col items-center gap-1 text-white"
        >
          <div className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition">
            <Star size={28} fill={rating > 0 ? 'currentColor' : 'none'} />
          </div>
          <span className="text-xs">Noter</span>
        </button>
      </div>

      {/* Panel de notation */}
      {showRatingPanel && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
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

export default RatingOverlay;