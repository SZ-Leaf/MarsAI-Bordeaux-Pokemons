import { z } from 'zod';

export const rateSubmissionSchema = z.object({
  rating: z.number().int().min(1).max(10).optional(),
  comment: z.string().max(255).optional(),
  selection_list: z.enum(['0', '1']).default('1'),
});
