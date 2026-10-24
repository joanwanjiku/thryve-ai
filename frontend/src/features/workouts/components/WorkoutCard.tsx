import { buttonStyles } from '../../../components/ui/styles'
import { formatDate, formatEnum } from '../format'
import type { Exercise, Workout, WorkoutStatus } from '../types'

const statusStyles: Record<WorkoutStatus, string> = {
  PLANNED: 'bg-brand-50 text-brand-700',
  IN_PROGRESS: 'bg-accent-500/10 text-accent-600',
  COMPLETED: 'bg-brand-600 text-white',
  SKIPPED: 'bg-gray-100 text-charcoal-700',
}

function describeExercise(e: Exercise): string {
  const parts: string[] = []
  if (e.sets && e.reps) parts.push(`${e.sets} × ${e.reps}`)
  if (e.weightKg) parts.push(`${e.weightKg} kg`)
  if (e.durationSeconds) parts.push(`${e.durationSeconds}s`)
  if (e.distanceMeters) parts.push(`${e.distanceMeters} m`)
  if (e.restSeconds) parts.push(`rest ${e.restSeconds}s`)
  return parts.join(' · ')
}

interface WorkoutCardProps {
  workout: Workout
  isCompleting: boolean
  onComplete: () => void
  onEdit: () => void
  onDelete: () => void
}

export function WorkoutCard({ workout, isCompleting, onComplete, onEdit, onDelete }: WorkoutCardProps) {
  const meta = [
    workout.workoutType && formatEnum(workout.workoutType),
    workout.scheduledDate && formatDate(workout.scheduledDate),
    workout.durationMinutes != null && `${workout.durationMinutes} min`,
    workout.caloriesBurned != null && `${workout.caloriesBurned} kcal`,
  ].filter(Boolean)
  const exercises = [...workout.exercises].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))

  return (
    <article className="rounded-xl border border-gray-200 p-5" aria-label={workout.name}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{workout.name}</h2>
          {meta.length > 0 && <p className="mt-1 text-sm text-charcoal-700">{meta.join(' · ')}</p>}
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[workout.status]}`}>
          {formatEnum(workout.status)}
        </span>
      </div>

      {workout.description && <p className="mt-3 text-charcoal-700">{workout.description}</p>}

      {exercises.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-brand-700">
            {exercises.length} exercise{exercises.length === 1 ? '' : 's'}
          </summary>
          <ul className="mt-2 space-y-1 text-sm">
            {exercises.map((e) => (
              <li key={e.id}>
                <span className="font-medium">{e.name}</span>
                {describeExercise(e) && <span className="text-charcoal-700"> — {describeExercise(e)}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {workout.status !== 'COMPLETED' && (
          <button type="button" onClick={onComplete} disabled={isCompleting} className={buttonStyles.accent}>
            {isCompleting ? 'Completing…' : 'Mark complete'}
          </button>
        )}
        <button type="button" onClick={onEdit} className={buttonStyles.secondary}>
          Edit
        </button>
        <button type="button" onClick={onDelete} className={buttonStyles.secondary}>
          Delete
        </button>
      </div>
    </article>
  )
}
