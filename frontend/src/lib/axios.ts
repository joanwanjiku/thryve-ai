import axios, { AxiosError } from 'axios'
import { clearToken, getToken } from '../features/auth/token'
import type { ApiResponse } from '../types/api'
import { API_BASE_URL } from './config'

export const SESSION_EXPIRED_PATH = '/client/login?expired=1'

export const api = axios.create({ baseURL: `${API_BASE_URL}/api/v1` })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // The Google ID token lives ~1h with no refresh token, so a 401 means "sign in again".
    if (error.response?.status === 401) {
      clearToken()
      window.location.assign(SESSION_EXPIRED_PATH)
    }
    return Promise.reject(error)
  },
)

/** Strips the `ApiResponse` envelope. */
export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data
}
