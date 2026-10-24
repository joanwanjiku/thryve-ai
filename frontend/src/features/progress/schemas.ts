import { z } from 'zod'
import { METRIC_TYPES, METRIC_UNITS, type CreateProgressMetricRequest } from './types'

// Mirrors ProgressMetricDTO.CreateProgressMetricRequest validation.
export const progressFormSchema = z.object({
  metricType: z.enum(METRIC_TYPES),
  value: z.number('Value is required').min(0, 'Value must be positive'),
  recordedAt: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
})

export type ProgressFormValues = z.infer<typeof progressFormSchema>

/** Unit is derived from the metric type, never typed by the user. */
export function toCreateRequest(values: ProgressFormValues): CreateProgressMetricRequest {
  return { ...values, unit: METRIC_UNITS[values.metricType] || undefined }
}
