import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../test/utils'
import { getToken } from './token'

describe('AuthCallbackPage', () => {
  it('stores the token and replaces the callback entry with the dashboard', async () => {
    const router = renderRoute('/auth/callback?token=abc.def.ghi')

    await expect.poll(() => router.state.location.pathname).toBe('/client/dashboard')
    expect(router.state.location.search).toBe('')
    expect(getToken()).toBe('abc.def.ghi')
  })

  it('sends the user to login when no token is present', async () => {
    const router = renderRoute('/auth/callback')

    await expect.poll(() => router.state.location.pathname).toBe('/client/login')
    expect(getToken()).toBeNull()
  })
})
