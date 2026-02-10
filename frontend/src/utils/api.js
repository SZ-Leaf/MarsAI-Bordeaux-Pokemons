const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Exporter API_URL pour qu'il soit réutilisable dans toute l'application
export { API_URL };

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
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
      throw {
        ...data,
        status: response.status,
        message: data.message,
      }
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

// Export par défaut
export default {
  API_URL,
  apiCall
};
