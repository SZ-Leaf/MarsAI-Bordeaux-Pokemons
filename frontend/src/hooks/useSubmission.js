import { useState } from 'react';
import { submitFilm } from '../utils/api.js';
import { validateSubmissionData, validateEmail, validateName, validatePhone, validateURL } from '../utils/validation.js';

/**
 * Hook de gestion de soumission de film
 */
export const useSubmission = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    // Partie 1 : CGU
    termsAccepted: false,
    ageConfirmed: false,
    
    // Partie 2 : Métadonnées vidéo
    english_title: '',
    original_title: '',
    language: '',
    english_synopsis: '',
    original_synopsis: '',
    classification: '',
    tech_stack: '',
    creative_method: '',
    
    // Fichiers
    video: null,
    cover: null,
    subtitles: null,
    gallery: [],
    
    // Partie 3 : Infos créateur
    creator_firstname: '',
    creator_lastname: '',
    creator_email: '',
    creator_phone: '',
    creator_mobile: '',
    creator_gender: '',
    creator_country: '',
    creator_address: '',
    referral_source: '',
    
    // Partie 4 : Contributeurs
    collaborators: [],
    socials: []
  });
  
  // Erreurs de validation
  const [errors, setErrors] = useState({});
  
  /**
   * Met à jour un champ du formulaire
   */
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validation en temps réel pour les emails
    if (field === 'creator_email') {
      if (value.trim() && !validateEmail(value.trim())) {
        setErrors(prev => ({
          ...prev,
          [field]: 'Email invalide'
        }));
      } else {
        // Effacer l'erreur si l'email est valide ou vide
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } else {
      // Effacer l'erreur du champ si présente
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };
  
  /**
   * Met à jour un collaborateur spécifique
   */
  const updateCollaboratorField = (index, field, value) => {
    const newCollaborators = [...formData.collaborators];
    newCollaborators[index] = {
      ...newCollaborators[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      collaborators: newCollaborators
    }));
    
    // Validation en temps réel pour les emails de collaborateurs
    if (field === 'email') {
      const errorKey = `collaborator_${index}_email`;
      if (value.trim() && !validateEmail(value.trim())) {
        setErrors(prev => ({
          ...prev,
          [errorKey]: 'Email invalide'
        }));
      } else {
        // Effacer l'erreur si l'email est valide ou vide
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    } else {
      // Effacer l'erreur du champ si présente
      const errorKey = `collaborator_${index}_${field}`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
  };
  
  /**
   * Met à jour un lien social spécifique avec validation
   */
  const updateSocialField = (index, field, value) => {
    const newSocials = [...formData.socials];
    newSocials[index] = {
      ...newSocials[index],
      [field]: field === 'network_id' ? (value === '' ? '' : parseInt(value)) : value
    };
    setFormData(prev => ({
      ...prev,
      socials: newSocials
    }));
    
    // Validation en temps réel
    if (field === 'network_id') {
      const errorKey = `social_${index}_network_id`;
      if (!value || value === '') {
        setErrors(prev => ({
          ...prev,
          [errorKey]: 'Le réseau social est requis'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    } else if (field === 'url') {
      const errorKey = `social_${index}_url`;
      if (!value.trim()) {
        setErrors(prev => ({
          ...prev,
          [errorKey]: 'L\'URL est requise'
        }));
      } else if (!validateURL(value.trim())) {
        setErrors(prev => ({
          ...prev,
          [errorKey]: 'URL invalide. L\'URL doit commencer par https://'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
  };
  
  /**
   * Valide l'étape actuelle
   */
  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.termsAccepted) {
          stepErrors.termsAccepted = 'Vous devez accepter les conditions d\'utilisation';
        }
        if (!formData.ageConfirmed) {
          stepErrors.ageConfirmed = 'Vous devez confirmer avoir 18 ans ou plus';
        }
        break;
        
      case 2:
        // Validation métadonnées vidéo (champs texte uniquement, pas d'upload)
        if (!formData.english_title) stepErrors.english_title = 'Requis';
        if (!formData.language) stepErrors.language = 'Requis';
        if (!formData.english_synopsis) stepErrors.english_synopsis = 'Requis';
        if (!formData.classification) stepErrors.classification = 'Requis';
        if (!formData.tech_stack) stepErrors.tech_stack = 'Requis';
        if (!formData.creative_method) stepErrors.creative_method = 'Requis';
        break;
        
      case 3:
        // Validation des uploads de fichiers
        if (!formData.video) stepErrors.video = 'Requis';
        if (!formData.cover) stepErrors.cover = 'Requis';
        break;
        
      case 4:
        // Validation infos créateur
        if (!formData.creator_firstname) {
          stepErrors.creator_firstname = 'Requis';
        } else if (!validateName(formData.creator_firstname.trim())) {
          stepErrors.creator_firstname = 'Le prénom ne doit contenir que des lettres';
        }
        if (!formData.creator_lastname) {
          stepErrors.creator_lastname = 'Requis';
        } else if (!validateName(formData.creator_lastname.trim())) {
          stepErrors.creator_lastname = 'Le nom ne doit contenir que des lettres';
        }
        if (!formData.creator_email) {
          stepErrors.creator_email = 'Requis';
        } else if (!validateEmail(formData.creator_email.trim())) {
          stepErrors.creator_email = 'Email invalide';
        }
        if (formData.creator_phone && !validatePhone(formData.creator_phone.trim())) {
          stepErrors.creator_phone = 'Numéro de téléphone invalide';
        }
        if (!formData.creator_mobile) {
          stepErrors.creator_mobile = 'Requis';
        } else if (!validatePhone(formData.creator_mobile.trim())) {
          stepErrors.creator_mobile = 'Numéro de téléphone invalide';
        }
        if (!formData.creator_gender) stepErrors.creator_gender = 'Requis';
        if (!formData.creator_country) stepErrors.creator_country = 'Requis';
        if (!formData.creator_address) stepErrors.creator_address = 'Requis';
        if (!formData.referral_source) stepErrors.referral_source = 'Requis';
        
        // Validation des réseaux sociaux si des liens sont ajoutés
        // Si l'utilisateur a ajouté des réseaux sociaux, ils doivent tous être valides
        if (formData.socials && formData.socials.length > 0) {
          formData.socials.forEach((social, index) => {
            if (!social.network_id || social.network_id <= 0 || social.network_id === '') {
              stepErrors[`social_${index}_network_id`] = 'Le réseau social est requis';
            }
            if (!social.url || !social.url.trim()) {
              stepErrors[`social_${index}_url`] = 'L\'URL est requise';
            } else if (!validateURL(social.url.trim())) {
              stepErrors[`social_${index}_url`] = 'URL invalide. L\'URL doit commencer par https://';
            }
          });
        }
        
        // Validation des contributeurs si des contributeurs sont ajoutés
        // Si l'utilisateur a ajouté des contributeurs, ils doivent tous être complets
        if (formData.collaborators && formData.collaborators.length > 0) {
          formData.collaborators.forEach((collab, index) => {
            if (!collab.firstname || !collab.firstname.trim()) {
              stepErrors[`collaborator_${index}_firstname`] = 'Le prénom est requis';
            } else if (!validateName(collab.firstname.trim())) {
              stepErrors[`collaborator_${index}_firstname`] = 'Le prénom ne doit contenir que des lettres';
            }
            if (!collab.lastname || !collab.lastname.trim()) {
              stepErrors[`collaborator_${index}_lastname`] = 'Le nom est requis';
            } else if (!validateName(collab.lastname.trim())) {
              stepErrors[`collaborator_${index}_lastname`] = 'Le nom ne doit contenir que des lettres';
            }
            if (!collab.email || !collab.email.trim()) {
              stepErrors[`collaborator_${index}_email`] = 'L\'email est requis';
            } else if (!validateEmail(collab.email.trim())) {
              stepErrors[`collaborator_${index}_email`] = 'Email invalide';
            }
            if (!collab.gender || !collab.gender.trim()) {
              stepErrors[`collaborator_${index}_gender`] = 'Le genre est requis';
            }
            if (!collab.role || !collab.role.trim()) {
              stepErrors[`collaborator_${index}_role`] = 'Le rôle est requis';
            } else if (collab.role.trim().length > 500) {
              stepErrors[`collaborator_${index}_role`] = 'Le rôle ne peut pas dépasser 500 caractères';
            }
          });
        }
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };
  
  /**
   * Passe à l'étape suivante
   */
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  
  /**
   * Retourne à l'étape précédente
   */
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  /**
   * Détermine l'étape contenant les erreurs
   */
  const getStepWithErrors = (errors) => {
    // Étape 1 : CGU
    if (errors.termsAccepted || errors.ageConfirmed) {
      return 1;
    }
    
    // Étape 2 : Métadonnées vidéo (champs texte uniquement)
    if (errors.english_title || errors.original_title || errors.language || 
        errors.english_synopsis || errors.original_synopsis || errors.classification ||
        errors.tech_stack || errors.creative_method) {
      return 2;
    }
    
    // Étape 3 : Uploads de fichiers
    if (errors.video || errors.cover || errors.subtitles || errors.gallery ||
        Object.keys(errors).some(key => key.startsWith('gallery_'))) {
      return 3;
    }
    
    // Étape 4 : Réalisateur et Contributeurs
    if (errors.creator_firstname || errors.creator_lastname || errors.creator_email ||
        errors.creator_phone || errors.creator_mobile || errors.creator_gender ||
        errors.creator_country || errors.creator_address || errors.referral_source ||
        Object.keys(errors).some(key => key.startsWith('social_')) ||
        Object.keys(errors).some(key => key.startsWith('collaborator_'))) {
      return 4;
    }
    
    // Par défaut, retourner à l'étape 1
    return 1;
  };
  
  /**
   * Soumet le formulaire complet
   */
  const submit = async () => {
    // Validation complète
    const validationErrors = validateSubmissionData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Rediriger vers l'étape contenant les erreurs
      const stepWithErrors = getStepWithErrors(validationErrors);
      setCurrentStep(stepWithErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    try {
      // Créer FormData
      const formDataToSend = new FormData();
      
      // Ajouter fichiers
      formDataToSend.append('video', formData.video);
      formDataToSend.append('cover', formData.cover);
      if (formData.subtitles) {
        formDataToSend.append('subtitles', formData.subtitles);
      }
      if (formData.gallery && Array.isArray(formData.gallery)) {
        formData.gallery.forEach(file => {
          formDataToSend.append('gallery', file);
        });
      }
      
      // Préparer données JSON
      const data = {
        english_title: formData.english_title,
        original_title: formData.original_title || undefined,
        language: formData.language,
        english_synopsis: formData.english_synopsis,
        original_synopsis: formData.original_synopsis || undefined,
        classification: formData.classification,
        tech_stack: formData.tech_stack,
        creative_method: formData.creative_method,
        creator_firstname: formData.creator_firstname,
        creator_lastname: formData.creator_lastname,
        creator_email: formData.creator_email,
        creator_phone: formData.creator_phone || undefined,
        creator_mobile: formData.creator_mobile,
        creator_gender: formData.creator_gender,
        creator_country: formData.creator_country,
        creator_address: formData.creator_address,
        referral_source: formData.referral_source || undefined,
        terms_of_use: formData.termsAccepted,
        collaborators: (formData.collaborators && formData.collaborators.length > 0) ? formData.collaborators : undefined,
        socials: (formData.socials && formData.socials.length > 0) ? formData.socials : undefined
      };
      
      formDataToSend.append('data', JSON.stringify(data));
      
      // Soumettre
      const result = await submitFilm(formDataToSend);
      
      setSubmitSuccess(result);
      return result;
    } catch (error) {
      // Construire un message d'erreur détaillé
      let errorMessage = error.message || 'Erreur lors de la soumission';
      
      // Si l'erreur contient des détails de validation (erreurs Zod)
      if (error.details && Array.isArray(error.details)) {
        const validationErrors = error.details
          .map(detail => `${detail.field}: ${detail.message}`)
          .join(', ');
        errorMessage = `Erreurs de validation: ${validationErrors}`;
      }
      
      setSubmitError(errorMessage);
      console.error('Erreur lors de la soumission:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * Réinitialise le formulaire
   */
  const reset = () => {
    setCurrentStep(1);
    setFormData({
      termsAccepted: false,
      ageConfirmed: false,
      english_title: '',
      original_title: '',
      language: '',
      english_synopsis: '',
      original_synopsis: '',
      classification: '',
      tech_stack: '',
      creative_method: '',
      video: null,
      cover: null,
      subtitles: null,
      gallery: [],
      creator_firstname: '',
      creator_lastname: '',
      creator_email: '',
      creator_phone: '',
      creator_mobile: '',
      creator_gender: '',
      creator_country: '',
      creator_address: '',
      referral_source: '',
      collaborators: [],
      socials: []
    });
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  };
  
  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    submitError,
    submitSuccess,
    updateField,
    updateCollaboratorField,
    updateSocialField,
    nextStep,
    prevStep,
    submit,
    reset,
    validateStep
  };
};

export default useSubmission;
