import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'
import { CalendarCheck, CalendarClock } from 'lucide-react'
import { useAuth } from '../../auth/hooks/useAuth'
import { useSchool } from '../../schools/hooks/useSchools'
import { useVisitBookings, useRequestVisit } from '../hooks/useCommunication'
import { visitRequestSchema, type VisitRequestFormValues } from '../types/communication.schema'
import type { VisitStatus } from '../types/communication.types'

const STATUS_STYLES: Record<VisitStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
}

function RequestVisitForm({ schoolId }: { schoolId: string }) {
  const { school, loading } = useSchool(schoolId)
  const { submitRequest, submitting, error } = useRequestVisit()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VisitRequestFormValues>({
    resolver: zodResolver(visitRequestSchema),
    defaultValues: { mode: 'in_person', requestedDate: '', notes: '' },
  })

  if (loading || !school) return null

  const onSubmit = async (values: VisitRequestFormValues) => {
    const ok = await submitRequest(school.ownerId ?? '', {
      schoolId: school.id,
      schoolName: school.name,
      schoolLogo: school.logoImage,
      mode: values.mode,
      requestedDate: values.requestedDate,
      notes: values.notes ?? '',
    })
    if (ok) reset({ mode: 'in_person', requestedDate: '', notes: '' })
  }

  return (
    <div className="mb-6 rounded-xl border border-border bg-surface p-5">
      <h2 className="text-base font-semibold text-foreground">Request a visit to {school.name}</h2>
      <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Visit type</label>
            <select
              {...register('mode')}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="in_person">In person</option>
              <option value="virtual">Virtual</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Preferred date
            </label>
            <input
              type="date"
              {...register('requestedDate')}
              className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand ${
                errors.requestedDate ? 'border-red-400' : 'border-border'
              }`}
            />
            {errors.requestedDate && (
              <p className="mt-1 text-xs text-red-500">{errors.requestedDate.message}</p>
            )}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Notes (optional)
          </label>
          <textarea
            rows={3}
            {...register('notes')}
            placeholder="Anything the school should know ahead of your visit…"
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
        >
          {submitting ? 'Submitting…' : 'Submit request'}
        </button>
      </form>
    </div>
  )
}

export default function VisitsPage() {
  const [searchParams] = useSearchParams()
  const schoolId = searchParams.get('schoolId')
  const { profile } = useAuth()
  const { bookings, loading, error, updating, updateStatus, isSchoolView } = useVisitBookings()

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Visit bookings</h1>
      <p className="mt-1 text-sm text-muted">
        {isSchoolView
          ? 'Incoming visit requests from parents.'
          : 'Track your school visit requests and confirmations.'}
      </p>

      {!isSchoolView && schoolId && (
        <div className="mt-6">
          <RequestVisitForm schoolId={schoolId} />
        </div>
      )}

      <div className="mt-6">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        )}

        {error && <p className="py-4 text-sm text-red-600">{error}</p>}

        {!loading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <CalendarClock className="h-10 w-10 text-muted" />
            <p className="text-sm text-muted">No visit requests yet.</p>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <ul className="space-y-3">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <CalendarCheck className="mt-0.5 h-5 w-5 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {isSchoolView ? booking.parentName : booking.schoolName}
                    </p>
                    <p className="text-xs text-muted">
                      {booking.mode === 'in_person' ? 'In person' : 'Virtual'} ·{' '}
                      {booking.requestedDate}
                    </p>
                    {booking.notes && <p className="mt-1 text-xs text-muted">{booking.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[booking.status]}`}
                  >
                    {booking.status}
                  </span>

                  {isSchoolView && booking.status === 'pending' && (
                    <>
                      <button
                        disabled={updating}
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => updateStatus(booking.id, 'declined')}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-background disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {!isSchoolView && booking.status === 'pending' && (
                    <button
                      disabled={updating}
                      onClick={() => updateStatus(booking.id, 'cancelled')}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-background disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {profile?.role === 'parent' && !schoolId && bookings.length === 0 && !loading && (
        <p className="mt-4 text-center text-sm text-muted">
          Visit a school's profile and use "Request a Visit" to get started.
        </p>
      )}
    </section>
  )
}
