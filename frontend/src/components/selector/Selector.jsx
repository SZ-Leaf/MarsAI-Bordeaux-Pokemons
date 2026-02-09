import { useSelector } from '../../hooks/useSelector';
import VideoSwiper from './VideoSwiper.jsx';

const Selector = () => {
  const {
    submissions,
    currentIndex,
    loading,
    error,
    goToNext,
    goToPrevious
  } = useSelector();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl">Erreur: {error}</div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-white text-xl">Aucune soumission disponible</div>
      </div>
    );
  }

  return (    
    <VideoSwiper
      submissions={submissions}
      currentIndex={currentIndex}
      onSwipeUp={goToNext}
      onSwipeDown={goToPrevious}
    />
  );
};

export default Selector;