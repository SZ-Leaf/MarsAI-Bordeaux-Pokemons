import { z } from "zod";

export const tagSchema = z.object({
  title: z.string().trim()
  .min(2, { message: 'zod_errors.tag.title.min' })
  .max(50, { message: 'zod_errors.tag.title.max' }),
});
