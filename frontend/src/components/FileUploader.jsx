import { useState, useEffect, useRef } from 'react';

/**
 * Composant d'upload de fichier générique
 * Design épuré et simple
 */
const FileUploader = ({ 
  label, 
  accept, 
  maxSizeMB, 
  value, 
  onChange, 
  error,
  required = false,
  multiple = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  
  // Générer preview pour les images
  useEffect(() => {
    let isMounted = true;
    
    if (value && !Array.isArray(value) && value.type && value.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Le callback est déjà asynchrone, donc pas de problème ici
        if (isMounted) {
          setPreview(reader.result);
          previewRef.current = reader.result;
        }
      };
      reader.readAsDataURL(value);
    } else {
      // Utiliser setTimeout pour éviter l'appel synchrone
      setTimeout(() => {
        if (isMounted) {
          setPreview(null);
          previewRef.current = null;
        }
      }, 0);
    }
    
    // Cleanup
    return () => {
      isMounted = false;
      if (previewRef.current && previewRef.current.startsWith('data:')) {
        // Note: data URLs n'ont pas besoin de revokeObjectURL
        previewRef.current = null;
      }
    };
  }, [value]);
  
  const handleFile = (files) => {
    const file = multiple ? Array.from(files) : files[0];
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  const isImage = value && !Array.isArray(value) && value.type && value.type.startsWith('image/');
  
  return (
    <div className="mb-4 pl-4">
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFile(e.target.files)}
          className="hidden"
          id={`file-${label}`}
        />
        
        {!value || (Array.isArray(value) && value.length === 0) ? (
          <div>
            <p className="text-gray-600 mb-2">
              Glissez-déposez un fichier ici ou{' '}
              <label htmlFor={`file-${label}`} className="text-blue-500 cursor-pointer underline">
                cliquez pour sélectionner
              </label>
            </p>
            <p className="text-xs text-gray-500">
              {accept && `Formats acceptés: ${accept}`}
              {maxSizeMB && ` • Taille max: ${maxSizeMB}MB`}
            </p>
          </div>
        ) : (
          <div>
            {Array.isArray(value) ? (
              <div className="space-y-2">
                {value.map((file, index) => (
                  <div key={index} className="text-sm">
                    {file.name} ({formatFileSize(file.size)})
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="text-sm mb-2">
                  {value.name} ({formatFileSize(value.size)})
                </div>
                {isImage && preview && (
                  <div className="mt-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-64 mx-auto rounded border"
                    />
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setPreview(null);
                // Réinitialiser l'input pour permettre de ré-uploader le même fichier
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="mt-2 text-red-500 text-sm underline"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FileUploader;
