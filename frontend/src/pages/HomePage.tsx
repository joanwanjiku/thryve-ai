import { Link } from 'react-router'

// TODO: replace gradient placeholders with royalty-free images in src/assets.
const benefits = [
  { title: 'Heart health', body: 'Regular activity strengthens your heart and lowers blood pressure.' },
  { title: 'Strength', body: 'Resistance training builds muscle, protects joints and keeps bones dense.' },
  { title: 'Mental health', body: 'Exercise reduces stress and anxiety and improves sleep and focus.' },
  { title: 'Longevity', body: 'Active people live longer, healthier lives with more energy every day.' },
]

const features = [
  { title: 'Track workouts', body: 'Plan sessions, log exercises, sets and reps, and mark them complete.' },
  { title: 'Log body metrics', body: 'Record weight, body fat, BMI and measurements over time.' },
  { title: 'See progress', body: 'Charts show how far you have come and keep you motivated.' },
]

const trainingTypes = ['Strength', 'Cardio', 'HIIT', 'Flexibility', 'Yoga']

const currentYear = new Date().getFullYear()

export function HomePage() {
  return (
    <div>
      <header className="bg-charcoal-900">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <span className="text-2xl font-bold text-brand-500">Thryve</span>
          <Link to="/client/login" className="font-medium text-white hover:text-brand-500">
            Sign in
          </Link>
        </nav>

        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">
              Get stronger, <span className="text-brand-500">every day.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Thryve helps you plan workouts, track your body and see real progress.
            </p>
            <Link
              to="/client/login"
              className="mt-8 inline-block rounded-lg bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600"
            >
              Get started
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700" aria-hidden="true" />
        </section>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-bold">Why fitness matters</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <article key={b.title} className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-brand-700">{b.title}</h3>
              <p className="mt-2 text-charcoal-700">{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-brand-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold">How Thryve helps</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-charcoal-700">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <ul className="flex flex-wrap justify-center gap-3">
          {trainingTypes.map((t) => (
            <li key={t} className="rounded-full bg-charcoal-800 px-5 py-2 font-medium text-white">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-brand-600">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to start?</h2>
          <Link
            to="/client/login"
            className="mt-6 inline-block rounded-lg bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600"
          >
            Create your plan
          </Link>
        </div>
      </section>

      <footer className="bg-charcoal-900 py-8 text-center text-sm text-gray-400">
        © {currentYear} Thryve
      </footer>
    </div>
  )
}
