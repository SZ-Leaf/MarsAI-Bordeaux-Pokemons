import { z } from 'zod';

export const rateSubmissionSchema = z.object({
  rating: z.preprocess(
    (value) => {
      //Si rating absent => undefined
      if (value === undefined || value === null || value === '') {
        return undefined;
      }
      const n = Number(value);
      return Number.isNaN(n) ? undefined : n;
    },
    z.number().int().min(1).max(10).optional()
  ),
  // commentaire optionnel, pas de valeur par défaut pour ne pas écraser l'existant
  comment: z.string().max(255).optional(),
  selection_list: z.enum(['FAVORITES', 'WATCH_LATER', 'REPORT']).default(null),
});
