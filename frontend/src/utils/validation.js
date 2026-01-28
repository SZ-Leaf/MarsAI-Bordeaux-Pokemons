/**
 * Fonctions de validation custom
 */

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} - True si valide
 */
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide qu'un champ est requis
 * @param {*} value - Valeur à valider
 * @returns {boolean} - True si présent
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Valide la longueur maximale
 * @param {string} value - Valeur à valider
 * @param {number} max - Longueur maximale
 * @returns {boolean} - True si valide
 */
export const validateMaxLength = (value, max) => {
  if (!value) return true; // Optionnel
  return value.length <= max;
};

/**
 * Valide le type de fichier
 * @param {File} file - Fichier à valider
 * @param {Array<string>} allowedTypes - Types MIME autorisés
 * @returns {boolean} - True si valide
 */
export const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Valide l'extension de fichier
 * @param {File} file - Fichier à valider
 * @param {Array<string>} allowedExtensions - Extensions autorisées (ex: ['.mp4', '.mov'])
 * @returns {boolean} - True si valide
 */
export const validateFileExtension = (file, allowedExtensions) => {
  if (!file) return false;
  const fileName = file.name.toLowerCase();
  return allowedExtensions.some(ext => fileName.endsWith(ext));
};

/**
 * Valide la taille d'un fichier
 * @param {File} file - Fichier à valider
 * @param {number} maxSizeMB - Taille maximale en MB
 * @returns {boolean} - True si valide
 */
export const validateFileSize = (file, maxSizeMB) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Valide une URL
 * @param {string} url - URL à valider
 * @returns {boolean} - True si valide
 */
export const validateURL = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    // Vérifier que l'URL commence par https://
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Valide un numéro de téléphone
 * Accepte les formats internationaux avec ou sans espaces, tirets, parenthèses
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {boolean} - True si valide
 */
export const validatePhone = (phone) => {
  if (!phone) return false;
  // Supprimer les espaces, tirets, parenthèses et le + pour la validation
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  // Doit contenir uniquement des chiffres et avoir entre 8 et 15 chiffres
  const phoneRegex = /^\d{8,15}$/;
  return phoneRegex.test(cleaned);
};

/**
 * Valide les données de soumission complètes
 * @param {Object} data - Données à valider
 * @returns {Object} - Objet avec erreurs { field: 'message' }
 */
