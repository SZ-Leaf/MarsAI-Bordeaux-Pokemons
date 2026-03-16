import { z } from 'zod';

export const rateSubmissionSchema = z.object({
  rating: z.preprocess(
    (value) => {
      if (value === undefined) return undefined;
      if (value === null || value === '') return null;
      const n = Number(value);
      return Number.isNaN(n) ? undefined : n;
    },
    z
      .number({ invalid_type_error: 'zod_errors.selector.rating.invalid' })
      .int({ message: 'zod_errors.selector.rating.invalid' })
      .min(1, { message: 'zod_errors.selector.rating.min' })
      .max(10, { message: 'zod_errors.selector.rating.max' })
      .nullable()
      .optional()
  ),
  comment: z
    .string({ invalid_type_error: 'zod_errors.selector.comment.invalid' })
    .max(255, { message: 'zod_errors.selector.comment.max' })
    .nullable()
    .optional(),
  playlist: z
    .enum(['FAVORITES', 'WATCH_LATER', 'REPORT'], {
      errorMap: () => ({ message: 'zod_errors.selector.playlist.invalid' }),
    })
    .nullable()
    .optional(),
});
