import { useState, useRef, useEffect } from 'react';
import { useSwipe } from '../../hooks/useSwipe';
import VideoCard from './VideoCard';
import RatingOverlay from './RatingOverlay';

const VideoSwiper = ({ submissions, currentIndex, onSwipeUp, onSwipeDown }) => {

    
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);

  const swipeHandlers = useSwipe({
    onSwipeUp: onSwipeUp,
    onSwipeDown: onSwipeDown,
    threshold: 100
  });

  // Réinitialiser la position lors du changement d'index
  useEffect(() => {
    setTranslateY(0);
  }, [currentIndex]);

  const currentSubmission = submissions[currentIndex];
  const nextSubmission = submissions[currentIndex + 1];
  const prevSubmission = submissions[currentIndex - 1];

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
      {...swipeHandlers}
    >
      {/* Vidéo précédente */}
      {prevSubmission && (
        <div 
          className="absolute inset-0 transform -translate-y-full"
          style={{ transform: `translateY(calc(-100% + ${translateY}px))` }}
        >
          <VideoCard submission={prevSubmission} isActive={false} />
        </div>
      )}

      {/* Vidéo actuelle */}
      {currentSubmission && (
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${translateY}px)` }}
        >
          <VideoCard submission={currentSubmission} isActive={true} />
          <RatingOverlay submission={currentSubmission} />
        </div>
      )}

      {/* Vidéo suivante */}
      {nextSubmission && (
        <div 
          className="absolute inset-0 transform translate-y-full"
          style={{ transform: `translateY(calc(100% + ${translateY}px))` }}
        >
          <VideoCard submission={nextSubmission} isActive={false} />
        </div>
      )}
    </div>
  );
};

export default VideoSwiper;