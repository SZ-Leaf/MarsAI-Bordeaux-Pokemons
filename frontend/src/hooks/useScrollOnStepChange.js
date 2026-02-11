import { useEffect, useRef } from 'react';

export const useScrollOnStepChange = (currentStep) => {
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      console.log('Changement d\'étape détecté:', prevStepRef.current, '->', currentStep);
      
      const performScroll = () => {
        const modalContent = document.querySelector('.modal-content');
        
        if (modalContent) {
          // scroll vers le haut de la modal 
          modalContent.scrollTo({ top: 0, behavior: 'auto' });
          
          // forcer le scroll au cas où 'auto' échoue
          modalContent.scrollTop = 0;
        } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
      };

      // timeout pour s'assurer que le DOM de la nouvelle étape est prêt
      const timer = setTimeout(performScroll, 50);
      
      prevStepRef.current = currentStep;
      return () => clearTimeout(timer);
    }
  }, [currentStep]);
};

export default useScrollOnStepChange;