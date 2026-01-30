import { z } from 'zod';

export const socialSchema = z.object({
  network_id: z
      .number()
      .int()
   .positive({ message: 'zod_errors.social.network_id.invalid' }),
  url: z
   .string()
   .url({ message: 'zod_errors.social.url.invalid' }).max(500, { message: 'zod_errors.social.url.max' }),
});
