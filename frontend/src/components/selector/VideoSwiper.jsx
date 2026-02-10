import { useState, useRef, useEffect } from 'react';
import { useSwipe } from '../../hooks/useSwipe';
import { useSubmissionPlaylistStatus } from '../../hooks/useSubmissionPlaylistStatus';
import { useSubmissionRatingStatus } from '../../hooks/useSubmissionRatingStatus';
import VideoCard from './VideoCard';
import MobileBottomNav from './MobileBottomNav';

const VideoSwiper = ({ submissions, currentIndex, onSwipeUp, onSwipeDown, addToPlaylist, rateSubmission }) => {
  const containerRef = useRef(null);
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

  const { toggle, selection } = useSubmissionPlaylistStatus(currentSubmission?.id);
  const { hasRating, markAsRated } = useSubmissionRatingStatus(currentSubmission?.id);

  return (
    <>
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
            <VideoCard 
              submission={prevSubmission} 
              isActive={false}
              addToPlaylist={addToPlaylist}
              rateSubmission={rateSubmission}
              selection={selection}
              toggle={toggle}
              hasRating={hasRating}
              markAsRated={markAsRated}
            />
          </div>
        )}

        {/* Vidéo actuelle */}
        {currentSubmission && (
          <div 
            className="absolute inset-0"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            <VideoCard 
              submission={currentSubmission} 
              isActive={true}
              addToPlaylist={addToPlaylist}
              rateSubmission={rateSubmission}
              selection={selection}
              toggle={toggle}
              hasRating={hasRating}
              markAsRated={markAsRated}
            />
          </div>
        )}

        {/* Vidéo suivante */}
        {nextSubmission && (
          <div 
            className="absolute inset-0 transform translate-y-full"
            style={{ transform: `translateY(calc(100% + ${translateY}px))` }}
          >
            <VideoCard 
              submission={nextSubmission} 
              isActive={false}
              addToPlaylist={addToPlaylist}
              rateSubmission={rateSubmission}
              selection={selection}
              toggle={toggle}
              hasRating={hasRating}
              markAsRated={markAsRated}
            />
          </div>
        )}
      </div>

      {/* Navigation mobile en bas (visible uniquement mobile) */}
      <MobileBottomNav 
        onFavoriteClick={() => toggle('FAVORITES')}
        onWatchLaterClick={() => toggle('WATCH_LATER')}
        onReportClick={() => toggle('REPORT')}
        currentSubmission={currentSubmission}
        rateSubmission={rateSubmission}
        selection={selection}
        hasRating={hasRating}
        markAsRated={markAsRated}
      />
    </>
  );
};

export default VideoSwiper;