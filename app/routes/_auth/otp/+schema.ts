import { z } from 'zod'

export const formSchema = z.object({
  otp: z.string({ error: 'Please enter your otp code.' }),
})
