import { useFileUpload } from '../../../../../hooks/useFileUpload';

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
    previewType: 'image',
    multiple
  });
  
  return (
    <div className="mb-4 pl-4">
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div
        className={`border-2 border-dashed rounded p-6 text-center ${
          dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
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
            <p className="text-gray-300 mb-2">
              Glissez-déposez un fichier ici ou{' '}
              <label htmlFor={`file-${label}`} className="text-blue-500 cursor-pointer underline">
                cliquez pour sélectionner
              </label>
            </p>
            <p className="text-xs text-gray-400">
              {accept && `Formats acceptés: ${accept}`}
              {maxSizeMB && ` • Taille max: ${maxSizeMB}MB`}
            </p>
          </div>
        ) : (
          <div>
            {Array.isArray(value) ? (
              <div className="space-y-2">
                {value.map((file, index) => (
                  <div key={index} className="text-sm text-white">
                    {file.name} ({formatFileSize(file.size)})
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="text-sm mb-2 text-white">
                  {value.name} ({formatFileSize(value.size)})
                </div>
                {preview && (
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
              onClick={handleRemove}
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
