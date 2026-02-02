import { useState, useRef, useEffect } from 'react';
import { formatFileSize, resetFileInput } from '../utils/fileUtils';

export const useFileUpload = (value, onChange, options = {}) => {
  const {
    createPreview = true,
    previewType = 'image',
    multiple = false
  } = options;

  const [preview, setPreview] = useState(multiple ? [] : null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const previewRef = useRef(multiple ? [] : null);

  useEffect(() => {
    let isMounted = true;
    
    if (createPreview && value) {
      const createUrl = (file) => {
        if (previewType === 'image' && file.type?.startsWith('image/')) {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        } else {
          return Promise.resolve(URL.createObjectURL(file));
        }
      };

      if (multiple && Array.isArray(value)) {
        const oldUrls = Array.isArray(previewRef.current) ? previewRef.current : [];
        oldUrls.forEach(url => {
          if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
        });
        
        Promise.all(value.map(createUrl)).then(urls => {
          if (isMounted) {
            setPreview(urls);
            previewRef.current = urls;
          }
        });
      } else if (!Array.isArray(value)) {
        if (previewRef.current?.startsWith?.('blob:')) {
          URL.revokeObjectURL(previewRef.current);
        }
        
        createUrl(value).then(url => {
          if (isMounted) {
            setPreview(url);
            previewRef.current = url;
          }
        });
      }
    } else {
      setTimeout(() => {
        if (isMounted) {
          setPreview(multiple ? [] : null);
        }
      }, 0);
    }

    return () => {
      isMounted = false;
      if (Array.isArray(previewRef.current)) {
        previewRef.current.forEach(url => {
          if (url?.startsWith?.('blob:')) URL.revokeObjectURL(url);
        });
      } else if (previewRef.current?.startsWith?.('blob:')) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, [value, createPreview, previewType, multiple]);

  const handleFile = (files) => {
    const file = multiple ? Array.from(files || []) : files?.[0];
    onChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) {
      handleFile(e.dataTransfer.files);
    }
  };

  const handleRemove = () => {
    onChange(null);
    resetFileInput(fileInputRef);
  };

  return {
    preview,
    dragActive,
    fileInputRef,
    handleFile,
    handleDrag,
    handleDrop,
    handleRemove,
    formatFileSize
  };
};
