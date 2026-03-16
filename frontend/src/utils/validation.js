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

/**
 * Transforme les erreurs Zod renvoyées par le backend en { field: message }.
 * Compatible avec les réponses sendZodError (data: ZodIssue[]) et sendError (data: ZodIssue[]).
 * @param {unknown} err - l'objet erreur catchée (peut contenir err.data ou err.errors)
 * @returns {{ [field: string]: string }}
 */
export const zodFieldErrors = (err) => {
  const issues = err?.data ?? err?.errors ?? err?.details ?? null;
  if (!Array.isArray(issues)) return {};

  const out = {};
  for (const e of issues) {
    const key = Array.isArray(e.path) ? e.path.join(".") : String(e.path ?? "");
    if (!key) continue;
    if (!out[key]) out[key] = e.message;
  }
  return out;
};
