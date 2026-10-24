import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { setToken } from '../../features/auth/token'
import type { CreateWorkoutRequest, UpdateWorkoutRequest } from '../../features/workouts/types'
import { apiUrl, makeWorkout, meHandler, ok, page } from '../../test/fixtures'
import { server } from '../../test/server'
import { renderRoute } from '../../test/utils'

const PATH = '/client/dashboard/workouts'

describe('WorkoutsPage', () => {
  beforeEach(() => {
    setToken('tok')
    server.use(meHandler())
  })

  it('lists workouts and loads more pages on demand', async () => {
    server.use(
      http.get(apiUrl('/workouts'), ({ request }) => {
        const n = Number(new URL(request.url).searchParams.get('page'))
        return n === 0
          ? ok(page([makeWorkout()], 0, false))
          : ok(page([makeWorkout({ id: 'w2', name: 'Morning run', workoutType: 'CARDIO' })], 1, true))
      }),
    )
    renderRoute(PATH)

    expect(await screen.findByRole('article', { name: 'Leg day' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Load more' }))

    expect(await screen.findByRole('article', { name: 'Morning run' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument()
  })

  it('creates a workout with exercises', async () => {
    let body: CreateWorkoutRequest | undefined
    server.use(
      http.get(apiUrl('/workouts'), () => ok(page([]))),
      http.post(apiUrl('/workouts'), async ({ request }) => {
        body = (await request.json()) as CreateWorkoutRequest
        return ok(makeWorkout({ name: body.name }), 201)
      }),
    )
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: 'New workout' }))
    const dialog = screen.getByRole('dialog', { name: 'New workout' })
    await user.type(within(dialog).getByLabelText('Name'), 'Push day')
    await user.selectOptions(within(dialog).getByLabelText('Type'), 'STRENGTH')
    await user.type(within(dialog).getByLabelText('Duration (minutes)'), '60')
    await user.click(within(dialog).getByRole('button', { name: '+ Add exercise' }))
    await user.type(within(dialog).getByLabelText('Exercise name'), 'Bench press')
    await user.type(within(dialog).getByLabelText('Sets'), '3')
    await user.type(within(dialog).getByLabelText('Reps'), '8')
    await user.click(within(dialog).getByRole('button', { name: 'Create workout' }))

    await expect.poll(() => screen.queryByRole('dialog')).toBeNull()
    expect(body).toMatchObject({
      name: 'Push day',
      workoutType: 'STRENGTH',
      durationMinutes: 60,
      exercises: [{ name: 'Bench press', sets: 3, reps: 8, orderIndex: 0 }],
    })
    // Empty optional fields are omitted rather than sent as '' or NaN.
    expect(body).not.toHaveProperty('scheduledDate')
    expect(body?.exercises[0]).not.toHaveProperty('weightKg')
  })

  it('validates the workout name before submitting', async () => {
    server.use(http.get(apiUrl('/workouts'), () => ok(page([]))))
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: 'New workout' }))
    await user.type(screen.getByLabelText('Name'), 'ab')
    await user.click(screen.getByRole('button', { name: 'Create workout' }))

    expect(await screen.findByText('Workout name must be between 3 and 100 characters')).toBeInTheDocument()
  })

  it('edits a workout', async () => {
    let body: UpdateWorkoutRequest | undefined
    server.use(
      http.get(apiUrl('/workouts'), () => ok(page([makeWorkout()]))),
      http.put(apiUrl('/workouts/w1'), async ({ request }) => {
        body = (await request.json()) as UpdateWorkoutRequest
        return ok(makeWorkout({ ...body, workoutType: 'STRENGTH' }))
      }),
    )
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: 'Edit' }))
    const dialog = screen.getByRole('dialog', { name: 'Edit workout' })
    expect(within(dialog).queryByText('Exercises')).not.toBeInTheDocument()
    const name = within(dialog).getByLabelText('Name')
    await user.clear(name)
    await user.type(name, 'Heavy leg day')
    await user.selectOptions(within(dialog).getByLabelText('Status'), 'SKIPPED')
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))

    await expect.poll(() => screen.queryByRole('dialog')).toBeNull()
    expect(body).toMatchObject({ name: 'Heavy leg day', status: 'SKIPPED', durationMinutes: 45 })
    expect(body).not.toHaveProperty('exercises')
  })

  it('marks a workout complete', async () => {
    let completed = false
    server.use(
      http.get(apiUrl('/workouts'), () => ok(page([makeWorkout({ status: completed ? 'COMPLETED' : 'PLANNED' })]))),
      http.post(apiUrl('/workouts/w1/complete'), () => {
        completed = true
        return ok(makeWorkout({ status: 'COMPLETED' }))
      }),
    )
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: 'Mark complete' }))

    expect(await screen.findByText('Completed')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mark complete' })).not.toBeInTheDocument()
  })

  it('asks for confirmation before deleting', async () => {
    let deleted = false
    server.use(
      http.get(apiUrl('/workouts'), () => ok(page(deleted ? [] : [makeWorkout()]))),
      http.delete(apiUrl('/workouts/w1'), () => {
        deleted = true
        return new Response(null, { status: 204 })
      }),
    )
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    const dialog = screen.getByRole('dialog', { name: 'Delete workout?' })
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(deleted).toBe(false)

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText(/No workouts yet/)).toBeInTheDocument()
    expect(deleted).toBe(true)
  })
})
