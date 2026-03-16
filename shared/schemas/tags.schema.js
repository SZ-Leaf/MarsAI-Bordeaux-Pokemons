import { z } from "zod";

export const tagSchema = z.object({
  title: z
    .string({
      required_error: 'zod_errors.tag.title.required',
      invalid_type_error: 'zod_errors.tag.title.invalid',
    })
    .trim()
    .min(2, { message: 'zod_errors.tag.title.min' })
    .max(50, { message: 'zod_errors.tag.title.max' }),
});
