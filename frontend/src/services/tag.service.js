import { apiCall } from '../utils/api';

// Récupérer les tags populaires
export const getPopularTags = async (limit = 6) => {
  return apiCall(`/api/tags/popular?limit=${limit}`);
};

// Rechercher des tags
export const searchTags = async (search, limit = 10) => {
  if (!search.trim()) return { data: [] };
  
  return apiCall(`/api/tags?search=${encodeURIComponent(search.trim())}&limit=${limit}`);
};

// Créer un nouveau tag
export const createTag = async (title) => {
  return apiCall('/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim() })
  });
};

export default {
  getPopularTags,
  searchTags,
  createTag
};
