import type { ExerciseType, WorkoutStatus, WorkoutType } from './types'

/** `HIIT` → `HIIT`, `IN_PROGRESS` → `In progress`. */
export function formatEnum(value: WorkoutType | WorkoutStatus | ExerciseType): string {
  if (value === 'HIIT') return value
  const words = value.toLowerCase().replace(/_/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Formats an ISO `yyyy-mm-dd` as a local date without the UTC off-by-one shift. */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}
