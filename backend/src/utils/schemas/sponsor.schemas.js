import { z } from "zod";

export const sponsorSchema = z.object({
  name: z
    .string({
      required_error: 'zod_errors.sponsor.name.required',
      invalid_type_error: 'zod_errors.sponsor.name.invalid',
    })
    .trim()
    .min(1, { message: 'zod_errors.sponsor.name.required' }),

  url: z
    .string({
      required_error: 'zod_errors.sponsor.url.required',
      invalid_type_error: 'zod_errors.sponsor.url.invalid',
    })
    .trim()
    .min(1, { message: 'zod_errors.sponsor.url.required' })
    .url({ message: 'zod_errors.sponsor.url.format' }),
});
