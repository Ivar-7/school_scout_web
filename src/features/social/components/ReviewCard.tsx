import { Link } from 'react-router-dom'
import { Star, CheckCircle } from 'lucide-react'
import type { Review } from '../types/social.types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const categories = Object.values(review.ratings)
  const avgRating = categories.reduce((a, b) => a + b, 0) / categories.length

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            to={`/schools/${review.schoolId}`}
            className="text-sm font-semibold text-brand-strong hover:underline"
          >
            {review.schoolName}
          </Link>
          <div className="mt-1 flex items-center gap-1.5">
            <p className="text-sm font-medium text-foreground">{review.parentName}</p>
            {review.isVerified && <CheckCircle className="h-3.5 w-3.5 text-brand" />}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
            />
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{review.comment}</p>
      {review.schoolReply && (
        <div className="mt-3 rounded-lg border border-brand-soft bg-brand-soft p-3">
          <p className="mb-1 text-xs font-semibold text-brand-strong">School response</p>
          <p className="text-sm text-brand-strong">{review.schoolReply}</p>
        </div>
      )}
    </div>
  )
}
