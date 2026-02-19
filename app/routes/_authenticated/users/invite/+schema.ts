import { z } from 'zod'

export const formSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? 'Please enter your email'
        : 'Invalid email address',
  }),
  role: z.enum(['superadmin', 'admin', 'manager', 'cashier'], {
    error: 'Role is required.',
  }),
  desc: z.string().optional(),
})
