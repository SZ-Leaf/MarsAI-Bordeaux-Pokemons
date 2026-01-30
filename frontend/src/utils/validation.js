export const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

export const validateFileExtension = (file, allowedExtensions) => {
  if (!file) return false;
  const fileName = file.name.toLowerCase();
  return allowedExtensions.some(ext => fileName.endsWith(ext));
};

export const validateFileSize = (file, maxSizeMB) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateVideoFile = (file) => {
  if (!file) {
    return { valid: false, error: 'La vidéo est requise' };
  }
  
  if (!validateFileExtension(file, ['.mp4', '.mov'])) {
    return { valid: false, error: 'Format vidéo invalide. Formats acceptés : MP4, MOV' };
  }
  
  if (!validateFileSize(file, 300)) {
    return { valid: false, error: 'Fichier vidéo trop volumineux. Taille maximale : 300MB' };
  }
  
  return { valid: true, error: null };
};

export const validateImageFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { valid: false, error: 'L\'image est requise' };
  }
  
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validateFileType(file, allowedImageTypes)) {
    return { valid: false, error: 'Format image invalide. Formats acceptés : JPEG, JPG, PNG' };
  }
  
  if (!validateFileSize(file, maxSizeMB)) {
    return { valid: false, error: `Image trop volumineuse. Taille maximale : ${maxSizeMB}MB` };
  }
  
  return { valid: true, error: null };
};

export const validateSubtitlesFile = (file) => {
  if (!file) {
    return { valid: true, error: null };
  }
  
  if (!validateFileExtension(file, ['.srt'])) {
    return { valid: false, error: 'Format sous-titres invalide. Format accepté : .srt' };
  }
  
  return { valid: true, error: null };
};

export const validateGallery = (files) => {
  const errors = {};
  
  if (!files || files.length === 0) {
    return { valid: true, errors };
  }
  
  if (files.length > 3) {
    errors.gallery = 'Maximum 3 images dans la galerie';
    return { valid: false, errors };
  }
  
  files.forEach((file, index) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      errors[`gallery_${index}`] = `Image ${index + 1} : ${validation.error}`;
    }
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateFileType,
  validateFileExtension,
  validateFileSize,
  validateVideoFile,
  validateImageFile,
  validateSubtitlesFile,
  validateGallery
};
