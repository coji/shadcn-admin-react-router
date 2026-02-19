import { z } from 'zod'

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.',
    }),
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? 'Please select an email to display.'
        : 'Invalid email address',
  }),
  bio: z
    .string()
    .min(4, {
      message: 'Bio must be at least 4 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 160 characters.',
    }),
  urls: z.array(z.url({ message: 'Please enter a valid URL.' })).optional(),
})
