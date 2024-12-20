import { z } from 'zod'

export const register = z.object({
  body: z
    .object({
      username: z
        .string({ required_error: 'Username is required' })
        .min(6, { message: 'Username should be at least 8 characters' })
        .max(256, { message: 'Username is too long' }),
      password: z
        .string({ required_error: 'Password is required' })
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

export const login = z.object({
  body: z.object({
    username: z
      .string({ required_error: 'Username is required' })
      .min(6, { message: 'Username should be at least 8 characters' })
      .max(256, { message: 'Username is too long' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password should be at least 8 characters' })
      .max(256, { message: 'Password is too long' }),
  }),
})

export const changePassword = z.object({
  body: z
    .object({
      oldPassword: z
        .string({ required_error: 'Old password is required' })
        .min(8, { message: 'Old password should be at least 8 characters' })
        .max(256, { message: 'Old password is too long' }),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8, { message: 'New password should be at least 8 characters' })
        .max(256, { message: 'New password is too long' }),
      confirmNewPassword: z.string({ required_error: 'New password confirmation is required' }),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: 'Please provide a different password as before',
      path: ['newPassword'],
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    }),
})
