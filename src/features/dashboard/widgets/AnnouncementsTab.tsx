import { useState } from 'react'
import { Megaphone, Trash2 } from 'lucide-react'
import { useManageAnnouncements } from '../../schools/hooks/useSchools'
import type { Announcement } from '../../schools/types/schools.types'

const CATEGORIES: Announcement['category'][] = ['Open Day', 'Fee Update', 'Achievement', 'General']

interface AnnouncementsTabProps {
  schoolId: string
  schoolName: string
  schoolLogo: string
}

export function AnnouncementsTab({ schoolId, schoolName, schoolLogo }: AnnouncementsTabProps) {
  const { announcements, loading, submitting, error, create, remove } = useManageAnnouncements(
    schoolId,
    schoolName,
    schoolLogo
  )
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Announcement['category']>('General')
  const [content, setContent] = useState('')

  const handleCreate = async (status: 'published' | 'draft') => {
    if (!title.trim() || !content.trim()) return
    const ok = await create({ title: title.trim(), category, content: content.trim(), status })
    if (ok) {
      setTitle('')
      setContent('')
      setCategory('General')
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5">
        <h2 className="text-base font-semibold text-foreground">New announcement</h2>
        <div className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Announcement['category'])}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <textarea
            rows={3}
            placeholder="What do you want parents to know?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleCreate('published')}
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
            >
              Publish
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleCreate('draft')}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:opacity-60"
            >
              Save as draft
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        )}

        {!loading && announcements.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Megaphone className="h-8 w-8 text-muted" />
            <p className="text-sm text-muted">No announcements yet.</p>
          </div>
        )}

        {announcements.map((a) => (
          <div
            key={a.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">
                  {a.category}
                </span>
                {a.status === 'draft' && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                    Draft
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted">{a.content}</p>
            </div>
            <button
              onClick={() => remove(a.id)}
              className="shrink-0 text-muted transition-colors hover:text-red-500"
              aria-label="Delete announcement"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
