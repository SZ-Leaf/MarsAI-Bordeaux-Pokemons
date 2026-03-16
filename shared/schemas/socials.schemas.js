import { z } from 'zod';

export const socialSchema = z.object({
  network_id: z
    .number({
      required_error: 'zod_errors.social.network_id.required',
      invalid_type_error: 'zod_errors.social.network_id.invalid',
    })
    .int()
    .positive({ message: 'zod_errors.social.network_id.invalid' }),

  url: z
    .string({
      required_error: 'zod_errors.social.url.required',
      invalid_type_error: 'zod_errors.social.url.invalid',
    })
    .min(1, { message: 'zod_errors.social.url.required' })
    .url({ message: 'zod_errors.social.url.invalid' })
    .refine((val) => val.startsWith('https://'), {
      message: 'zod_errors.social.url.https',
    })
    .max(500, { message: 'zod_errors.social.url.max' }),
});
