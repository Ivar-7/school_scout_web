import { useSearchParams, Link } from 'react-router-dom'
import { Bus } from 'lucide-react'
import { useFinanceSchools } from '../hooks/useFinance'

export default function TransportRoutesPage() {
  const [searchParams] = useSearchParams()
  const ids = (searchParams.get('schools') ?? '').split(',').filter(Boolean)
  const { schools, loading, error } = useFinanceSchools(ids)

  if (ids.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <Bus className="h-12 w-12 text-muted" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Compare transport options</h1>
        <p className="mt-3 text-sm text-muted">
          Select schools from the directory using the "Compare" checkbox, then come back here to see
          transport availability and pricing.
        </p>
        <Link
          to="/schools"
          className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
        >
          Browse schools
        </Link>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-6 py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm text-red-600">{error}</p>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Transport options</h1>
      <p className="mt-1 text-sm text-muted">
        Comparing transport across {schools.length} schools.
      </p>
      <div className="mt-6 space-y-3">
        {schools.map((school) => (
          <div key={school.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/schools/${school.id}`}
                className="text-base font-semibold text-foreground hover:underline"
              >
                {school.name}
              </Link>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  school.transport.available
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {school.transport.available ? 'Available' : 'Not offered'}
              </span>
            </div>
            {school.transport.available && (
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted">Monthly cost</p>
                  <p className="font-semibold text-foreground">
                    KES {school.transport.monthlyCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted">Routes</p>
                  <p className="font-medium text-foreground">{school.transport.routes}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
