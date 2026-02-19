import { z } from 'zod';

export const rateSubmissionSchema = z.object({
  rating: z.preprocess(
    (value) => {
      if (value === undefined) return undefined;
      if (value === null || value === '') return null;
      const n = Number(value);
      return Number.isNaN(n) ? undefined : n;
    },
    z.number().int().min(1).max(10).nullable().optional()
  ),
  comment: z.string().max(255).nullable().optional(),
  playlist: z.enum(['FAVORITES', 'WATCH_LATER', 'REPORT']).nullable().optional(),
});
