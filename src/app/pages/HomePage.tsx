import { Link } from 'react-router-dom'

const sections = [
  { to: '/auth/login', label: 'Authentication' },
  { to: '/schools', label: 'Schools' },
  { to: '/finance/fees', label: 'Finance' },
  { to: '/communication/messages', label: 'Communication' },
  { to: '/applications', label: 'Applications' },
  { to: '/social/reviews', label: 'Social' },
  { to: '/monetization/subscriptions', label: 'Monetization' },
  { to: '/utilities/notifications', label: 'Utilities' },
]

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:py-16">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
          School Finder
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Project architecture scaffold
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          This workspace now includes the routed app shell, Tailwind setup, and
          a full feature directory tree. The non-model files are thin
          placeholders so implementation can be filled in feature by feature.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            className="group rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-xl transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-lg font-semibold text-slate-900">
                {section.label}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                Open
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
