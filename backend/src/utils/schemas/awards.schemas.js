import { z } from "zod";

/**
 * CREATE – POST /awards
 */
export const awardCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titre requis")
    .max(150, "Titre trop long"),

  award_rank: z.coerce
    .number()
    .int("Rank invalide")
    .min(0, "Rank invalide")
    .max(9999, "Rank trop grand"),

  description: z
    .string()
    .trim()
    .max(4000, "Description trop longue")
    .nullable()
    .optional(),

  // uniquement si tu acceptes cover en string (sinon enlève ce champ)
  cover: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional(),
}).strict();

/**
 * UPDATE – PUT /awards/:id
 * PUT = remplacement complet
 */
export const awardUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Titre requis")
    .max(150),

  award_rank: z.coerce
    .number()
    .int()
    .min(0)
    .max(9999),

  description: z
    .string()
    .trim()
    .max(4000)
    .nullable()
    .optional(),

  cover: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional(),

}).strict();

/**
 * SET SUBMISSION – PUT /awards/:id/submission
 */
export const awardSetSubmissionSchema = z.object({
  submission_id: z
    .coerce
    .number()
    .int()
    .positive()
    .nullable(),
});