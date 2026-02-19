import { z } from 'zod'

export const formSchema = z.object({
  email: z.email({
    error: (issue) =>
      !issue.input ? 'Please enter your email' : 'Invalid email address',
  }),
})
