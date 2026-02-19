import { useNavigate } from 'react-router';
import RatingModal from '../modals/RatingModal';
import { useRatingModal } from '../../hooks/useRatingModal';
import '../../styles.css';


const MobileBottomNav = ({ 
  onFavoriteClick, 
  onWatchLaterClick, 
  onReportClick,
  currentSubmission,
  rateSubmission,
  selection,
  hasRating,
  markAsRated
}) => {
  const navigate = useNavigate();
  const { showRatingModal, handleRatingSubmit, openModal, closeModal } = useRatingModal(rateSubmission);

  // Wrapper pour openModal qui marque comme noté après soumission
  const handleOpenModal = () => {
    openModal();
  };

  const handleRatingSubmitWithMark = async (submissionId, ratingValue, comment) => {
    await handleRatingSubmit(submissionId, ratingValue, comment);
    markAsRated(); // Marquer comme noté
  };
  
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
          className="btn-mobile-nav btn-mobile-nav-home"
          aria-label="Accueil"
        >
          <i className="pi pi-home btn-mobile-nav-icon"></i>
          <span className="btn-mobile-nav-text">Accueil</span>
        </button>
        
        <button 
          onClick={onFavoriteClick}
          className={`btn-mobile-nav ${selection === 'FAVORITES' ? 'btn-mobile-nav-favorite-active' : 'btn-mobile-nav-favorite'}`}
          aria-label="J'aime"
        >
          <i className={`pi pi-heart${selection === 'FAVORITES' ? '-fill' : ''} btn-mobile-nav-icon`}></i>
          <span className="btn-mobile-nav-text">J'aime</span>
        </button>
        
        <button 
          onClick={handleOpenModal}
          className={`btn-mobile-nav ${hasRating ? 'btn-mobile-nav-rating-active' : 'btn-mobile-nav-rating'}`}
          aria-label="Noter"
        >
          <i className="pi pi-star btn-mobile-nav-icon"></i>
          <span className="btn-mobile-nav-text">Noter</span>
        </button>
        
        <button 
          onClick={onWatchLaterClick}
          className={`btn-mobile-nav ${selection === 'WATCH_LATER' ? 'btn-mobile-nav-watch-later-active' : 'btn-mobile-nav-watch-later'}`}
          aria-label="Plus tard"
        >
          <i className="pi pi-history btn-mobile-nav-icon"></i>
          <span className="btn-mobile-nav-text">Plus tard</span>
        </button>
        
        <button 
          onClick={onReportClick}
          className={`btn-mobile-nav ${selection === 'REPORT' ? 'btn-mobile-nav-report-active' : 'btn-mobile-nav-report'}`}
          aria-label="Signaler"
        >
          <i className="pi pi-flag btn-mobile-nav-icon"></i>
          <span className="btn-mobile-nav-text">Signaler</span>
        </button>
      </nav>

      {/* Modal de notation */}
      {currentSubmission && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={closeModal}
          submission={currentSubmission}
          onSubmit={handleRatingSubmitWithMark}
        />
      )}
    </>
  );
};

export default MobileBottomNav;
