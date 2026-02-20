import { coerceFormValue } from '@conform-to/zod/v4/future'
import { z } from 'zod'

export const formSchema = coerceFormValue(
  z.object({
    otp: z.string({ error: 'Please enter your otp code.' }),
  }),
)
