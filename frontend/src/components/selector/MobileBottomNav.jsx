import { Heart, Clock, Flag, Star, Home } from 'lucide-react';
import { useNavigate } from 'react-router';
import RatingModal from '../modals/RatingModal';
import { useRatingModal } from '../../hooks/useRatingModal';

const MobileBottomNav = ({ 
  onFavoriteClick, 
  onWatchLaterClick, 
  onReportClick,
  currentSubmission,
  rateSubmission 
}) => {
  const navigate = useNavigate();
  const { showRatingModal, handleRatingSubmit, openModal, closeModal } = useRatingModal(rateSubmission);
  
  return (
    <>
      <nav className="
        fixed bottom-0 left-0 right-0
        h-20
        bg-black/90 backdrop-blur-lg
        border-t border-white/10
        flex justify-around items-center
        z-50
        md:hidden
      ">
        <button 
          onClick={() => navigate('/')}
          className="flex flex-col items-center gap-1 text-white/70 active:text-white"
        >
          <Home size={22} />
          <span className="text-xs">Accueil</span>
        </button>
        
        <button 
          onClick={onFavoriteClick}
          className="flex flex-col items-center gap-1 text-white/70 active:text-yellow-400"
        >
          <Heart size={22} />
          <span className="text-xs">J'aime</span>
        </button>
        
        <button 
          onClick={openModal}
          className="flex flex-col items-center gap-1 text-white/70 active:text-yellow-500"
        >
          <Star size={22} />
          <span className="text-xs">Noter</span>
        </button>
        
        <button 
          onClick={onWatchLaterClick}
          className="flex flex-col items-center gap-1 text-white/70 active:text-blue-400"
        >
          <Clock size={22} />
          <span className="text-xs">Plus tard</span>
        </button>
        
        <button 
          onClick={onReportClick}
          className="flex flex-col items-center gap-1 text-white/70 active:text-red-400"
        >
          <Flag size={22} />
          <span className="text-xs">Signaler</span>
        </button>
      </nav>

      {/* Modal de notation */}
      {currentSubmission && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={closeModal}
          submission={currentSubmission}
          onSubmit={handleRatingSubmit}
        />
      )}
    </>
  );
};

export default MobileBottomNav;
