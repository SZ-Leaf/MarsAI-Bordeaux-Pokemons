import { z } from 'zod';

export const eventSchema = z.object({
  title: z
    .string({
      required_error: 'zod_errors.event.title.required',
      invalid_type_error: 'zod_errors.event.title.invalid',
    })
    .min(1, { message: 'zod_errors.event.title.required' })
    .max(255, { message: 'zod_errors.event.title.max' }),

  description: z
    .string({
      required_error: 'zod_errors.event.description.required',
      invalid_type_error: 'zod_errors.event.description.invalid',
    })
    .min(1, { message: 'zod_errors.event.description.required' })
    .max(1000, { message: 'zod_errors.event.description.max' }),

  start_date: z
    .string({
      required_error: 'zod_errors.event.start_date.required',
      invalid_type_error: 'zod_errors.event.start_date.invalid',
    })
    .datetime({ message: 'zod_errors.event.start_date.format' }),

  end_date: z
    .string({
      required_error: 'zod_errors.event.end_date.required',
      invalid_type_error: 'zod_errors.event.end_date.invalid',
    })
    .datetime({ message: 'zod_errors.event.end_date.format' }),

  location: z
    .string({
      required_error: 'zod_errors.event.location.required',
      invalid_type_error: 'zod_errors.event.location.invalid',
    })
    .min(1, { message: 'zod_errors.event.location.required' })
    .max(255, { message: 'zod_errors.event.location.max' }),

  places: z
    .coerce
    .number({
      required_error: 'zod_errors.event.places.required',
      invalid_type_error: 'zod_errors.event.places.invalid',
    })
    .int({ message: 'zod_errors.event.places.integer' })
    .positive({ message: 'zod_errors.event.places.positive' })
});
