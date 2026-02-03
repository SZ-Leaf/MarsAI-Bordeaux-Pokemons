import { z } from 'zod';
import { collaboratorSchema } from './collaborator.schemas.js';
import { socialSchema } from './socials.schemas.js';

export const submissionSchema = z.object({
   // video info
   english_title: z
      .string({
         required_error: 'zod_errors.submission.english_title.required',
         invalid_type_error: 'zod_errors.submission.english_title.invalid',
      })
      .min(1, { message: 'zod_errors.submission.english_title.required' })
      .max(255, { message: 'zod_errors.submission.english_title.max' }),

   original_title: z
      .string()
      .max(255, { message: 'zod_errors.submission.original_title.max' })
      .optional(),

   language: z
      .string({
         required_error: 'zod_errors.submission.language.required',
         invalid_type_error: 'zod_errors.submission.language.invalid',
      })
      .min(1, { message: 'zod_errors.submission.language.required' }),

   english_synopsis: z
      .string({
         required_error: 'zod_errors.submission.english_synopsis.required',
         invalid_type_error: 'zod_errors.submission.english_synopsis.invalid',
      })
      .min(1, { message: 'zod_errors.submission.english_synopsis.required' })
      .max(300, { message: 'zod_errors.submission.english_synopsis.max' }),

   original_synopsis: z
      .string()
      .max(300, { message: 'zod_errors.submission.original_synopsis.max' })
      .optional(),

   classification: z.enum(['IA', 'hybrid'], {
      errorMap: () => ({
         message: 'zod_errors.submission.classification.invalid',
      }),
   }),

   tech_stack: z
      .string({
         required_error: 'zod_errors.submission.tech_stack.required',
         invalid_type_error: 'zod_errors.submission.tech_stack.invalid',
      })
      .min(1, { message: 'zod_errors.submission.tech_stack.required' })
      .max(500, { message: 'zod_errors.submission.tech_stack.max' }),

   creative_method: z
      .string({
         required_error: 'zod_errors.submission.creative_method.required',
         invalid_type_error: 'zod_errors.submission.creative_method.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creative_method.required' })
      .max(500, { message: 'zod_errors.submission.creative_method.max' }),

   // creator info
   creator_firstname: z
      .string({
         required_error: 'zod_errors.submission.creator_firstname.required',
         invalid_type_error: 'zod_errors.submission.creator_firstname.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creator_firstname.required' })
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
         message: 'zod_errors.submission.creator_firstname.format',
      }),

   creator_lastname: z
      .string({
         required_error: 'zod_errors.submission.creator_lastname.required',
         invalid_type_error: 'zod_errors.submission.creator_lastname.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creator_lastname.required' })
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
         message: 'zod_errors.submission.creator_lastname.format',
      }),

   creator_email: z
      .string({
         required_error: 'zod_errors.submission.creator_email.required',
         invalid_type_error: 'zod_errors.submission.creator_email.invalid',
      })
      .email({ message: 'zod_errors.submission.creator_email.format' }),

   creator_phone: z
      .string()
      .max(30, { message: 'zod_errors.submission.creator_phone.max' })
      .optional(),

   creator_mobile: z
      .string({
         required_error: 'zod_errors.submission.creator_mobile.required',
         invalid_type_error: 'zod_errors.submission.creator_mobile.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creator_mobile.required' })
      .max(30, { message: 'zod_errors.submission.creator_mobile.max' }),

   creator_gender: z
      .string({
         required_error: 'zod_errors.submission.creator_gender.required',
         invalid_type_error: 'zod_errors.submission.creator_gender.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creator_gender.required' }),

   creator_country: z
      .string({
         required_error: 'zod_errors.submission.creator_country.required',
         invalid_type_error: 'zod_errors.submission.creator_country.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creator_country.required' }),

   creator_address: z
      .string({
         required_error: 'zod_errors.submission.creator_address.required',
         invalid_type_error: 'zod_errors.submission.creator_address.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creator_address.required' }),

   referral_source: z
      .string({
         required_error: 'zod_errors.submission.referral_source.required',
         invalid_type_error: 'zod_errors.submission.referral_source.invalid',
      })
      .min(1, { message: 'zod_errors.submission.referral_source.required' })
      .max(255, { message: 'zod_errors.submission.referral_source.max' }),

   terms_of_use: z
      .boolean({
         required_error: 'zod_errors.submission.terms_of_use.required',
         invalid_type_error: 'zod_errors.submission.terms_of_use.invalid',
      })
      .refine(val => val === true, {
         message: 'zod_errors.submission.terms_of_use.must_accept',
      }),

   // optional collaborators and socials data
   collaborators: z.array(collaboratorSchema).optional(),
   socials: z.array(socialSchema).optional()
});