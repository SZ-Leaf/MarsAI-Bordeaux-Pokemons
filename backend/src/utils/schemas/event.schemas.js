import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string({
      required_error: 'zod_errors.event.title.required',
      invalid_type_error: 'zod_errors.event.title.invalid',
    })
    .trim()
    .min(1, { message: 'zod_errors.event.title.required' }),

  description: z
    .string({
      required_error: 'zod_errors.event.description.required',
      invalid_type_error: 'zod_errors.event.description.invalid',
    })
    .trim()
    .min(1, { message: 'zod_errors.event.description.required' }),

  location: z
    .string({
      required_error: 'zod_errors.event.location.required',
      invalid_type_error: 'zod_errors.event.location.invalid',
    })
    .trim()
    .min(1, { message: 'zod_errors.event.location.required' }),

  places: z
    .number({
      required_error: 'zod_errors.event.places.required',
      invalid_type_error: 'zod_errors.event.places.invalid',
    })
    .int({ message: 'zod_errors.event.places.integer' })
    .positive({ message: 'zod_errors.event.places.positive' }),

  start_date: z
    .string({
      required_error: 'zod_errors.event.start_date.required',
      invalid_type_error: 'zod_errors.event.start_date.invalid',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'zod_errors.event.start_date.format',
    }),

  end_date: z
    .string({
      required_error: 'zod_errors.event.end_date.required',
      invalid_type_error: 'zod_errors.event.end_date.invalid',
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'zod_errors.event.end_date.format',
    }),
});
