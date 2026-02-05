import { z } from "zod";

export const sponsorSchema = z.object({
  name: z.string().("Nom obligatoire"),
  url: z.string().url("URL du sponsor doit être valide"),
});
