import { useSearchParams, Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useFinanceSchools } from '../hooks/useFinance'
import { FeeCard } from '../components/FeeCard'

export default function FeesPage() {
  const [searchParams] = useSearchParams()
  const ids = (searchParams.get('schools') ?? '').split(',').filter(Boolean)
  const { schools, loading, error } = useFinanceSchools(ids)

  if (ids.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <Wallet className="h-12 w-12 text-muted" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Compare school fees</h1>
        <p className="mt-3 text-sm text-muted">
          Select schools from the directory using the "Compare" checkbox, then come back here to see
          a side-by-side fee breakdown.
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
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Fee comparison</h1>
      <p className="mt-1 text-sm text-muted">Comparing fees across {schools.length} schools.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {schools.map((school) => (
          <FeeCard key={school.id} school={school} />
        ))}
      </div>
    </section>
  )
}
