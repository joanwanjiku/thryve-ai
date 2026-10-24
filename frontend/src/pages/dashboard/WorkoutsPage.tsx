import { useState } from 'react'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { buttonStyles } from '../../components/ui/styles'
import { WorkoutCard } from '../../features/workouts/components/WorkoutCard'
import { WorkoutForm } from '../../features/workouts/components/WorkoutForm'
import {
  useCompleteWorkout,
  useCreateWorkout,
  useDeleteWorkout,
  useUpdateWorkout,
  useWorkouts,
} from '../../features/workouts/hooks'
import { toCreateRequest, toUpdateRequest } from '../../features/workouts/schemas'
import type { Workout } from '../../features/workouts/types'
import { getErrorMessage } from '../../lib/errors'

type FormState = { mode: 'create' } | { mode: 'edit'; workout: Workout } | null

export function WorkoutsPage() {
  const workouts = useWorkouts()
  const createWorkout = useCreateWorkout()
  const updateWorkout = useUpdateWorkout()
  const completeWorkout = useCompleteWorkout()
  const deleteWorkout = useDeleteWorkout()

  const [form, setForm] = useState<FormState>(null)
  const [toDelete, setToDelete] = useState<Workout | null>(null)

  const closeForm = () => {
    createWorkout.reset()
    updateWorkout.reset()
    setForm(null)
  }
  const closeDelete = () => {
    deleteWorkout.reset()
    setToDelete(null)
  }

  const items = workouts.data?.pages.flatMap((p) => p.content) ?? []

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <button type="button" onClick={() => setForm({ mode: 'create' })} className={buttonStyles.primary}>
          New workout
        </button>
      </div>

      {workouts.isPending && <p className="mt-6 text-charcoal-700">Loading workouts…</p>}
      {workouts.isError && (
        <p role="alert" className="mt-6 text-red-600">
          {getErrorMessage(workouts.error)}
        </p>
      )}
      {workouts.isSuccess && items.length === 0 && (
        <p className="mt-6 text-charcoal-700">No workouts yet. Create your first one to get started.</p>
      )}

      {completeWorkout.isError && (
        <p role="alert" className="mt-6 text-red-600">
          {getErrorMessage(completeWorkout.error)}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {items.map((w) => (
          <WorkoutCard
            key={w.id}
            workout={w}
            isCompleting={completeWorkout.isPending && completeWorkout.variables === w.id}
            onComplete={() => completeWorkout.mutate(w.id)}
            onEdit={() => setForm({ mode: 'edit', workout: w })}
            onDelete={() => setToDelete(w)}
          />
        ))}
      </div>

      {workouts.hasNextPage && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => workouts.fetchNextPage()}
            disabled={workouts.isFetchingNextPage}
            className={buttonStyles.secondary}
          >
            {workouts.isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}

      {form?.mode === 'create' && (
        <Modal title="New workout" onClose={closeForm}>
          <WorkoutForm
            isPending={createWorkout.isPending}
            error={createWorkout.isError ? getErrorMessage(createWorkout.error) : undefined}
            onCancel={closeForm}
            onSubmit={(values) => createWorkout.mutate(toCreateRequest(values), { onSuccess: closeForm })}
          />
        </Modal>
      )}

      {form?.mode === 'edit' && (
        <Modal title="Edit workout" onClose={closeForm}>
          <WorkoutForm
            workout={form.workout}
            isPending={updateWorkout.isPending}
            error={updateWorkout.isError ? getErrorMessage(updateWorkout.error) : undefined}
            onCancel={closeForm}
            onSubmit={(values) =>
              updateWorkout.mutate({ id: form.workout.id, body: toUpdateRequest(values) }, { onSuccess: closeForm })
            }
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete workout?"
          message={`"${toDelete.name}" and its exercises will be permanently deleted.`}
          isPending={deleteWorkout.isPending}
          error={deleteWorkout.isError ? getErrorMessage(deleteWorkout.error) : undefined}
          onCancel={closeDelete}
          onConfirm={() => deleteWorkout.mutate(toDelete.id, { onSuccess: closeDelete })}
        />
      )}
    </div>
  )
}
