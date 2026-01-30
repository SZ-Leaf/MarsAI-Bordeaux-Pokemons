import { useFileUpload } from '../../../hooks/useFileUpload';

const VideoUpload = ({ value, onChange, error }) => {
  const {
    preview,
    dragActive,
    fileInputRef,
    handleFile,
    handleDrag,
    handleDrop,
    handleRemove,
    formatFileSize
  } = useFileUpload(value, onChange, {
    createPreview: true,
    previewType: 'video'
  });

  return (
    <div className="mb-4 pl-4">
      <label className="block text-sm font-medium mb-2">
        Vidéo <span className="text-red-500">*</span>
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
          accept="video/mp4,video/quicktime,.mp4,.mov"
          onChange={(e) => handleFile(e.target.files)}
          className="hidden"
          id="video-upload"
        />
        
        {!value ? (
          <div>
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
                className="w-full max-w-md rounded mb-2 mx-auto block"
              />
            )}
            <button
              type="button"
              onClick={handleRemove}
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
