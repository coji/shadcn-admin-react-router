import { coerceFormValue } from '@conform-to/zod/v4/future'
import { z } from 'zod'

export const formSchema = coerceFormValue(
  z.object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? 'Please enter your email'
          : 'Invalid email address',
    }),
    password: z.string({ error: 'Please enter your password' }).min(7, {
      message: 'Password must be at least 7 characters long',
    }),
  }),
)
