export const sendError = (res, status, fr_message, en_message, data) => {
   return res.status(status).json({
      success: false,
      message: { fr: fr_message, en: en_message },
      data: data
   });
}

export const sendSuccess = (res, status, fr_message, en_message, data) => {
   return res.status(status).json({
      success: true,
      message: { fr: fr_message, en: en_message },
      data: data
   });
}

/**
 * Unified Zod validation error response.
 * Always sends { success: false, message: { fr, en }, data: err.errors[] }
 * so the frontend can always map errors to fields with zodFieldErrors().
 */
export const sendZodError = (res, zodError) => {
   return res.status(422).json({
      success: false,
      message: { fr: 'Erreur de validation', en: 'Validation error' },
      data: zodError.errors ?? zodError.issues ?? []
   });
}
