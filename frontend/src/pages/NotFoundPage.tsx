import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link to="/" className="text-brand-700 underline">
        Back to home
      </Link>
    </main>
  )
}
