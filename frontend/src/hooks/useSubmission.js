import { useState } from 'react';
import { submitFilm } from '../services/submission.service';
import { 
  submissionSchema, 
  step1Schema, 
  step2Schema, 
  step3Schema, 
  step4Schema,
  formatZodErrors 
} from '../schemas/submissionSchema.js';

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
    tags: [],
    
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
    
    // Effacer l'erreur du champ si présente
    const errorKey = `collaborators_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };
  
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
    
    // Effacer l'erreur du champ si présente
    const errorKey = `socials_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };
  
  const validateStep = (step) => {
    const schemas = {
      1: step1Schema,
      2: step2Schema,
      3: step3Schema,
      4: step4Schema
    };
    
    console.log(`Données envoyées à Zod (Step ${step}):`, formData);
    const result = schemas[step].safeParse(formData);
    
    if (!result.success) {
      console.log('Issues Zod brutes:', result.error.issues);
      const stepErrors = formatZodErrors(result.error);
      console.log('Erreurs de validation détectées:', stepErrors);
      setErrors(stepErrors);
      return false;
    }
    
    console.log('Validation réussie');
    setErrors({});
    return true;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const getStepWithErrors = (errors) => {
    const errorKeys = Object.keys(errors);
    
    // Étape 1 : CGU
    if (errorKeys.some(key => ['termsAccepted', 'ageConfirmed'].includes(key))) {
      return 1;
    }
    
    // Étape 2 : Métadonnées vidéo
    if (errorKeys.some(key => ['english_title', 'original_title', 'language', 
        'english_synopsis', 'original_synopsis', 'classification',
        'tech_stack', 'creative_method'].includes(key))) {
      return 2;
    }
    
    // Étape 3 : Uploads de fichiers
    if (errorKeys.some(key => ['video', 'cover', 'subtitles', 'gallery'].includes(key) || 
        key.startsWith('gallery_'))) {
      return 3;
    }
    
    // Étape 4 : Réalisateur et Contributeurs
    if (errorKeys.some(key => key.startsWith('creator_') || 
        key.startsWith('socials_') || 
        key.startsWith('collaborators_'))) {
      return 4;
    }
    
    // Par défaut, retourner à l'étape 1
    return 1;
  };
  
  const submit = async () => {
    // Validation complète avec Zod
    const result = submissionSchema.safeParse(formData);
    
    if (!result.success) {
      const validationErrors = formatZodErrors(result.error);
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
      const tagIds = (formData.tags || [])
        .map(t => Number(t.value))
        .filter(n => Number.isInteger(n) && n > 0);
      
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
        socials: (formData.socials && formData.socials.length > 0) ? formData.socials : undefined,
        tagIds,
      };
      
      formDataToSend.append('data', JSON.stringify(data));

      console.log('Données à envoyer:', {
        files: {
          video: formData.video?.name,
          cover: formData.cover?.name,
          subtitles: formData.subtitles?.name,
          gallery: formData.gallery?.length
        },
        data
      });
      
      // Soumettre
      const result = await submitFilm(formDataToSend);
      
      setSubmitSuccess(result);
      return result;
    } catch (error) {
      // Construire un message d'erreur détaillé
      let errorMessage = error.message || 'Erreur lors de la soumission';
      
      // Si l'erreur contient des détails de validation (erreurs Zod du backend)
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
      tags: [],
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
