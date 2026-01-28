import { useState } from 'react';
import { submitFilm } from '../utils/api.js';
import { validateSubmissionData, validateEmail, validatePhone, validateURL } from '../utils/validation.js';

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
        // Validation métadonnées vidéo
        if (!formData.english_title) stepErrors.english_title = 'Requis';
        if (!formData.language) stepErrors.language = 'Requis';
        if (!formData.english_synopsis) stepErrors.english_synopsis = 'Requis';
        if (!formData.classification) stepErrors.classification = 'Requis';
        if (!formData.tech_stack) stepErrors.tech_stack = 'Requis';
        if (!formData.creative_method) stepErrors.creative_method = 'Requis';
        if (!formData.video) stepErrors.video = 'Requis';
        if (!formData.cover) stepErrors.cover = 'Requis';
        break;
        
      case 3:
        // Validation infos créateur
        if (!formData.creator_firstname) stepErrors.creator_firstname = 'Requis';
        if (!formData.creator_lastname) stepErrors.creator_lastname = 'Requis';
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
        break;
        
      case 4:
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
   * Soumet le formulaire complet
   */
  const submit = async () => {
    // Validation complète
    const validationErrors = validateSubmissionData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setCurrentStep(1); // Retourner à la première étape avec erreurs
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
      formData.gallery.forEach(file => {
        formDataToSend.append('gallery', file);
      });
      
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
        collaborators: formData.collaborators.length > 0 ? formData.collaborators : undefined,
        socials: formData.socials.length > 0 ? formData.socials : undefined
      };
      
      formDataToSend.append('data', JSON.stringify(data));
      
      // Soumettre
      const result = await submitFilm(formDataToSend);
      
      setSubmitSuccess(result);
      return result;
    } catch (error) {
      setSubmitError(error.message || 'Erreur lors de la soumission');
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
