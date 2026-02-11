import { useEffect, useRef } from 'react';

export const useScrollOnStepChange = (currentStep) => {
  const prevStepRef = useRef(currentStep);

  useEffect(() => {

    if (prevStepRef.current !== currentStep) {
      const modalContent = document.querySelector('.modal-content');
      if (modalContent) {
        modalContent.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);
};

export default useScrollOnStepChange;
