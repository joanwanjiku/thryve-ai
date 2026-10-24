import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { api } from '../lib/axios'
import { server } from './server'

// MSW's Node interceptor doesn't see jsdom's XMLHttpRequest; route axios through fetch instead.
api.defaults.adapter = 'fetch'

// jsdom has no ResizeObserver; Recharts' ResponsiveContainer needs one.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => {
  server.resetHandlers()
  cleanup()
  sessionStorage.clear()
})
afterAll(() => server.close())
