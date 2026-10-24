import { z } from 'zod'
import {
  EXERCISE_TYPES,
  WORKOUT_STATUSES,
  WORKOUT_TYPES,
  type CreateWorkoutRequest,
  type UpdateWorkoutRequest,
  type Workout,
} from './types'

// Number inputs are registered with `valueAsNumber`, so an empty field arrives as NaN.
const optionalNumber = (min: number, { int = false } = {}) => {
  const base = int ? z.number().int('Must be a whole number') : z.number()
  return z.union([z.nan().transform(() => undefined), base.min(min, `Must be at least ${min}`)]).optional()
}

// Selects use '' for "none"; the backend can't parse '' as an enum or LocalDate.
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.literal('').transform(() => undefined), z.enum(values)]).optional()

const optionalDate = z
  .string()
  .optional()
  .transform((v) => v || undefined)

// Mirrors ExerciseDTO.CreateExerciseRequest validation.
export const exerciseSchema = z.object({
  name: z.string().trim().min(1, 'Exercise name is required'),
  exerciseType: optionalEnum(EXERCISE_TYPES),
  sets: optionalNumber(1, { int: true }),
  reps: optionalNumber(1, { int: true }),
  weightKg: optionalNumber(0),
  durationSeconds: optionalNumber(0, { int: true }),
  distanceMeters: optionalNumber(0),
  restSeconds: optionalNumber(0, { int: true }),
  notes: z.string().optional(),
})

// One schema for both create and edit: create uses `exercises`, edit uses `status`.
// Mirrors WorkoutDTO.CreateWorkoutRequest / UpdateWorkoutRequest validation.
export const workoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Workout name must be between 3 and 100 characters')
    .max(100, 'Workout name must be between 3 and 100 characters'),
  description: z.string().optional(),
  workoutType: optionalEnum(WORKOUT_TYPES),
  scheduledDate: optionalDate,
  durationMinutes: optionalNumber(0, { int: true }),
  caloriesBurned: optionalNumber(0, { int: true }),
  notes: z.string().optional(),
  status: z.enum(WORKOUT_STATUSES).optional(),
  exercises: z.array(exerciseSchema),
})

export type WorkoutFormInput = z.input<typeof workoutFormSchema>
export type WorkoutFormValues = z.output<typeof workoutFormSchema>

export function toCreateRequest({ status: _status, exercises, ...fields }: WorkoutFormValues): CreateWorkoutRequest {
  return { ...fields, exercises: exercises.map((e, i) => ({ ...e, orderIndex: i })) }
}

export function toUpdateRequest({ exercises: _exercises, ...fields }: WorkoutFormValues): UpdateWorkoutRequest {
  return fields
}

export function toFormInput(workout?: Workout): WorkoutFormInput {
  if (!workout) return { name: '', workoutType: '', scheduledDate: '', exercises: [] }
  return {
    name: workout.name,
    description: workout.description ?? '',
    workoutType: workout.workoutType ?? '',
    scheduledDate: workout.scheduledDate ?? '',
    durationMinutes: workout.durationMinutes,
    caloriesBurned: workout.caloriesBurned,
    notes: workout.notes ?? '',
    status: workout.status,
    exercises: [],
  }
}
