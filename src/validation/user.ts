import { z } from 'zod'

export const register = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(6, { message: 'Username should be at least 8 characters' })
        .max(256, { message: 'Username is too long' }),
      password: z
        .string()
        .min(8, { message: 'Password should be at least 8 characters' })
        .max(256, { message: 'Password is too long' })
        .regex(
          /^(?=.*[A-Za-z])(?=.*\d).+$/,
          'Password must contain at least one alphabet and one number.',
        ),
      confirmPassword: z.string({ required_error: 'Password confirmation is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
})
