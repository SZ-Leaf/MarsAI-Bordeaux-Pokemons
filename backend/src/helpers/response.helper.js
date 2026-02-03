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
