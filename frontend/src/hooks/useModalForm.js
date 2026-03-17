import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translateZodMessage from '../helpers/zodHelper';

export const useModalForm = (
  initialData,
  defaultValues,
  zodSchema,
  onSave,
  isOpen,
  itemIndex = null
) => {
  const { language } = useLanguage();

  const getInitialFormData = () => {
    return initialData ? { ...defaultValues, ...initialData } : { ...defaultValues };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [localErrors, setLocalErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const newFormData = getInitialFormData();
      setTimeout(() => {
        setFormData(newFormData);
        setLocalErrors({});
      }, 0);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validation Zod en temps réel
    try {
      zodSchema.pick({ [field]: true }).parse({ [field]: value });
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } catch (error) {
      if (error.errors && error.errors.length > 0) {
        setLocalErrors(prev => ({
          ...prev,
          [field]: translateZodMessage(error.errors[0].message, language),
        }));
      }
    }
  };

  const validateAll = () => {
    try {
      zodSchema.parse(formData);
      return null;
    } catch (error) {
      if (error.errors) {
        const finalErrors = {};
        error.errors.forEach(err => {
          const field = err.path[0];
          if (field) {
            finalErrors[field] = translateZodMessage(err.message, language);
          }
        });
        return finalErrors;
      }
      return null;
    }
  };

  const handleSubmit = (onClose) => {
    const errors = validateAll();
    
    if (errors) {
      setLocalErrors(errors);
      return;
    }

    onSave(formData, itemIndex);
    onClose();
  };

  const reset = () => {
    setFormData(getInitialFormData());
    setLocalErrors({});
  };

  return {
    formData,
    errors: localErrors,
    handleChange,
    handleSubmit,
    reset
  };
};
