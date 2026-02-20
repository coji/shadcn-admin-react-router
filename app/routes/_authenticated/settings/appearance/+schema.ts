import { coerceFormValue } from '@conform-to/zod/v4/future'
import { z } from 'zod'

export const appearanceFormSchema = coerceFormValue(
  z.object({
    theme: z.enum(['light', 'dark'], {
      error: 'Please select a theme.',
    }),
    font: z.enum(['inter', 'manrope', 'system'], {
      error: 'Please select a font.',
    }),
  }),
)
