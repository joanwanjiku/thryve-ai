import { Navigate, Outlet } from 'react-router'
import { useCurrentUser } from '../features/auth/hooks'
import { getToken } from '../features/auth/token'
import { NotFoundPage } from '../pages/NotFoundPage'

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
    </div>
  )
}

export function RequireAuth() {
  if (!getToken()) return <Navigate to="/client/login" replace />
  return <Outlet />
}

/** Cosmetic only: the backend must enforce ADMIN itself. Non-admins get a 404 so the route isn't advertised. */
export function RequireAdmin() {
  const { data: user, isPending } = useCurrentUser()
  if (!getToken()) return <NotFoundPage />
  if (isPending) return <FullPageSpinner />
  return user?.role === 'ADMIN' ? <Outlet /> : <NotFoundPage />
}
