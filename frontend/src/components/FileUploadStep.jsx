import VideoUpload from './VideoUpload.jsx';
import FileUploader from './FileUploader.jsx';
import GalleryUpload from './GalleryUpload.jsx';

/**
 * Étape 3 : Upload des fichiers (vidéo, cover, sous-titres, galerie)
 */
const FileUploadStep = ({ formData, errors, updateField }) => {
  return (
    <div className="space-y-6 pl-4">
      <h2 className="text-2xl font-bold mb-4">Upload des fichiers</h2>
      
      <VideoUpload
        value={formData.video}
        onChange={(file) => updateField('video', file)}
        error={errors.video}
      />
      
      <FileUploader
        label="Image de couverture"
        accept="image/jpeg,image/jpg,image/png"
        maxSizeMB={5}
        value={formData.cover}
        onChange={(file) => updateField('cover', file)}
        error={errors.cover}
        required={true}
      />
      
      <FileUploader
        label="Sous-titres (.srt)"
        accept=".srt"
        value={formData.subtitles}
        onChange={(file) => updateField('subtitles', file)}
        error={errors.subtitles}
        required={false}
      />
      
      <GalleryUpload
        formData={formData}
        errors={errors}
        updateField={updateField}
      />
    </div>
  );
};

export default FileUploadStep;
