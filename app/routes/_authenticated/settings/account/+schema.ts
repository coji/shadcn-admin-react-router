import { coerceFormValue } from '@conform-to/zod/v4/future'
import { z } from 'zod'

export const accountFormSchema = coerceFormValue(
  z.object({
    name: z
      .string({ error: 'Name must be at least 2 characters.' })
      .min(2, {
        message: 'Name must be at least 2 characters.',
      })
      .max(30, {
        message: 'Name must not be longer than 30 characters.',
      }),
    dob: z.date({
      error: 'A date of birth is required.',
    }),
    language: z.string({
      error: 'Please select a language.',
    }),
  }),
)
