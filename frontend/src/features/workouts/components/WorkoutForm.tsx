import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Field } from '../../../components/ui/Field'
import { buttonStyles, inputStyles } from '../../../components/ui/styles'
import { formatEnum } from '../format'
import { toFormInput, workoutFormSchema, type WorkoutFormInput, type WorkoutFormValues } from '../schemas'
import { EXERCISE_TYPES, WORKOUT_STATUSES, WORKOUT_TYPES, type Workout } from '../types'

interface WorkoutFormProps {
  /** Present when editing. Exercises are only editable on create (backend limitation). */
  workout?: Workout
  isPending: boolean
  error?: string
  onSubmit: (values: WorkoutFormValues) => void
  onCancel: () => void
}

const emptyExercise: WorkoutFormInput['exercises'][number] = { name: '', exerciseType: '' }

export function WorkoutForm({ workout, isPending, error, onSubmit, onCancel }: WorkoutFormProps) {
  const isEdit = workout !== undefined
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutFormInput, unknown, WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: toFormInput(workout),
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'exercises' })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <input id="name" className={inputStyles} {...register('name')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="workoutType" error={errors.workoutType?.message}>
          <select id="workoutType" className={inputStyles} {...register('workoutType')}>
            <option value="">—</option>
            {WORKOUT_TYPES.map((t) => (
              <option key={t} value={t}>
                {formatEnum(t)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Scheduled date" htmlFor="scheduledDate" error={errors.scheduledDate?.message}>
          <input id="scheduledDate" type="date" className={inputStyles} {...register('scheduledDate')} />
        </Field>
        <Field label="Duration (minutes)" htmlFor="durationMinutes" error={errors.durationMinutes?.message}>
          <input
            id="durationMinutes"
            type="number"
            min={0}
            className={inputStyles}
            {...register('durationMinutes', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Calories burned" htmlFor="caloriesBurned" error={errors.caloriesBurned?.message}>
          <input
            id="caloriesBurned"
            type="number"
            min={0}
            className={inputStyles}
            {...register('caloriesBurned', { valueAsNumber: true })}
          />
        </Field>
        {isEdit && (
          <Field label="Status" htmlFor="status" error={errors.status?.message}>
            <select id="status" className={inputStyles} {...register('status')}>
              {WORKOUT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatEnum(s)}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <Field label="Description" htmlFor="description">
        <textarea id="description" rows={2} className={inputStyles} {...register('description')} />
      </Field>
      <Field label="Notes" htmlFor="notes">
        <textarea id="notes" rows={2} className={inputStyles} {...register('notes')} />
      </Field>

      {!isEdit && (
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-charcoal-800">Exercises</legend>
          {fields.map((field, i) => {
            const e = errors.exercises?.[i]
            return (
              <div key={field.id} className="rounded-lg border border-gray-200 p-3">
                <div className="grid gap-3 sm:grid-cols-4">
                  <Field label="Exercise name" htmlFor={`ex-${i}-name`} error={e?.name?.message} className="sm:col-span-2">
                    <input id={`ex-${i}-name`} className={inputStyles} {...register(`exercises.${i}.name`)} />
                  </Field>
                  <Field label="Type" htmlFor={`ex-${i}-type`} className="sm:col-span-2">
                    <select id={`ex-${i}-type`} className={inputStyles} {...register(`exercises.${i}.exerciseType`)}>
                      <option value="">—</option>
                      {EXERCISE_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {formatEnum(t)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Sets" htmlFor={`ex-${i}-sets`} error={e?.sets?.message}>
                    <input
                      id={`ex-${i}-sets`}
                      type="number"
                      min={1}
                      className={inputStyles}
                      {...register(`exercises.${i}.sets`, { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Reps" htmlFor={`ex-${i}-reps`} error={e?.reps?.message}>
                    <input
                      id={`ex-${i}-reps`}
                      type="number"
                      min={1}
                      className={inputStyles}
                      {...register(`exercises.${i}.reps`, { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Weight (kg)" htmlFor={`ex-${i}-weight`} error={e?.weightKg?.message}>
                    <input
                      id={`ex-${i}-weight`}
                      type="number"
                      min={0}
                      step="0.5"
                      className={inputStyles}
                      {...register(`exercises.${i}.weightKg`, { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Rest (s)" htmlFor={`ex-${i}-rest`} error={e?.restSeconds?.message}>
                    <input
                      id={`ex-${i}-rest`}
                      type="number"
                      min={0}
                      className={inputStyles}
                      {...register(`exercises.${i}.restSeconds`, { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Duration (s)" htmlFor={`ex-${i}-duration`} error={e?.durationSeconds?.message}>
                    <input
                      id={`ex-${i}-duration`}
                      type="number"
                      min={0}
                      className={inputStyles}
                      {...register(`exercises.${i}.durationSeconds`, { valueAsNumber: true })}
                    />
                  </Field>
                  <Field label="Distance (m)" htmlFor={`ex-${i}-distance`} error={e?.distanceMeters?.message}>
                    <input
                      id={`ex-${i}-distance`}
                      type="number"
                      min={0}
                      className={inputStyles}
                      {...register(`exercises.${i}.distanceMeters`, { valueAsNumber: true })}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="mt-2 text-sm font-medium text-red-600 hover:underline"
                >
                  Remove exercise
                </button>
              </div>
            )
          })}
          <button type="button" onClick={() => append(emptyExercise)} className={buttonStyles.secondary}>
            + Add exercise
          </button>
          <p className="text-xs text-charcoal-700">Exercises can't be changed after the workout is created.</p>
        </fieldset>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={buttonStyles.secondary}>
          Cancel
        </button>
        <button type="submit" disabled={isPending} className={buttonStyles.primary}>
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create workout'}
        </button>
      </div>
    </form>
  )
}
