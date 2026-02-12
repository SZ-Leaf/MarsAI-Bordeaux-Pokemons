import { useState, useEffect, useCallback } from 'react';
import { getPopularTags, searchTags, createTag } from '../services/tag.service';

export const useTags = () => {
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger les tags populaires au démarrage
  useEffect(() => {
    loadPopularTags();
  }, []);

  const loadPopularTags = async (limit = 6) => {
    setLoading(true);
    setError('');
    try {
      const response = await getPopularTags(limit);
      setAllTags(response.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Rechercher des tags
  const handleSearchTags = async (search, limit = 10) => {
    try {
      const response = await searchTags(search, limit);
      return (response.data || []).map(t => ({ value: t.id, label: t.title }));
    } catch {
      return [];
    }
  };

  // Créer un nouveau tag
  const handleCreateTag = async (title) => {
    setError('');
    try {
      const response = await createTag(title);
      
      // Gérer le cas du tag existant (409)
      const created = response.data;
      
      if (!created) {
        return {
          success: false,
          duplicate: false,
          message: 'Erreur lors de la création du tag',
          data: null
        };
      }

      // Ajouter le tag à la liste (éviter les doublons)
      addTagToList(created);

      return {
        success: true,
        duplicate: false,
        message: 'Tag créé !',
        data: created
      };
    } catch (e) {
      // Si c'est une erreur 409 (conflit), le tag existe déjà
      if (e.status === 409 && e.details?.data) {
        const existing = e.details.data;
        addTagToList(existing);
        
        return {
          success: false,
          duplicate: true,
          message: e.message || 'Tag déjà existant',
          data: existing
        };
      }

      return {
        success: false,
        duplicate: false,
        message: e.message || 'Erreur lors de la création',
        data: null
      };
    }
  };

  // Ajouter un tag à la liste (éviter les doublons)
  const addTagToList = useCallback((newTag) => {
    setAllTags((prev) => {
      const map = new Map(prev.map(t => [t.id, t]));
      map.set(newTag.id, newTag);
      return Array.from(map.values()).sort((a, b) => 
        a.title.localeCompare(b.title)
      );
    });
  }, []);

  return {
    allTags,
    loading,
    error,
    loadPopularTags,
    searchTags: handleSearchTags,
    createTag: handleCreateTag,
    addTagToList
  };
};
