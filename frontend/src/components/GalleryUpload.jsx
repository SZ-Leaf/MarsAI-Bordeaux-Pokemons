import FileUploader from './FileUploader.jsx';

/**
 * Composant upload galerie (3 images max)
 * Design épuré et simple
 */
const GalleryUpload = ({ formData, errors, updateField }) => {
  const handleGalleryChange = (files) => {
    if (files && files.length > 3) {
      // Limiter à 3 fichiers
      updateField('gallery', Array.from(files).slice(0, 3));
    } else {
      updateField('gallery', files || []);
    }
  };
  
  return (
    <div className="mb-6 pl-4">
      <h3 className="text-lg font-medium mb-4">Galerie d'images</h3>
      <p className="text-sm text-gray-600 mb-4">
        Ajoutez jusqu'à 3 images pour illustrer votre vidéo (optionnel).
      </p>
      
      <FileUploader
        label="Images de galerie"
        accept="image/jpeg,image/jpg,image/png"
        maxSizeMB={5}
        value={formData.gallery}
        onChange={handleGalleryChange}
        error={errors.gallery}
        multiple={true}
      />
      
      {formData.gallery && formData.gallery.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {formData.gallery.map((file, index) => {
            const preview = URL.createObjectURL(file);
            return (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded border"
                />
                {errors[`gallery_${index}`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`gallery_${index}`]}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GalleryUpload;
