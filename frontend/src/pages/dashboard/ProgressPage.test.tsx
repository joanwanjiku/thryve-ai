import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { setToken } from '../../features/auth/token'
import type { CreateProgressMetricRequest, ProgressMetric } from '../../features/progress/types'
import { apiUrl, meHandler, ok } from '../../test/fixtures'
import { server } from '../../test/server'
import { renderRoute } from '../../test/utils'

const PATH = '/client/dashboard/progress'

const entry = (overrides: Partial<ProgressMetric> = {}): ProgressMetric => ({
  id: 'p1',
  metricType: 'WEIGHT',
  value: 72.4,
  unit: 'kg',
  recordedAt: '2026-10-20T08:00:00',
  ...overrides,
})

describe('ProgressPage', () => {
  beforeEach(() => {
    setToken('tok')
    server.use(meHandler())
  })

  it('shows the latest value and history for the selected metric', async () => {
    server.use(
      http.get(apiUrl('/progress/type/WEIGHT'), () =>
        ok([entry(), entry({ id: 'p0', value: 74, recordedAt: '2026-10-01T08:00:00' })]),
      ),
      http.get(apiUrl('/progress/type/BODY_FAT'), () => ok([entry({ id: 'b1', metricType: 'BODY_FAT', value: 18.5 })])),
    )
    const user = userEvent.setup()
    renderRoute(PATH)

    const panel = await screen.findByRole('tabpanel', { name: 'Weight' })
    expect(await within(panel).findAllByText('72.4 kg')).toHaveLength(2) // headline + table row
    expect(within(panel).getByRole('img', { name: /line chart/i })).toBeInTheDocument()
    expect(within(panel).getAllByRole('row')).toHaveLength(3)

    await user.click(screen.getByRole('tab', { name: 'Body fat' }))
    expect(await screen.findByRole('tabpanel', { name: 'Body fat' })).toBeInTheDocument()
    expect(await screen.findAllByText('18.5%')).toHaveLength(2)
  })

  it('logs an entry with the unit derived from the metric', async () => {
    let body: CreateProgressMetricRequest | undefined
    server.use(
      http.get(apiUrl('/progress/type/:type'), () => ok([])),
      http.post(apiUrl('/progress'), async ({ request }) => {
        body = (await request.json()) as CreateProgressMetricRequest
        return ok(entry({ ...body, id: 'new' }), 201)
      }),
    )
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: 'Log entry' }))
    const dialog = screen.getByRole('dialog', { name: 'Log progress' })
    await user.selectOptions(within(dialog).getByLabelText('Metric'), 'WAIST')
    await user.type(within(dialog).getByLabelText('Value (cm)'), '81.5')
    await user.click(within(dialog).getByRole('button', { name: 'Save entry' }))

    await expect.poll(() => screen.queryByRole('dialog')).toBeNull()
    expect(body).toMatchObject({ metricType: 'WAIST', value: 81.5, unit: 'cm' })
    expect(body?.recordedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    // Switches to the metric that was just logged.
    expect(screen.getByRole('tab', { name: 'Waist' })).toHaveAttribute('aria-selected', 'true')
  })

  it('requires a value', async () => {
    server.use(http.get(apiUrl('/progress/type/:type'), () => ok([])))
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: 'Log entry' }))
    await user.click(screen.getByRole('button', { name: 'Save entry' }))

    expect(await screen.findByText('Value is required')).toBeInTheDocument()
  })

  it('asks for confirmation before deleting an entry', async () => {
    let deleted = false
    server.use(
      http.get(apiUrl('/progress/type/WEIGHT'), () => ok(deleted ? [] : [entry()])),
      http.delete(apiUrl('/progress/p1'), () => {
        deleted = true
        return new Response(null, { status: 200 })
      }),
    )
    const user = userEvent.setup()
    renderRoute(PATH)

    await user.click(await screen.findByRole('button', { name: /Delete entry from/ }))
    const dialog = screen.getByRole('dialog', { name: 'Delete entry?' })
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('No weight entries yet.')).toBeInTheDocument()
    expect(deleted).toBe(true)
  })
})
