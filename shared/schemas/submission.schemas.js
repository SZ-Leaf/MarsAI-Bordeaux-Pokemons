import { z } from 'zod';
import { collaboratorSchema } from './collaborator.schemas.js';
import { socialSchema } from './socials.schemas.js';

export const submissionSchema = z.object({
   // step 1: terms
   terms_of_use: z
      .boolean({
         required_error: 'zod_errors.submission.terms_of_use.required',
         invalid_type_error: 'zod_errors.submission.terms_of_use.invalid',
      })
      .refine((val) => val === true, {
         message: 'zod_errors.submission.terms_of_use.must_accept',
      }),

   age_confirmed: z
      .boolean({
         required_error: 'zod_errors.submission.age_confirmed.required',
         invalid_type_error: 'zod_errors.submission.age_confirmed.invalid',
      })
      .refine((val) => val === true, {
         message: 'zod_errors.submission.age_confirmed.must_accept',
      }),

   // step 2: video info
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
      .optional()
      .or(z.literal('')),

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
      .optional()
      .or(z.literal('')),

   classification: z.enum(['Full AI', 'Semi-AI'], {
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

   tagIds: z
      .array(z.coerce.number().int().positive())
      .default([]),

   // step 3: files
   video: z.any().refine((val) => val !== null && val !== undefined, {
      message: 'zod_errors.submission.video.required',
   }),

   cover: z.any().refine((val) => val !== null && val !== undefined, {
      message: 'zod_errors.submission.cover.required',
   }),

   subtitles: z.any().optional().nullable(),

   gallery: z.array(z.any()).max(3, { message: 'zod_errors.submission.gallery.max' }).optional(),

   // step 4: creator info
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
      .min(1, { message: 'zod_errors.submission.creator_email.required' })
      .email({ message: 'zod_errors.submission.creator_email.format' }),

   creator_phone: z
      .string()
      .optional()
      .refine(
         (val) => {
            if (!val || val.trim() === '') return true;
            const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
            return /^\d{8,15}$/.test(cleaned);
         },
         { message: 'zod_errors.submission.creator_phone.format' },
      ),

   creator_mobile: z
      .string({
         required_error: 'zod_errors.submission.creator_mobile.required',
         invalid_type_error: 'zod_errors.submission.creator_mobile.invalid',
      })
      .refine(
         (val) => {
            if (!val || val.trim() === '') return false;
            const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
            return /^\d{8,15}$/.test(cleaned);
         },
         { message: 'zod_errors.submission.creator_mobile.format' },
      ),

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
      .min(1, { message: 'zod_errors.submission.creator_country.required' })
      .max(50, { message: 'zod_errors.submission.creator_country.max' })
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
         message: 'zod_errors.submission.creator_country.format',
      }),

   creator_address: z
      .string({
         required_error: 'zod_errors.submission.creator_address.required',
         invalid_type_error: 'zod_errors.submission.creator_address.invalid',
      })
      .min(1, { message: 'zod_errors.submission.creator_address.required' })
      .max(255, { message: 'zod_errors.submission.creator_address.max' }),

   referral_source: z.enum(
      ['Friend', 'Social Media', 'Advertisement', 'Newsletter', 'Recommendation', 'Event', 'Other'],
      {
         errorMap: () => ({
            message: 'zod_errors.submission.referral_source.invalid',
         }),
      },
   ),

   recaptchaToken: z
      .string({
         required_error: 'zod_errors.submission.recaptchaToken.required',
         invalid_type_error: 'zod_errors.submission.recaptchaToken.invalid',
      })
      .min(1, { message: 'zod_errors.submission.recaptchaToken.required' }),

   // optional collaborators and socials data
   collaborators: z.array(collaboratorSchema).optional(),
   socials: z.array(socialSchema).optional(),
});

export const step1Schema = submissionSchema.pick({
   terms_of_use: true,
   age_confirmed: true,
});

export const step2Schema = submissionSchema.pick({
   english_title: true,
   original_title: true,
   language: true,
   english_synopsis: true,
   original_synopsis: true,
   classification: true,
   tech_stack: true,
   creative_method: true,
   tagIds: true,
});

export const step3Schema = submissionSchema.pick({
   video: true,
   cover: true,
   subtitles: true,
   gallery: true,
});

export const step4Schema = submissionSchema.pick({
   creator_firstname: true,
   creator_lastname: true,
   creator_email: true,
   creator_phone: true,
   creator_mobile: true,
   creator_gender: true,
   creator_country: true,
   creator_address: true,
   referral_source: true,
   recaptchaToken: true,
   collaborators: true,
   socials: true,
});

export const formatZodErrors = (zodError) => {
   const errors = {};
   const issues = zodError.issues || zodError.errors || [];

   if (issues.length === 0) {
      console.warn('Zod signale un échec mais aucune issue trouvée:', zodError);
      return errors;
   }

   issues.forEach((err) => {
      const path = err.path.join('_');
      errors[path] = err.message;
   });

   return errors;
};

export default submissionSchema;