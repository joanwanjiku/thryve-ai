// Mirrors backend ProgressMetricDTO and MetricType.
export const METRIC_TYPES = ['WEIGHT', 'BODY_FAT', 'MUSCLE_MASS', 'BMI', 'WAIST', 'CHEST', 'ARMS', 'LEGS'] as const
export type MetricType = (typeof METRIC_TYPES)[number]

/** Units are fixed per metric so charts never mix scales. */
export const METRIC_UNITS: Record<MetricType, string> = {
  WEIGHT: 'kg',
  BODY_FAT: '%',
  MUSCLE_MASS: 'kg',
  BMI: '',
  WAIST: 'cm',
  CHEST: 'cm',
  ARMS: 'cm',
  LEGS: 'cm',
}

export interface ProgressMetric {
  id: string
  metricType: MetricType
  value: number
  unit?: string
  recordedAt: string // ISO date-time
  notes?: string
}

export interface CreateProgressMetricRequest {
  metricType: MetricType
  value: number
  unit?: string
  recordedAt?: string // ISO local date-time
  notes?: string
}
