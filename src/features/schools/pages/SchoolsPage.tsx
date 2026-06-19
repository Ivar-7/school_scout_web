import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Grid, List, X, ChevronDown } from 'lucide-react'
import { useSchools } from '../hooks/useSchools'
import { SchoolCard } from '../components/SchoolCard'
import { useAuth } from '../../auth/hooks/useAuth'
import { useShortlist, toShortlistedSchool } from '../../utilities/hooks/useUtilities'
import type { SchoolFilters, School } from '../types/schools.types'

const KENYAN_COUNTIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Kiambu',
  'Machakos',
  'Nyeri',
  'Meru',
  'Kakamega',
  'Kisii',
  'Thika',
  'Malindi',
  'Garissa',
  'Kitale',
  'Bungoma',
  'Kericho',
  'Embu',
  'Lamu',
  'Isiolo',
]

const CURRICULA = ['CBC', 'IGCSE', 'A-Level', 'TVET']
const SCHOOL_TYPES = ['primary', 'secondary', 'ecd', 'university']
const GENDER_OPTIONS = ['mixed', 'boys', 'girls']
const BOARDING_OPTIONS = ['day', 'boarding', 'both']
const RELIGION_OPTIONS = ['secular', 'catholic', 'protestant', 'muslim', 'other']

const DEFAULT_FILTERS: Partial<SchoolFilters> = {
  county: '',
  type: '',
  curriculum: '',
  gender: '',
  boardingOptions: '',
  religion: '',
  minFee: 0,
  maxFee: 200000,
  specialNeedsSupport: false,
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SchoolCardSkeleton = () => (
  <div className="bg-surface rounded-xl border border-border overflow-hidden animate-pulse">
    <div className="h-44 bg-background" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-background rounded w-3/4" />
      <div className="h-3 bg-background rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-5 bg-background rounded-full w-12" />
        <div className="h-5 bg-background rounded-full w-16" />
      </div>
      <div className="h-8 bg-background rounded w-full mt-2" />
    </div>
  </div>
)

// ── Filter Sidebar ────────────────────────────────────────────────────────────
interface FilterSidebarProps {
  filters: Partial<SchoolFilters>
  onChange: (filters: Partial<SchoolFilters>) => void
  onReset: () => void
  onClose?: () => void
}

const FilterSidebar = ({ filters, onChange, onReset, onClose }: FilterSidebarProps) => {
  const update = (key: keyof SchoolFilters, value: SchoolFilters[keyof SchoolFilters]) =>
    onChange({ ...filters, [key]: value })

  return (
    <div className="bg-surface rounded-xl border border-border p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-foreground">Filters</h3>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="text-xs text-brand hover:underline font-medium">
            Reset all
          </button>
          {onClose && (
            <button onClick={onClose} className="text-muted hover:text-foreground lg:hidden">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* County */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">County</label>
        <select
          value={filters.county || ''}
          onChange={(e) => update('county', e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-foreground"
        >
          <option value="">All Counties</option>
          {KENYAN_COUNTIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* School Type */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">School Type</label>
        <div className="space-y-1.5">
          {SCHOOL_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type}
                checked={filters.type === type}
                onChange={() => update('type', type)}
                className="accent-brand"
              />
              <span className="text-sm text-foreground capitalize">{type}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value=""
              checked={!filters.type}
              onChange={() => update('type', '')}
              className="accent-brand"
            />
            <span className="text-sm text-foreground">All Types</span>
          </label>
        </div>
      </div>

      {/* Curriculum */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Curriculum</label>
        <div className="flex flex-wrap gap-2">
          {CURRICULA.map((c) => (
            <button
              key={c}
              onClick={() => update('curriculum', filters.curriculum === c ? '' : c)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                filters.curriculum === c
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface text-muted border-border hover:border-brand hover:text-brand'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              onClick={() => update('gender', filters.gender === g ? '' : g)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium capitalize transition-colors ${
                filters.gender === g
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface text-muted border-border hover:border-brand hover:text-brand'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Boarding */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Boarding</label>
        <div className="flex flex-wrap gap-2">
          {BOARDING_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => update('boardingOptions', filters.boardingOptions === b ? '' : b)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium capitalize transition-colors ${
                filters.boardingOptions === b
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface text-muted border-border hover:border-brand hover:text-brand'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Religion */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Religion</label>
        <select
          value={filters.religion || ''}
          onChange={(e) => update('religion', e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand bg-surface text-foreground"
        >
          <option value="">Any</option>
          {RELIGION_OPTIONS.map((r) => (
            <option key={r} value={r} className="capitalize">
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Fee Range */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Max Term Fee:{' '}
          <span className="text-brand">KES {(filters.maxFee ?? 200000).toLocaleString()}</span>
        </label>
        <input
          type="range"
          min={0}
          max={200000}
          step={5000}
          value={filters.maxFee ?? 200000}
          onChange={(e) => update('maxFee', Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>KES 0</span>
          <span>KES 200,000</span>
        </div>
      </div>

      {/* Special Needs */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.specialNeedsSupport || false}
          onChange={(e) => update('specialNeedsSupport', e.target.checked)}
          className="accent-brand w-4 h-4"
        />
        <span className="text-sm text-foreground">Special needs support</span>
      </label>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-brand-soft rounded-full flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-brand" />
    </div>
    <h3 className="font-heading font-semibold text-foreground text-lg mb-2">No schools found</h3>
    <p className="text-muted text-sm max-w-sm mb-6">
      We couldn't find any schools matching your current filters. Try adjusting your search.
    </p>
    <button
      onClick={onReset}
      className="bg-brand hover:bg-brand-strong text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
    >
      Clear Filters
    </button>
  </div>
)

// ── Compare Tray ──────────────────────────────────────────────────────────────
const CompareTray = ({
  schools,
  onRemove,
  onCompare,
}: {
  schools: School[]
  onRemove: (id: string) => void
  onCompare: () => void
}) => {
  if (schools.length === 0) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-lg z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          <span className="text-sm font-medium text-foreground whitespace-nowrap">
            Comparing ({schools.length}/4):
          </span>
          <div className="flex gap-2">
            {schools.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-1.5 bg-brand-soft border border-brand/30 rounded-lg px-3 py-1.5 whitespace-nowrap"
              >
                <span className="text-sm text-brand-strong font-medium">{s.name}</span>
                <button
                  onClick={() => onRemove(s.id)}
                  className="text-brand hover:text-brand-strong"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onCompare}
          disabled={schools.length < 2}
          className="bg-brand hover:bg-brand-strong disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
        >
          Compare Now
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SchoolsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<Partial<SchoolFilters>>(DEFAULT_FILTERS)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [compareList, setCompareList] = useState<School[]>([])
  const { isAuthenticated } = useAuth()
  const { isShortlisted, add: addShortlist, remove: removeShortlist } = useShortlist()

  const { schools, loading, error, hasMore, loadMore } = useSchools(filters)

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.town.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.ratingAverage - a.ratingAverage
    if (sortBy === 'fee_asc') return a.fees.minTermFee - b.fees.minTermFee
    if (sortBy === 'fee_desc') return b.fees.minTermFee - a.fees.minTermFee
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const handleShortlist = (school: School) => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: '/schools' } } })
      return
    }
    if (isShortlisted(school.id)) {
      removeShortlist(school.id)
    } else {
      addShortlist(toShortlistedSchool(school))
    }
  }

  const handleCompare = (school: School) => {
    setCompareList((prev) => {
      if (prev.find((s) => s.id === school.id)) return prev.filter((s) => s.id !== school.id)
      if (prev.length >= 4) return prev
      return [...prev, school]
    })
  }

  const handleCompareNow = () => {
    const ids = compareList.map((s) => s.id).join(',')
    navigate(`/schools/compare?schools=${ids}`)
  }

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setSearchQuery('')
  }

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === 'minFee' && v === 0) return false
    if (k === 'maxFee' && v === 200000) return false
    if (k === 'specialNeedsSupport' && v === false) return false
    return v !== '' && v !== undefined
  }).length

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-4">
            Find Schools in Kenya
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search by school name or town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border border-border rounded-lg px-4 py-2.5 pr-8 text-sm bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="rating">Top Rated</option>
                <option value="fee_asc">Fees: Low to High</option>
                <option value="fee_desc">Fees: High to Low</option>
                <option value="name">Name A–Z</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm bg-surface text-foreground hover:border-brand hover:text-brand transition-colors lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-brand text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2.5 transition-colors ${viewMode === 'grid' ? 'bg-brand text-white' : 'bg-surface text-muted hover:text-foreground'}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2.5 transition-colors ${viewMode === 'list' ? 'bg-brand text-white' : 'bg-surface text-muted hover:text-foreground'}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} onReset={resetFilters} />
          </aside>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface overflow-y-auto p-4 shadow-xl">
                <FilterSidebar
                  filters={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Results */}
          <main className="flex-1 min-w-0">
            {!loading && sorted.length > 0 && (
              <p className="text-sm text-muted mb-4">
                Showing {sorted.length} school{sorted.length !== 1 ? 's' : ''}
              </p>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm mb-4">
                {error}
              </div>
            )}

            {loading && (
              <div
                className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SchoolCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!loading && sorted.length === 0 && <EmptyState onReset={resetFilters} />}

            {!loading && sorted.length > 0 && (
              <>
                <div
                  className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
                >
                  {sorted.map((school) => (
                    <SchoolCard
                      key={school.id}
                      school={school}
                      variant={viewMode}
                      isShortlisted={isShortlisted(school.id)}
                      onShortlist={handleShortlist}
                      isCompared={!!compareList.find((s) => s.id === school.id)}
                      onCompare={handleCompare}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      className="border border-brand text-brand hover:bg-brand-soft font-medium px-8 py-2.5 rounded-lg transition-colors"
                    >
                      Load More Schools
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <CompareTray
        schools={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((s) => s.id !== id))}
        onCompare={handleCompareNow}
      />
      {compareList.length > 0 && <div className="h-20" />}
    </div>
  )
}
