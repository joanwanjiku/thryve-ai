import { screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { setToken } from '../features/auth/token'
import { API_BASE_URL } from '../lib/config'
import { server } from '../test/server'
import { renderRoute } from '../test/utils'

function meReturns(role: string) {
  server.use(
    http.get(`${API_BASE_URL}/api/v1/auth/me`, () =>
      HttpResponse.json({ success: true, statusCode: 200, data: { id: '1', email: 'a@b.c', displayName: 'A', role } }),
    ),
  )
}

describe('route guards', () => {
  it('redirects unauthenticated users from the dashboard to login', async () => {
    const router = renderRoute('/client/dashboard')
    await expect.poll(() => router.state.location.pathname).toBe('/client/login')
  })

  it('shows a 404 at /admin for non-admins', async () => {
    setToken('tok')
    meReturns('USER')
    renderRoute('/admin')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('shows the admin page to admins', async () => {
    setToken('tok')
    meReturns('ADMIN')
    renderRoute('/admin')
    expect(await screen.findByRole('heading', { name: 'Admin' })).toBeInTheDocument()
  })
})
