import { Link } from 'react-router-dom'
import type { School } from '../types/finance.types'

interface FeeCardProps {
  school: School
}

export function FeeCard({ school }: FeeCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <Link
          to={`/schools/${school.id}`}
          className="text-base font-semibold text-foreground hover:underline"
        >
          {school.name}
        </Link>
        <span className="shrink-0 text-xs text-muted">{school.county}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted">Min term fee</dt>
          <dd className="font-semibold text-foreground">
            KES {school.fees.minTermFee.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Max term fee</dt>
          <dd className="font-semibold text-foreground">
            KES {school.fees.maxTermFee.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Admission fee</dt>
          <dd className="font-semibold text-foreground">
            KES {school.fees.admissionFee.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Uniform estimate</dt>
          <dd className="font-semibold text-foreground">
            KES {school.fees.uniformEstimate.toLocaleString()}
          </dd>
        </div>
      </dl>
      {school.fees.paymentMethods.length > 0 && (
        <div className="mt-4">
          <p className="mb-1.5 text-xs text-muted">Payment methods</p>
          <div className="flex flex-wrap gap-1.5">
            {school.fees.paymentMethods.map((m) => (
              <span
                key={m}
                className="rounded-full border border-brand-soft bg-brand-soft px-2.5 py-1 text-xs text-brand-strong"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
