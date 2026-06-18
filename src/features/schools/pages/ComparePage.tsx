import { useSearchParams, Link } from 'react-router-dom'
import { Scale, CheckCircle, X } from 'lucide-react'
import { useCompareSchools } from '../hooks/useSchools'

const ROWS: Array<{
  label: string
  render: (s: ReturnType<typeof useCompareSchools>['schools'][number]) => React.ReactNode
}> = [
  { label: 'Rating', render: (s) => `${s.ratingAverage.toFixed(1)} (${s.reviewCount} reviews)` },
  { label: 'Type', render: (s) => s.type },
  { label: 'Gender', render: (s) => s.gender },
  { label: 'Boarding', render: (s) => s.boardingOptions },
  { label: 'Religion', render: (s) => s.religion },
  { label: 'Curriculum', render: (s) => s.curriculum.join(', ') || '—' },
  { label: 'Min term fee', render: (s) => `KES ${s.fees.minTermFee.toLocaleString()}` },
  { label: 'Max term fee', render: (s) => `KES ${s.fees.maxTermFee.toLocaleString()}` },
  { label: 'Admission fee', render: (s) => `KES ${s.fees.admissionFee.toLocaleString()}` },
  { label: 'Total students', render: (s) => s.totalStudents?.toLocaleString() ?? '—' },
  { label: 'Teacher:student ratio', render: (s) => s.teacherStudentRatio || '—' },
  { label: 'Facilities', render: (s) => `${s.facilities.length} listed` },
  {
    label: 'Special needs support',
    render: (s) =>
      s.specialNeedsSupport ? (
        <CheckCircle className="h-4 w-4 text-brand" />
      ) : (
        <X className="h-4 w-4 text-muted" />
      ),
  },
  {
    label: 'Transport',
    render: (s) =>
      s.transport.available ? `KES ${s.transport.monthlyCost.toLocaleString()}/mo` : 'Not offered',
  },
]

export default function ComparePage() {
  const [searchParams] = useSearchParams()
  const ids = (searchParams.get('schools') ?? '').split(',').filter(Boolean)
  const { schools, loading, error } = useCompareSchools(ids)

  if (ids.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <Scale className="h-12 w-12 text-muted" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Nothing to compare yet</h1>
        <p className="mt-3 text-sm text-muted">
          Select up to 4 schools from the directory using the "Compare" checkbox, then come back
          here.
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
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Compare schools</h1>
      <p className="mt-1 text-sm text-muted">
        Side-by-side comparison of {schools.length} schools.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="w-48 px-4 py-3 font-medium text-muted">School</th>
              {schools.map((s) => (
                <th key={s.id} className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-foreground">{s.name}</span>
                    <Link
                      to={`/schools/${s.id}`}
                      className="text-xs font-medium text-brand-strong hover:underline"
                    >
                      View profile
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <th className="px-4 py-3 font-medium text-muted">{row.label}</th>
                {schools.map((s) => (
                  <td key={s.id} className="px-4 py-3 text-foreground capitalize">
                    {row.render(s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
