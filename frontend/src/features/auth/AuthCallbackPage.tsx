import { Navigate, useSearchParams } from 'react-router'
import { setToken } from './token'

/** Landing point for the backend's OAuth2SuccessHandler: `/auth/callback?token=<Google ID token>`. */
export function AuthCallbackPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  if (token) setToken(token)

  // `replace` overwrites this history entry, so the token never stays in browser history.
  return <Navigate to={token ? '/client/dashboard' : '/client/login'} replace />
}
