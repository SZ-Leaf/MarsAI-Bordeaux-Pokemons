import { z } from 'zod';

export const registerUserSchema = z.object({
   firstname: z
      .string({
         required_error: 'zod_errors.user.firstname.required',
         invalid_type_error: 'zod_errors.user.firstname.invalid',
      })
      .min(1, { message: 'zod_errors.user.firstname.min' })
      .max(25, { message: 'zod_errors.user.firstname.max' }),
   lastname: z
      .string({
         required_error: 'zod_errors.user.lastname.required',
         invalid_type_error: 'zod_errors.user.lastname.invalid',
      })
      .min(1, { message: 'zod_errors.user.lastname.min' })
      .max(25, { message: 'zod_errors.user.lastname.max' }),
   password: z
      .string({
         required_error: 'zod_errors.user.password.required',
         invalid_type_error: 'zod_errors.user.password.invalid',
      })
      .min(8, { message: 'zod_errors.user.password.min' })
      .max(50, { message: 'zod_errors.user.password.max' })
      // at least one uppercase letter
      .refine((val) => /[A-Z]/.test(val), {
         message: 'zod_errors.user.password.uppercase',
      })
      // at least one lowercase letter
      .refine((val) => /[a-z]/.test(val), {
         message: 'zod_errors.user.password.lowercase',
      })
      // at least one number
      .refine((val) => /[0-9]/.test(val), {
         message: 'zod_errors.user.password.number',
      }),
});

export const userPasswordSchema = z.object({
   password: z
      .string({
         required_error: 'zod_errors.user.password.required',
         invalid_type_error: 'zod_errors.user.password.invalid',
      })
      .min(8, { message: 'zod_errors.user.password.min' })
      .max(50, { message: 'zod_errors.user.password.max' })
      // at least one uppercase letter
      .refine((val) => /[A-Z]/.test(val), {
         message: 'zod_errors.user.password.uppercase',
      })
      // at least one lowercase letter
      .refine((val) => /[a-z]/.test(val), {
         message: 'zod_errors.user.password.lowercase',
      })
      // at least one number
      .refine((val) => /[0-9]/.test(val), {
         message: 'zod_errors.user.password.number',
      }),
});

export const updateUserSchema = z.object({
   firstname: z
      .string({})
      .min(1, { message: 'zod_errors.user.firstname.min' })
      .max(25, { message: 'zod_errors.user.firstname.max' })
      .optional(),
   lastname: z
      .string()
      .min(1, { message: 'zod_errors.user.lastname.min' })
      .max(25, { message: 'zod_errors.user.lastname.max' })
      .optional(),
});