import { useRef, useMemo } from 'react';
import { useFilePreviews } from '../hooks/useFilePreviews';
import { formatFileSize, resetFileInput } from '../utils/fileUtils';

const GalleryUpload = ({ formData, errors, updateField }) => {
  const fileInputRef = useRef(null);
  
  const gallery = useMemo(() => formData.gallery || [], [formData.gallery]);
  const previews = useFilePreviews(gallery);
  
  const maxImages = 3;
  const canAddMore = gallery.length < maxImages;
  
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const currentCount = gallery.length;
    const remainingSlots = maxImages - currentCount;
    const filesToAdd = files.slice(0, remainingSlots);
    
    if (filesToAdd.length > 0) {
      updateField('gallery', [...gallery, ...filesToAdd]);
    }
    
    resetFileInput(fileInputRef);
  };
  
  const handleRemoveImage = (index) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    updateField('gallery', newGallery);
  };
  
  return (
    <div className="mb-6 pl-4">
      <h3 className="text-lg font-medium mb-4">Galerie d'images</h3>
      <p className="text-sm text-gray-600 mb-4">
        Ajoutez jusqu'à 3 images pour illustrer votre vidéo (optionnel).
        {gallery.length > 0 && ` (${gallery.length}/${maxImages})`}
      </p>
      
      {canAddMore && (
        <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            multiple={true}
            onChange={handleAddImages}
            className="hidden"
            id="gallery-upload"
          />
          <label
            htmlFor="gallery-upload"
            className="text-blue-500 cursor-pointer underline"
          >
            Cliquez pour ajouter {gallery.length === 0 ? 'des images' : 'une image supplémentaire'}
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Formats acceptés: JPEG, JPG, PNG • Taille max: 5MB par image
          </p>
        </div>
      )}
      
      {gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {gallery.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={previews[index]}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                title="Supprimer cette image"
              >
                ×
              </button>
              <div className="text-xs text-gray-600 mt-1 truncate">
                {file.name}
              </div>
              <div className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </div>
              {errors[`gallery_${index}`] && (
                <p className="text-red-500 text-xs mt-1">{errors[`gallery_${index}`]}</p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {errors.gallery && (
        <p className="text-red-500 text-sm mt-2">{errors.gallery}</p>
      )}
    </div>
  );
};

export default GalleryUpload;
