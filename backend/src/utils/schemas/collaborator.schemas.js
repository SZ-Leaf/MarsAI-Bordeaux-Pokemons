import { z } from 'zod';

export const collaboratorSchema = z.object({
  firstname: z
    .string({
      required_error: 'zod_errors.collaborator.firstname.required',
      invalid_type_error: 'zod_errors.collaborator.firstname.invalid',
    })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message: 'zod_errors.collaborator.firstname.format',
    })
    .min(2, { message: 'zod_errors.collaborator.firstname.min' })
    .max(25, { message: 'zod_errors.collaborator.firstname.max' }),

  lastname: z
    .string({
      required_error: 'zod_errors.collaborator.lastname.required',
      invalid_type_error: 'zod_errors.collaborator.lastname.invalid',
    })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message: 'zod_errors.collaborator.lastname.format',
    })
    .min(2, { message: 'zod_errors.collaborator.lastname.min' })
    .max(25, { message: 'zod_errors.collaborator.lastname.max' }),

  email: z
    .string({
      required_error: 'zod_errors.collaborator.email.required',
      invalid_type_error: 'zod_errors.collaborator.email.invalid',
    })
    .email({ message: 'zod_errors.collaborator.email.format' }),

  gender: z.string({
    required_error: 'zod_errors.collaborator.gender.required',
    invalid_type_error: 'zod_errors.collaborator.gender.invalid',
  })
  .optional(),

  role: z
    .string({
      required_error: 'zod_errors.collaborator.role.required',
      invalid_type_error: 'zod_errors.collaborator.role.invalid',
    })
    .min(1, { message: 'zod_errors.collaborator.role.min' })
    .max(500, { message: 'zod_errors.collaborator.role.max' })
});
