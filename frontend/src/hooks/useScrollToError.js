import { useEffect, useRef } from 'react';

export const useScrollToError = (errors) => {
  const prevErrorsRef = useRef(errors);

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0 && JSON.stringify(prevErrorsRef.current) !== JSON.stringify(errors)) {
      // Attendre un peu pour que le DOM soit mis à jour
      setTimeout(() => {
        // Chercher d'abord les messages d'erreur (plus fiable)
        const errorMessages = document.querySelectorAll('.text-red-500');
        if (errorMessages.length > 0) {
          const firstError = errorMessages[0];
          // Chercher le champ associé (input/textarea/select avant le message d'erreur)
          let fieldElement = firstError.previousElementSibling;
          
          if (!fieldElement || !['INPUT', 'TEXTAREA', 'SELECT'].includes(fieldElement.tagName)) {
            // Chercher dans le parent
            const parent = firstError.parentElement;
            if (parent) {
              fieldElement = parent.querySelector('input, textarea, select');
            }
          }
          
          if (fieldElement) {
            fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fieldElement.focus();
            return;
          } else {
            // Si pas de champ trouvé, scroller vers le message d'erreur
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
          }
        }
        
        // Fallback : chercher les champs avec border-red-500
        const errorFields = document.querySelectorAll('.border-red-500');
        if (errorFields.length > 0) {
          const firstField = errorFields[0];
          firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(firstField.tagName)) {
            firstField.focus();
          }
          return;
        }
        
        // Dernier recours : remonter en haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 150);
      
      prevErrorsRef.current = errors;
    }
  }, [errors]);
};

export default useScrollToError;
