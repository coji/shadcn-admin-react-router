import { coerceFormValue } from '@conform-to/zod/v4/future'
import { z } from 'zod'

export const displayFormSchema = coerceFormValue(
  z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: 'You have to select at least one item.',
    }),
  }),
)
