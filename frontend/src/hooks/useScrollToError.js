import { useEffect, useRef } from 'react';

export const useScrollToError = (errors) => {
  const prevErrorsRef = useRef(errors);

  useEffect(() => {
    const errorKeys = Object.keys(errors);
    
    // On ne déclenche le scroll que si on a des erreurs et qu'elles ont changé
    if (errorKeys.length > 0 && JSON.stringify(prevErrorsRef.current) !== JSON.stringify(errors)) {
      console.log('Déclenchement du scroll vers l\'erreur pour:', errorKeys);
      
      // Laisser le temps au React de rendre les messages d'erreur dans le DOM
      const timer = setTimeout(() => {
        // Sélecteurs pour trouver les éléments en erreur (message ou bordure rouge)
        const errorSelectors = [
          '.text-red-500', 
          '.border-red-500', 
          '[class*="border-red"]',
          '.invalid-feedback'
        ];
        
        let firstErrorElement = null;
        
        // Trouver le premier élément visible qui correspond à un sélecteur d'erreur
        for (const selector of errorSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            // Filtrer pour prendre le premier élément qui n'est pas caché
            firstErrorElement = Array.from(elements).find(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetHeight > 0;
            });
            if (firstErrorElement) break;
          }
        }

        if (firstErrorElement) {
          console.log('Élément d\'erreur trouvé, tentative de scroll');
          
          // Chercher le conteneur scrollable (Modal ou Window)
          const modalContent = document.querySelector('.modal-content');
          
          if (modalContent) {
            // Calculer la position relative dans la modal
            const elementRect = firstErrorElement.getBoundingClientRect();
            const containerRect = modalContent.getBoundingClientRect();
            const relativeTop = elementRect.top - containerRect.top + modalContent.scrollTop;
            
            modalContent.scrollTo({
              top: Math.max(0, relativeTop - 100), // Garder une marge en haut
              behavior: 'smooth'
            });
          } else {
            // Scroll standard de la page
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }

          // Tenter de donner le focus au champ associé
          const field = firstErrorElement.tagName === 'P' 
            ? (firstErrorElement.previousElementSibling?.querySelector('input, textarea, select') || 
               firstErrorElement.parentElement?.querySelector('input, textarea, select'))
            : firstErrorElement;
            
          if (field && typeof field.focus === 'function') {
            setTimeout(() => field.focus(), 300);
          }
        } else {
          console.warn('Aucun élément d\'erreur visible trouvé dans le DOM');
          // Fallback : remonter en haut du conteneur actif
          const modalContent = document.querySelector('.modal-content');
          if (modalContent) {
            modalContent.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }, 100);
      
      prevErrorsRef.current = errors;
      return () => clearTimeout(timer);
    }
  }, [errors]);
};

export default useScrollToError;
