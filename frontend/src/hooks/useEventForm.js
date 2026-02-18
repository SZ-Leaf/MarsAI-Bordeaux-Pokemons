import { useState, useEffect, useRef } from 'react';
import { createEvent, updateEvent } from '../services/event.service';

const EMPTY_FORM = {
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  places: 100,
};

const useEventForm = ({ eventToEdit, isOpen, onRefresh, onClose }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [cover, setCover] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (eventToEdit) {
      const startDate = eventToEdit.start_date ? new Date(eventToEdit.start_date) : null;
      const endDate = eventToEdit.end_date ? new Date(eventToEdit.end_date) : null;

      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        start_date: startDate ? startDate.toISOString().slice(0, 16) : '',
        end_date: endDate ? endDate.toISOString().slice(0, 16) : '',
        location: eventToEdit.location || '',
        places: eventToEdit.places || 100,
      });

      if (eventToEdit.cover) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        setPreviewUrl(`${API_URL}${eventToEdit.cover}`);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData(EMPTY_FORM);
      setPreviewUrl(null);
      setCover(null);
    }
    setError(null);
  }, [eventToEdit, isOpen]);

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (cover) data.append('cover', cover);

      if (eventToEdit) {
        await updateEvent(eventToEdit.id, data);
      } else {
        await createEvent(data);
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la soumission du formulaire:', err);
      setError(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    cover,
    previewUrl,
    loading,
    error,
    fileInputRef,
    onFieldChange,
    onFileChange,
    onSubmit,
  };
};

export default useEventForm;
