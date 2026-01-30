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
    
    // Vérifier le Content-Type avant de parser
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Réponse non-JSON reçue:', text.substring(0, 200));
      throw new Error(`Réponse invalide du serveur (${response.status}): Le serveur a renvoyé du HTML au lieu de JSON. Vérifiez que le backend fonctionne correctement.`);
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      // Créer une erreur avec plus de détails
      const errorMessage = data.error || `Erreur ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      
      // Ajouter les détails de l'erreur si disponibles (pour les erreurs de validation Zod)
      if (data.details) {
        error.details = data.details;
      }
      
      // Ajouter le code de statut
      error.status = response.status;
      
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    // Si c'est déjà une erreur avec des détails, la relancer telle quelle
    if (error.details || error.status) {
      throw error;
    }
    // Sinon, créer une nouvelle erreur avec le message
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
