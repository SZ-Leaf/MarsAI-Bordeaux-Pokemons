import { z } from 'zod';

// Schéma d'inscription à la newsletter (email + consentement)
export const subscribeSchema = z.object({
   email: z
      .string({
         required_error: 'zod_errors.newsletter_subscribe.email.required',
         invalid_type_error: 'zod_errors.newsletter_subscribe.email.invalid',
      })
      .email({ message: 'zod_errors.newsletter_subscribe.email.format' }),
   consent: z
      .boolean({
         required_error: 'zod_errors.newsletter_subscribe.consent.required',
         invalid_type_error: 'zod_errors.newsletter_subscribe.consent.invalid',
      })
      .refine((val) => val === true, {
         message: 'zod_errors.newsletter_subscribe.consent.must_accept',
      }),
});

// Schéma création / mise à jour newsletter (titre, objet, contenu, statut optionnel)
export const newsletterSchema = z.object({
   title: z
      .string({
         required_error: 'zod_errors.newsletter.title.required',
         invalid_type_error: 'zod_errors.newsletter.title.invalid',
      })
      .min(3, { message: 'zod_errors.newsletter.title.min' })
      .max(255, { message: 'zod_errors.newsletter.title.max' }),
   subject: z
      .string({
         required_error: 'zod_errors.newsletter.subject.required',
         invalid_type_error: 'zod_errors.newsletter.subject.invalid',
      })
      .min(5, { message: 'zod_errors.newsletter.subject.min' })
      .max(255, { message: 'zod_errors.newsletter.subject.max' }),
   content: z
      .string({
         required_error: 'zod_errors.newsletter.content.required',
         invalid_type_error: 'zod_errors.newsletter.content.invalid',
      })
      .min(10, { message: 'zod_errors.newsletter.content.min' }),
   status: z
      .enum(['draft', 'sent'], {
         errorMap: () => ({ message: 'zod_errors.newsletter.status.invalid' }),
      })
      .optional(),
});
