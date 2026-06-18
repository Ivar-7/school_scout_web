import { Star } from 'lucide-react'
import { useRecentReviews } from '../hooks/useSocial'
import { ReviewCard } from '../components/ReviewCard'

export default function ReviewsPage() {
  const { reviews, loading, error } = useRecentReviews()

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Recent reviews</h1>
      <p className="mt-1 text-sm text-muted">
        What parents are saying across schools on School Finder. Visit a school's profile to write
        your own review.
      </p>

      <div className="mt-6">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
          </div>
        )}

        {error && <p className="py-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Star className="h-10 w-10 text-muted" />
            <p className="text-sm text-muted">No reviews have been written yet.</p>
          </div>
        )}

        {!loading && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
