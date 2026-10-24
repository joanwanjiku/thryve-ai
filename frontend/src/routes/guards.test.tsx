import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { setToken } from '../features/auth/token'
import { meHandler } from '../test/fixtures'
import { server } from '../test/server'
import { renderRoute } from '../test/utils'

const meReturns = (role: string) => server.use(meHandler(role))

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
