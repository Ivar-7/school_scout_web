import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, MessageCircle, FileText, Star, ShieldCheck } from 'lucide-react'
import { useFeaturedSchools } from '../../features/schools/hooks/useSchools'

const VALUE_PROPS = [
  {
    icon: Search,
    title: 'Find the right fit',
    description: 'Filter by county, curriculum, fees, religion, and boarding options.',
  },
  {
    icon: FileText,
    title: 'Apply online',
    description: 'Submit admission forms and documents directly — no paper, no queues.',
  },
  {
    icon: MessageCircle,
    title: 'Talk to schools',
    description: 'Message schools, ask questions, and book visits before you decide.',
  },
  {
    icon: ShieldCheck,
    title: 'Real parent reviews',
    description: 'Read ratings and reviews from other parents before you apply.',
  },
]

function FeaturedSchoolCard({
  school,
}: {
  school: ReturnType<typeof useFeaturedSchools>['schools'][number]
}) {
  return (
    <Link
      to={`/schools/${school.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-36 overflow-hidden bg-background">
        {school.coverImage && (
          <img
            src={school.coverImage}
            alt={school.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <p className="font-semibold text-foreground">{school.name}</p>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5" />
          <span>
            {school.town}, {school.county}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-foreground">
            {school.ratingAverage.toFixed(1)}
          </span>
          <span className="text-xs text-muted">({school.reviewCount})</span>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { schools: featured, loading: featuredLoading } = useFeaturedSchools()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(query.trim() ? `/schools?q=${encodeURIComponent(query.trim())}` : '/schools')
  }

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-brand-soft to-background">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-strong">
            School Finder
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Find, compare, and apply to the right school
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Browse verified school profiles, compare fees and facilities, message schools directly,
            and submit applications online — all in one place.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by school name or town…"
                className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/schools"
              className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              Browse all schools
            </Link>
            <Link
              to="/auth/register"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Create a free account
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft">
                <Icon className="h-5 w-5 text-brand-strong" />
              </div>
              <p className="mt-3 font-semibold text-foreground">{title}</p>
              <p className="mt-1 text-sm text-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {(featuredLoading || featured.length > 0) && (
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Featured schools</h2>
            <Link to="/schools" className="text-sm font-medium text-brand-strong hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-2xl border border-border bg-surface"
                  />
                ))
              : featured.map((school) => <FeaturedSchoolCard key={school.id} school={school} />)}
          </div>
        </section>
      )}

      <section className="border-t border-border bg-brand-soft">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold text-brand-strong sm:text-3xl">
            Run a school? List it for free.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-brand-strong">
            Create a school account to publish your profile, manage applications, and respond to
            parent reviews and questions.
          </p>
          <Link
            to="/auth/register"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
          >
            List your school
          </Link>
        </div>
      </section>
    </div>
  )
}
