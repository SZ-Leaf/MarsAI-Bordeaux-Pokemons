import { z } from "zod";

export const tagSchema = z.object({
  title: z.string().trim().min(2, "Titre trop court").max(50, "Titre trop long"),
});
