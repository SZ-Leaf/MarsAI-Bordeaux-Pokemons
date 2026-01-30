import { useState, useEffect, useRef } from 'react';

export const useFilePreviews = (files) => {
  const [previews, setPreviews] = useState([]);
  const previewUrlsRef = useRef([]);

  useEffect(() => {
    let isMounted = true;
    
    // Nettoyer les anciens previews
    previewUrlsRef.current.forEach(url => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    previewUrlsRef.current = [];

    if (files && files.length > 0) {
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      previewUrlsRef.current = newPreviewUrls;
      
      setTimeout(() => {
        if (isMounted) {
          setPreviews(newPreviewUrls);
        }
      }, 0);
    } else {
      setTimeout(() => {
        if (isMounted) {
          setPreviews([]);
        }
      }, 0);
    }

    return () => {
      isMounted = false;
      previewUrlsRef.current.forEach(url => {
        if (url?.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      previewUrlsRef.current = [];
    };
  }, [files]);

  return previews;
};
