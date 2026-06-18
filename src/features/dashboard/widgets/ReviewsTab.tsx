import { useState } from 'react'
import { Star } from 'lucide-react'
import { useReviews } from '../../schools/hooks/useSchools'

interface ReviewsTabProps {
  schoolId: string
}

function ReplyInput({
  onSubmit,
  submitting,
}: {
  onSubmit: (text: string) => void
  submitting: boolean
}) {
  const [value, setValue] = useState('')
  return (
    <form
      className="mt-2 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!value.trim()) return
        onSubmit(value.trim())
        setValue('')
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Respond to this review…"
        className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
      >
        Reply
      </button>
    </form>
  )
}

export function ReviewsTab({ schoolId }: ReviewsTabProps) {
  const { reviews, loading, submitting, error, reply } = useReviews(schoolId)

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Star className="h-10 w-10 text-muted" />
        <p className="text-sm text-muted">No reviews yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {reviews.map((review) => {
        const categories = Object.values(review.ratings)
        const avg = categories.reduce((a, b) => a + b, 0) / categories.length
        return (
          <div key={review.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{review.parentName}</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i <= Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-foreground">{review.comment}</p>
            {review.schoolReply ? (
              <div className="mt-3 rounded-lg border border-brand-soft bg-brand-soft p-3">
                <p className="mb-1 text-xs font-semibold text-brand-strong">Your response</p>
                <p className="text-sm text-brand-strong">{review.schoolReply}</p>
              </div>
            ) : (
              <ReplyInput submitting={submitting} onSubmit={(text) => reply(review.id, text)} />
            )}
          </div>
        )
      })}
    </div>
  )
}
