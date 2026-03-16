import { z } from "zod";

/**
 * CREATE – POST /awards
 */
export const awardCreateSchema = z.object({
  title: z
    .string({
      required_error: 'zod_errors.award.title.required',
      invalid_type_error: 'zod_errors.award.title.invalid',
    })
    .trim()
    .min(1, { message: 'zod_errors.award.title.required' })
    .max(150, { message: 'zod_errors.award.title.max' }),

  award_rank: z.coerce
    .number({
      invalid_type_error: 'zod_errors.award.award_rank.invalid',
    })
    .int({ message: 'zod_errors.award.award_rank.invalid' })
    .min(0, { message: 'zod_errors.award.award_rank.invalid' })
    .max(9999, { message: 'zod_errors.award.award_rank.max' })
    .nullable()
    .optional(),

  description: z
    .string({
      invalid_type_error: 'zod_errors.award.description.invalid',
    })
    .trim()
    .max(4000, { message: 'zod_errors.award.description.max' })
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
 * UPDATE – PUT /awards/:id
 */
export const awardUpdateSchema = z.object({
  title: z
    .string({
      required_error: 'zod_errors.award.title.required',
      invalid_type_error: 'zod_errors.award.title.invalid',
    })
    .trim()
    .min(1, { message: 'zod_errors.award.title.required' })
    .max(150, { message: 'zod_errors.award.title.max' }),

  award_rank: z.coerce
    .number({
      invalid_type_error: 'zod_errors.award.award_rank.invalid',
    })
    .int({ message: 'zod_errors.award.award_rank.invalid' })
    .min(0, { message: 'zod_errors.award.award_rank.invalid' })
    .max(9999, { message: 'zod_errors.award.award_rank.max' })
    .nullable()
    .optional(),

  description: z
    .string({
      invalid_type_error: 'zod_errors.award.description.invalid',
    })
    .trim()
    .max(4000, { message: 'zod_errors.award.description.max' })
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
