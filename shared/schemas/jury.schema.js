import {z} from "zod";

export const jurySchema = z.object({
   
    firstname: z
    .string({
        required_error: 'zod_errors.jury.firstname.required',
        invalid_type_error: 'zod_errors.jury.firstname.invalid',
    })
    .trim()
    .min(2, {message: 'zod_errors.jury.firstname.min'})
    .max(100, {message: 'zod_errors.jury.firstname.max_length'}),

    lastname: z
    .string({
        required_error: 'zod_errors.jury.lastname.required',
        invalid_type_error: 'zod_errors.jury.lastname.invalid',
    })
    .trim()
    .min(2, {message: 'zod_errors.jury.lastname.min'})
    .max(100, {message: 'zod_errors.jury.lastname.max_length'}),

    job: z
    .string({
        required_error: 'zod_errors.jury.job.required',
        invalid_type_error: 'zod_errors.jury.job.invalid',
    })
    .trim()
    .min(2, {message: 'zod_errors.jury.job.min'})
    .max(100, {message: 'zod_errors.jury.job.max_length'}),
})


