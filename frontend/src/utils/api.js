/**
 * Configuration API avec fetch() natif
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Appel API générique
 * @param {string} endpoint - Endpoint API
 * @param {Object} options - Options fetch (method, body, headers, etc.)
 * @returns {Promise<Object>} - Réponse JSON
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Accept': 'application/json',
      ...options.headers
    }
  };
  
  // Ne pas ajouter Content-Type si FormData (sera géré automatiquement)
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `Erreur ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

/**
 * Soumettre un film (POST /api/submissions)
 * @param {FormData} formData - FormData avec fichiers et données
 * @returns {Promise<Object>} - Réponse de la soumission
 */
export const submitFilm = async (formData) => {
  return apiCall('/api/submissions', {
    method: 'POST',
    body: formData
  });
};

/**
 * Récupérer une soumission par ID (GET /api/submissions/:id)
 * @param {number} submissionId - ID de la soumission
 * @returns {Promise<Object>} - Soumission complète
 */
export const getSubmissionById = async (submissionId) => {
  return apiCall(`/api/submissions/${submissionId}`);
};

export default {
  apiCall,
  submitFilm,
  getSubmissionById
};
