import { useState, useRef } from 'react';

/**
 * Composant d'upload de vidéo (MP4/MOV)
 * Design épuré et simple
 */
const VideoUpload = ({ value, onChange, error }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFile = (file) => {
    if (file) {
      // Créer preview
      const videoUrl = URL.createObjectURL(file);
      setPreview(videoUrl);
      onChange(file);
    } else {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      onChange(null);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  return (
    <div className="mb-4 pl-4">
      <label className="block text-sm font-medium mb-2">
        Vidéo <span className="text-red-500">*</span>
      </label>
      
      <div className={`border-2 border-dashed rounded p-6 ${error ? 'border-red-500' : 'border-gray-300'}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,.mp4,.mov"
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
          id="video-upload"
        />
        
        {!value ? (
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Glissez-déposez une vidéo ici ou{' '}
              <label htmlFor="video-upload" className="text-blue-500 cursor-pointer underline">
                cliquez pour sélectionner
              </label>
            </p>
            <p className="text-xs text-gray-500">
              Formats acceptés: MP4, MOV • Taille max: 300MB
            </p>
          </div>
        ) : (
          <div>
            <div className="text-sm mb-2">
              {value.name} ({formatFileSize(value.size)})
            </div>
            {preview && (
              <video
                src={preview}
                controls
                className="w-full max-w-md rounded mb-2"
              />
            )}
            <button
              type="button"
              onClick={() => {
                handleFile(null);
                // Réinitialiser l'input pour permettre de ré-uploader le même fichier
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-red-500 text-sm underline"
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

export default VideoUpload;
