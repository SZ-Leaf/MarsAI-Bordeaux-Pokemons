import { useState, useRef, useEffect } from 'react';

export const useSwipe = ({ onSwipeUp, onSwipeDown, threshold = 50 }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = threshold;
  // début du geste de swipe (mobilefirst)
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };
  // geste de swipe en cours (mobilefirst)
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };
  // fin du geste de swipe (mobilefirst)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    // calcul de la distance du geste de swipe (mobilefirst)
    const distance = touchStart - touchEnd;
    // vérification si le geste est un swipe vers le haut (mobilefirst)
    const isUpSwipe = distance > minSwipeDistance;
    // vérification si le geste est un swipe vers le bas (mobilefirst)
    const isDownSwipe = distance < -minSwipeDistance;

    if (isUpSwipe && onSwipeUp) {
      onSwipeUp();
    }
    if (isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};