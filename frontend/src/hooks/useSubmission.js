import { useState } from 'react';
import { submitFilm } from '../utils/api.js';
import { validateSubmissionData } from '../utils/validation.js';

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
    // Effacer l'erreur du champ si présente
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
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
        if (!formData.creator_email) stepErrors.creator_email = 'Requis';
        if (!formData.creator_mobile) stepErrors.creator_mobile = 'Requis';
        if (!formData.creator_gender) stepErrors.creator_gender = 'Requis';
        if (!formData.creator_country) stepErrors.creator_country = 'Requis';
        if (!formData.creator_address) stepErrors.creator_address = 'Requis';
        break;
        
      case 4:
        // Pas de validation obligatoire pour la partie 4 (optionnel)
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
    nextStep,
    prevStep,
    submit,
    reset,
    validateStep
  };
};

export default useSubmission;
