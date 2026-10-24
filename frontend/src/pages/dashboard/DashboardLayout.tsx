import { NavLink, Outlet } from 'react-router'
import { useCurrentUser, useLogout } from '../../features/auth/hooks'

const links = [
  { to: '/client/dashboard', label: 'Overview', end: true },
  { to: '/client/dashboard/workouts', label: 'Workouts' },
  { to: '/client/dashboard/progress', label: 'Progress' },
  { to: '/client/dashboard/goals', label: 'Goals' },
]

export function DashboardLayout() {
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="bg-charcoal-900 text-white md:w-60 md:shrink-0">
        <div className="px-6 py-5 text-2xl font-bold text-brand-500">Thryve</div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 font-medium ${isActive ? 'bg-brand-600' : 'hover:bg-charcoal-800'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b border-gray-200 px-6 py-4">
          {user && <span className="text-sm text-charcoal-700">{user.displayName}</span>}
          <button onClick={logout} className="text-sm font-medium text-brand-700 hover:underline">
            Log out
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
