import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { completeWorkout, createWorkout, deleteWorkout, fetchWorkouts, updateWorkout } from './api'
import type { UpdateWorkoutRequest } from './types'

// Every workout query lives under this prefix so one invalidation refreshes lists and stats.
export const workoutKeys = {
  all: ['workouts'] as const,
  list: () => [...workoutKeys.all, 'list'] as const,
}

export function useWorkouts() {
  return useInfiniteQuery({
    queryKey: workoutKeys.list(),
    queryFn: ({ pageParam }) => fetchWorkouts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  })
}

function useInvalidateWorkouts() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: workoutKeys.all })
}

export function useCreateWorkout() {
  const onSuccess = useInvalidateWorkouts()
  return useMutation({ mutationFn: createWorkout, onSuccess })
}

export function useUpdateWorkout() {
  const onSuccess = useInvalidateWorkouts()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateWorkoutRequest }) => updateWorkout(id, body),
    onSuccess,
  })
}

export function useCompleteWorkout() {
  const onSuccess = useInvalidateWorkouts()
  return useMutation({ mutationFn: completeWorkout, onSuccess })
}

export function useDeleteWorkout() {
  const onSuccess = useInvalidateWorkouts()
  return useMutation({ mutationFn: deleteWorkout, onSuccess })
}
