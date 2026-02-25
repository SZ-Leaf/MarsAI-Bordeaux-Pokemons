import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { sendError } from '../helpers/response.helper.js';

const WINDOWS = {
   minute: 60 * 1000,
   hour: 60 * 60 * 1000,
   day: 24 * 60 * 60 * 1000,
}

export const createPublicRateLimit = (max, window = 'minute') => {
   const windowMs = typeof window === 'number' ? window : (WINDOWS[window] ?? WINDOWS.minute);
   return rateLimit({
      windowMs,
      limit: max,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
         fr: 'Trop de requêtes, réessayez plus tard.',
         en: 'Too many requests, please try again later.'
      },
      statusCode: 429,
      keyGenerator: (req) => ipKeyGenerator(req),
      handler: (req, res, _next, options) => {
         return sendError(
            res,
            options.statusCode,
            options.message.fr,
            options.message.en,
            null
         );
      }
   });
}