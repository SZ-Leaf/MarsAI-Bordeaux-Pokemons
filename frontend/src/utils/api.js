const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiCall = async (endpoint, options = {}) => {
  let url = `${API_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...options.headers
    }
  };

  if (options.params) {
    const queryString = new URLSearchParams(options.params).toString();
    url += `?${queryString}`;
    delete options.params; // remove since fetch doesn't accept params in the options object
  }
  
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
      data.httpStatus = response.status;
      throw data;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

// Export par défaut
export default {
  apiCall
};
