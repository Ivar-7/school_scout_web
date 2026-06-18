import { useState } from 'react'
import { useSchoolApplications } from '../../applications/hooks/useApplications'
import { STATUS_CONFIG, type ApplicationStatus } from '../../applications/types/applications.types'
import { FileText } from 'lucide-react'

const NEXT_STATUS: Array<{ value: ApplicationStatus; label: string }> = [
  { value: 'under_review', label: 'Mark under review' },
  { value: 'more_info', label: 'Request more info' },
  { value: 'accepted', label: 'Accept' },
  { value: 'rejected', label: 'Reject' },
]

interface ApplicationsTabProps {
  schoolId: string
}

export function ApplicationsTab({ schoolId }: ApplicationsTabProps) {
  const { applications, loading, error, updating, updateStatus } = useSchoolApplications(schoolId)
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({})

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    )
  }

  if (error) return <p className="py-4 text-sm text-red-600">{error}</p>

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <FileText className="h-10 w-10 text-muted" />
        <p className="text-sm text-muted">No applications yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const status = STATUS_CONFIG[application.status]
        return (
          <div key={application.id} className="rounded-xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{application.studentName}</p>
                <p className="text-xs text-muted">
                  Grade {application.gradeApplying} · Applied by {application.parentName} (
                  {application.parentEmail})
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${status.bg} ${status.color}`}
              >
                {status.label}
              </span>
            </div>

            {application.parentMessage && (
              <p className="mt-3 rounded-lg bg-background p-3 text-sm text-foreground">
                "{application.parentMessage}"
              </p>
            )}

            {application.documents.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {application.documents.map((d, i) => (
                  <a
                    key={i}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-3 py-1 text-xs text-brand-strong hover:underline"
                  >
                    {d.name}
                  </a>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Add a note for this applicant…"
                value={notesDraft[application.id] ?? application.schoolNotes}
                onChange={(e) =>
                  setNotesDraft((prev) => ({ ...prev, [application.id]: e.target.value }))
                }
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <select
                disabled={updating}
                value=""
                onChange={(e) => {
                  if (!e.target.value) return
                  updateStatus(
                    application.id,
                    e.target.value as ApplicationStatus,
                    notesDraft[application.id] ?? application.schoolNotes
                  )
                }}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="">Update status…</option>
                {NEXT_STATUS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )
      })}
    </div>
  )
}
