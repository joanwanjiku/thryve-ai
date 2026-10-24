// Mirrors backend WorkoutDTO / ExerciseDTO and their enums.
export const WORKOUT_TYPES = ['CARDIO', 'STRENGTH', 'HIIT', 'YOGA', 'CROSSFIT', 'FLEXIBILITY', 'OTHER'] as const
export type WorkoutType = (typeof WORKOUT_TYPES)[number]

export const WORKOUT_STATUSES = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'] as const
export type WorkoutStatus = (typeof WORKOUT_STATUSES)[number]

export const EXERCISE_TYPES = ['CARDIO', 'STRENGTH', 'FLEXIBILITY', 'BALANCE', 'PLYOMETRIC'] as const
export type ExerciseType = (typeof EXERCISE_TYPES)[number]

export interface Exercise {
  id: string
  name: string
  exerciseType?: ExerciseType
  sets?: number
  reps?: number
  weightKg?: number
  durationSeconds?: number
  distanceMeters?: number
  restSeconds?: number
  orderIndex?: number
  notes?: string
}

export interface Workout {
  id: string
  name: string
  description?: string
  workoutType?: WorkoutType
  scheduledDate?: string // ISO date
  durationMinutes?: number
  caloriesBurned?: number
  status: WorkoutStatus
  notes?: string
  exercises: Exercise[]
  createdAt: string
  updatedAt: string
}

export interface CreateExerciseRequest extends Omit<Exercise, 'id'> {}

export interface CreateWorkoutRequest {
  name: string
  description?: string
  workoutType?: WorkoutType
  scheduledDate?: string
  durationMinutes?: number
  caloriesBurned?: number
  notes?: string
  exercises: CreateExerciseRequest[]
}

/** Exercises can't be changed after creation; the backend ignores null fields. */
export interface UpdateWorkoutRequest extends Omit<CreateWorkoutRequest, 'exercises'> {
  status?: WorkoutStatus
}
