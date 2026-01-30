import { useEffect, useRef } from 'react';

/**
 * Hook pour scroller automatiquement en haut lors du changement d'étape
 * @param {number} currentStep - L'étape actuelle
 */
export const useScrollOnStepChange = (currentStep) => {
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);
};

export default useScrollOnStepChange;
