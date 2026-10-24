import { http, HttpResponse } from 'msw'
import type { Workout } from '../features/workouts/types'
import { API_BASE_URL } from '../lib/config'
import type { Page } from '../types/api'

export const apiUrl = (path: string) => `${API_BASE_URL}/api/v1${path}`

export const ok = <T>(data: T, statusCode = 200) =>
  HttpResponse.json({ success: true, statusCode, data, timestamp: '2026-10-23T00:00:00' }, { status: statusCode })

export function page<T>(content: T[], number = 0, last = true): Page<T> {
  return { content, number, last, first: number === 0, size: 10, totalElements: content.length, totalPages: 1 }
}

export const meHandler = (role = 'USER') =>
  http.get(apiUrl('/auth/me'), () => ok({ id: 'u1', email: 'test@example.com', displayName: 'Test User', role }))

export function makeWorkout(overrides: Partial<Workout> = {}): Workout {
  return {
    id: 'w1',
    name: 'Leg day',
    workoutType: 'STRENGTH',
    scheduledDate: '2026-10-20',
    durationMinutes: 45,
    status: 'PLANNED',
    exercises: [],
    createdAt: '2026-10-19T10:00:00',
    updatedAt: '2026-10-19T10:00:00',
    ...overrides,
  }
}
