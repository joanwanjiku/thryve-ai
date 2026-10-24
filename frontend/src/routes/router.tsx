import { createBrowserRouter } from 'react-router'
import { AuthCallbackPage } from '../features/auth/AuthCallbackPage'
import { AdminPage } from '../pages/AdminPage'
import { DashboardLayout } from '../pages/dashboard/DashboardLayout'
import { GoalsPage } from '../pages/dashboard/GoalsPage'
import { OverviewPage } from '../pages/dashboard/OverviewPage'
import { ProgressPage } from '../pages/dashboard/ProgressPage'
import { WorkoutsPage } from '../pages/dashboard/WorkoutsPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RequireAdmin, RequireAuth } from './guards'

export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/client/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/client/dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: 'workouts', element: <WorkoutsPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'goals', element: <GoalsPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAdmin />,
    children: [{ path: '/admin', element: <AdminPage /> }],
  },
  { path: '*', element: <NotFoundPage /> },
]

export const router = createBrowserRouter(routes)
