import { z } from 'zod'

export const visitRequestSchema = z.object({
  mode: z.enum(['in_person', 'virtual']),
  requestedDate: z.string().min(1, 'Pick a date'),
  notes: z.string().max(500).optional(),
})

export type VisitRequestFormValues = z.infer<typeof visitRequestSchema>
