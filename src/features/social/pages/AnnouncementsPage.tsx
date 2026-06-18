import { Link } from 'react-router-dom'
import { Megaphone } from 'lucide-react'
import { useRecentAnnouncements } from '../hooks/useSocial'

const CATEGORY_STYLES: Record<string, string> = {
  'Open Day': 'bg-brand-soft text-brand-strong',
  'Fee Update': 'bg-amber-50 text-amber-700',
  Achievement: 'bg-green-50 text-green-700',
  General: 'bg-background text-muted',
}

export default function AnnouncementsPage() {
  const { announcements, loading, error } = useRecentAnnouncements()

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Announcements</h1>
      <p className="mt-1 text-sm text-muted">Latest updates from schools on School Finder.</p>

      <div className="mt-6">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        )}

        {error && <p className="py-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Megaphone className="h-10 w-10 text-muted" />
            <p className="text-sm text-muted">No announcements yet.</p>
          </div>
        )}

        {!loading && announcements.length > 0 && (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      to={`/schools/${announcement.schoolId}`}
                      className="text-sm font-semibold text-brand-strong hover:underline"
                    >
                      {announcement.schoolName}
                    </Link>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {announcement.title}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      CATEGORY_STYLES[announcement.category] ?? CATEGORY_STYLES.General
                    }`}
                  >
                    {announcement.category}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{announcement.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
