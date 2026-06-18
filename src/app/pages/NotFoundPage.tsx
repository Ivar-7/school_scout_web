import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-strong">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        We couldn't find that page
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">
        The page you're looking for doesn't exist or may have moved. Try heading back home or
        browsing schools instead.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          Back home
        </Link>
        <Link
          to="/schools"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-brand-soft"
        >
          Browse schools
        </Link>
      </div>
    </section>
  )
}
