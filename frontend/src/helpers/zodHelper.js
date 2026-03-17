import React from 'react';
import en from '@marsai/schemas/i18n/zod_errors.en.json';
import fr from '@marsai/schemas/i18n/zod_errors.fr.json';

const dictByLanguage = {
   en: en.zod_errors,
   fr: fr.zod_errors,
};

const resolveKey = (root, key) => {
   if (typeof key !== 'string') return key;
   if (!key.startsWith('zod_errors.')) return key;

   const parts = key.replace(/^zod_errors\./, '').split('.');

   let node = root;
   for (const p of parts) {
      if (!node || typeof node !== 'object') return null;
      node = node[p];
   }

   return typeof node === 'string' ? node : null;
};

/**
 * Translates a single zod_errors.* message key into a human-readable string.
 * Falls back to EN, then to the raw key if not found.
 */
const translateZodMessage = (messageKey, lang = 'en') => {
   const current = dictByLanguage[lang] || dictByLanguage.en;
   const fallback = dictByLanguage.en;

   return (
      resolveKey(current, messageKey) ??
      resolveKey(fallback, messageKey) ??
      messageKey
   );
};

/**
 * Translates an already-mapped { field: messageKey } object.
 * Useful when you already have a { field: 'zod_errors.*' } map and just need to translate it
 * (e.g. after formatZodErrors from the shared schema package).
 */
export const translateErrors = (errorsMap, lang = 'en') => {
   const out = {};
   for (const [field, msg] of Object.entries(errorsMap)) {
      out[field] = translateZodMessage(msg, lang);
   }
   return out;
};

/**
 * Maps Zod issues (from a frontend parse error or a backend sendZodError response)
 * to { field: translatedMessage } in one step.
 *
 * Handles:
 *  - Frontend: err thrown by schema.parse()  → err.errors[]
 *  - Backend:  err from apiCall              → err.data[] (ZodIssue[])
 */
export const zodErrors = (err, lang = 'en') => {
   const issues = err?.data ?? err?.errors ?? err?.details ?? null;
   if (!Array.isArray(issues)) return {};

   const out = {};
   for (const e of issues) {
      const key = Array.isArray(e.path) ? e.path.join('.') : String(e.path ?? '');
      if (!key) continue;
      if (!out[key]) out[key] = translateZodMessage(e.message, lang);
   }
   return out;
};

/**
 * Renders a translated field error message.
 * Returns null when there is no error (safe to use unconditionally in JSX).
 *
 * @param {string|undefined} error - The translated error string
 * @param {string} [className]     - Optional extra Tailwind classes
 */
export const FieldError = ({ error, className = '' }) =>
   error
      ? React.createElement(
           'p',
           { className: `mt-1 text-xs text-red-400 ${className}`.trim() },
           error,
        )
      : null;

export default translateZodMessage;
