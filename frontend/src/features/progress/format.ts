import { METRIC_UNITS, type MetricType } from './types'

const LABELS: Record<MetricType, string> = {
  WEIGHT: 'Weight',
  BODY_FAT: 'Body fat',
  MUSCLE_MASS: 'Muscle mass',
  BMI: 'BMI',
  WAIST: 'Waist',
  CHEST: 'Chest',
  ARMS: 'Arms',
  LEGS: 'Legs',
}

export const formatMetric = (type: MetricType) => LABELS[type]

export function formatValue(type: MetricType, value: number): string {
  const unit = METRIC_UNITS[type]
  const n = Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 })
  return unit === '%' ? `${n}%` : unit ? `${n} ${unit}` : n
}

/** Backend sends zone-less `LocalDateTime`, which `Date` parses as local time. */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const formatShortDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

/** Current local time as a `datetime-local` input value (`yyyy-mm-ddThh:mm`). */
export function nowForInput(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}
