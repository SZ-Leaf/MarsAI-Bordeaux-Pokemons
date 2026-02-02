/**
 * Utilitaires de validation pour les formulaires
 */

/**
 * Valider une adresse email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valider un nom ou prénom (lettres, espaces, tirets, apostrophes uniquement)
 */
export const validateName = (name) => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(name);
};

/**
 * Filtrer les caractères non autorisés dans un nom
 */
export const filterNameCharacters = (value) => {
  return value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
};

/**
 * Valider une URL
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return url.startsWith('https://');
  } catch {
    return false;
  }
};
