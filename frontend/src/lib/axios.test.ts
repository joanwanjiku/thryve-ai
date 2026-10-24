import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getToken, setToken } from '../features/auth/token'
import { server } from '../test/server'
import { api, SESSION_EXPIRED_PATH } from './axios'
import { API_BASE_URL } from './config'

const ME = `${API_BASE_URL}/api/v1/auth/me`

describe('api client', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('attaches the bearer token', async () => {
    setToken('tok')
    let auth: string | null = null
    server.use(
      http.get(ME, ({ request }) => {
        auth = request.headers.get('Authorization')
        return HttpResponse.json({ success: true, statusCode: 200, data: {} })
      }),
    )

    await api.get('/auth/me')

    expect(auth).toBe('Bearer tok')
  })

  it('clears the token and redirects to login on 401', async () => {
    setToken('expired')
    const assign = vi.fn()
    vi.stubGlobal('location', { ...window.location, assign })
    server.use(http.get(ME, () => new HttpResponse(null, { status: 401 })))

    await expect(api.get('/auth/me')).rejects.toThrow()

    expect(getToken()).toBeNull()
    expect(assign).toHaveBeenCalledWith(SESSION_EXPIRED_PATH)
  })
})
