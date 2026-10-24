import { api, unwrap } from '../../lib/axios'
import type { ApiResponse, Page } from '../../types/api'
import type { CreateWorkoutRequest, UpdateWorkoutRequest, Workout } from './types'

export const WORKOUTS_PAGE_SIZE = 10

export async function fetchWorkouts(page: number): Promise<Page<Workout>> {
  return unwrap(
    await api.get<ApiResponse<Page<Workout>>>('/workouts', {
      params: { page, size: WORKOUTS_PAGE_SIZE, sortBy: 'scheduledDate', sortDir: 'DESC' },
    }),
  )
}

export async function createWorkout(body: CreateWorkoutRequest): Promise<Workout> {
  return unwrap(await api.post<ApiResponse<Workout>>('/workouts', body))
}

export async function updateWorkout(id: string, body: UpdateWorkoutRequest): Promise<Workout> {
  return unwrap(await api.put<ApiResponse<Workout>>(`/workouts/${id}`, body))
}

export async function completeWorkout(id: string): Promise<Workout> {
  return unwrap(await api.post<ApiResponse<Workout>>(`/workouts/${id}/complete`))
}

export async function deleteWorkout(id: string): Promise<void> {
  await api.delete(`/workouts/${id}`)
}
