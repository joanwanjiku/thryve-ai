import { api, unwrap } from '../../lib/axios'
import type { ApiResponse } from '../../types/api'
import type { CurrentUser } from './types'

export async function fetchCurrentUser(): Promise<CurrentUser> {
  return unwrap(await api.get<ApiResponse<CurrentUser>>('/auth/me'))
}