export const validateSubmissionData = (data) => {
  const errors = {};
  
  // Partie 1 : CGU
  if (!data.termsAccepted) {
    errors.termsAccepted = 'Vous devez accepter les conditions d\'utilisation';
  }
  if (!data.ageConfirmed) {
    errors.ageConfirmed = 'Vous devez confirmer avoir 18 ans ou plus';
  }
  
  // Partie 2 : Métadonnées vidéo
  if (!validateRequired(data.english_title)) {
    errors.english_title = 'Le titre anglais est requis';
  } else if (!validateMaxLength(data.english_title, 255)) {
    errors.english_title = 'Le titre ne peut pas dépasser 255 caractères';
  }
  
  if (data.original_title && !validateMaxLength(data.original_title, 255)) {
    errors.original_title = 'Le titre original ne peut pas dépasser 255 caractères';
  }
  
  if (!validateRequired(data.language)) {
    errors.language = 'La langue est requise';
  }
  
  if (!validateRequired(data.english_synopsis)) {
    errors.english_synopsis = 'Le synopsis anglais est requis';
  } else if (!validateMaxLength(data.english_synopsis, 300)) {
    errors.english_synopsis = 'Le synopsis ne peut pas dépasser 300 caractères';
  }
  
  if (data.original_synopsis && !validateMaxLength(data.original_synopsis, 300)) {
    errors.original_synopsis = 'Le synopsis original ne peut pas dépasser 300 caractères';
  }
  
  if (!validateRequired(data.classification)) {
    errors.classification = 'La classification est requise';
  } else if (!['IA', 'hybrid'].includes(data.classification)) {
    errors.classification = 'Classification invalide. Valeurs acceptées : 100% IA, Hybrid';
  }
  
  if (!validateRequired(data.tech_stack)) {
    errors.tech_stack = 'La stack technique est requise';
  } else if (!validateMaxLength(data.tech_stack, 500)) {
    errors.tech_stack = 'La stack technique ne peut pas dépasser 500 caractères';
  }
  
  if (!validateRequired(data.creative_method)) {
    errors.creative_method = 'La méthode créative est requise';
  } else if (!validateMaxLength(data.creative_method, 500)) {
    errors.creative_method = 'La méthode créative ne peut pas dépasser 500 caractères';
  }
  
  // Fichiers
  if (!data.video) {
    errors.video = 'La vidéo est requise';
  } else {
    if (!validateFileExtension(data.video, ['.mp4', '.mov'])) {
      errors.video = 'Format vidéo invalide. Formats acceptés : MP4, MOV';
    } else if (!validateFileSize(data.video, 300)) {
      errors.video = 'Fichier vidéo trop volumineux. Taille maximale : 300MB';
    }
  }
  
  if (!data.cover) {
    errors.cover = 'L\'image de couverture est requise';
  } else {
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validateFileType(data.cover, allowedImageTypes)) {
      errors.cover = 'Format image invalide. Formats acceptés : JPEG, JPG, PNG';
    } else if (!validateFileSize(data.cover, 5)) {
      errors.cover = 'Image trop volumineuse. Taille maximale : 5MB';
    }
  }
  
  if (data.subtitles) {
    if (!validateFileExtension(data.subtitles, ['.srt'])) {
      errors.subtitles = 'Format sous-titres invalide. Format accepté : .srt';
    }
  }
  
  if (data.gallery && data.gallery.length > 3) {
    errors.gallery = 'Maximum 3 images dans la galerie';
  }
  
  if (data.gallery) {
    data.gallery.forEach((file, index) => {
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validateFileType(file, allowedImageTypes)) {
        errors[`gallery_${index}`] = `Image ${index + 1} : Format invalide. Formats acceptés : JPEG, JPG, PNG`;
      } else if (!validateFileSize(file, 5)) {
        errors[`gallery_${index}`] = `Image ${index + 1} : Trop volumineuse. Taille maximale : 5MB`;
      }
    });
  }
  
  // Partie 3 : Infos créateur
  if (!validateRequired(data.creator_firstname)) {
    errors.creator_firstname = 'Le prénom du créateur est requis';
  }
  
  if (!validateRequired(data.creator_lastname)) {
    errors.creator_lastname = 'Le nom du créateur est requis';
  }
  
  if (!validateRequired(data.creator_email)) {
    errors.creator_email = 'L\'email du créateur est requis';
  } else if (!validateEmail(data.creator_email)) {
    errors.creator_email = 'Email invalide';
  }
  
  if (data.creator_phone) {
    if (!validateMaxLength(data.creator_phone, 30)) {
      errors.creator_phone = 'Le téléphone ne peut pas dépasser 30 caractères';
    } else if (!validatePhone(data.creator_phone)) {
      errors.creator_phone = 'Numéro de téléphone invalide';
    }
  }
  
  if (!validateRequired(data.creator_mobile)) {
    errors.creator_mobile = 'Le mobile est requis';
  } else if (!validateMaxLength(data.creator_mobile, 30)) {
    errors.creator_mobile = 'Le mobile ne peut pas dépasser 30 caractères';
  } else if (!validatePhone(data.creator_mobile)) {
    errors.creator_mobile = 'Numéro de téléphone invalide';
  }
  
  if (!validateRequired(data.creator_gender)) {
    errors.creator_gender = 'Le genre du créateur est requis';
  }
  
  if (!validateRequired(data.creator_country)) {
    errors.creator_country = 'Le pays est requis';
  }
  
  if (!validateRequired(data.creator_address)) {
    errors.creator_address = 'L\'adresse est requise';
  }
  
  if (!validateRequired(data.referral_source)) {
    errors.referral_source = 'La source de référence est requise';
  } else if (!validateMaxLength(data.referral_source, 255)) {
    errors.referral_source = 'La source de référence ne peut pas dépasser 255 caractères';
  }
  
  // Partie 4 : Collaborateurs
  if (data.collaborators && data.collaborators.length > 0) {
    data.collaborators.forEach((collab, index) => {
      if (!validateRequired(collab.firstname)) {
        errors[`collaborator_${index}_firstname`] = 'Le prénom est requis';
      }
      if (!validateRequired(collab.lastname)) {
        errors[`collaborator_${index}_lastname`] = 'Le nom est requis';
      }
      if (!validateRequired(collab.email)) {
        errors[`collaborator_${index}_email`] = 'L\'email est requis';
      } else if (!validateEmail(collab.email)) {
        errors[`collaborator_${index}_email`] = 'Email invalide';
      }
      if (!validateRequired(collab.gender)) {
        errors[`collaborator_${index}_gender`] = 'Le genre est requis';
      }
      if (!validateRequired(collab.role)) {
        errors[`collaborator_${index}_role`] = 'Le rôle est requis';
      } else if (!validateMaxLength(collab.role, 500)) {
        errors[`collaborator_${index}_role`] = 'Le rôle ne peut pas dépasser 500 caractères';
      }
    });
  }
  
  // Partie 4 : Liens sociaux
  if (data.socials && data.socials.length > 0) {
    data.socials.forEach((social, index) => {
      if (!social.network_id || social.network_id <= 0) {
        errors[`social_${index}_network_id`] = 'Le réseau social est requis';
      }
      if (!validateRequired(social.url)) {
        errors[`social_${index}_url`] = 'L\'URL est requise';
      } else if (!validateURL(social.url)) {
        errors[`social_${index}_url`] = 'URL invalide. L\'URL doit commencer par https://';
      } else if (!validateMaxLength(social.url, 500)) {
        errors[`social_${index}_url`] = 'URL trop longue (max 500 caractères)';
      }
    });
  }
  
  return errors;
};

export default {
  validateEmail,
  validateRequired,
  validateMaxLength,
  validateFileType,
  validateFileExtension,
  validateFileSize,
  validateURL,
  validateSubmissionData
};
