import { Heart, MapPin, Star, CheckCircle } from 'lucide-react'
import type { School } from '../types/schools.types'

interface SchoolCardProps {
  school: School
  onShortlist?: (school: School) => void
  isShortlisted?: boolean
  onCompare?: (school: School) => void
  isCompared?: boolean
  variant?: 'grid' | 'list'
}

export const SchoolCard = ({
  school,
  onShortlist,
  isShortlisted = false,
  onCompare,
  isCompared = false,
  variant = 'grid',
}: SchoolCardProps) => {
  const formatFee = (amount: number) => `KES ${amount.toLocaleString()}`

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex overflow-hidden">
        {/* Image */}
        <div className="w-48 h-36 shrink-0 relative">
          <img
            src={school.coverImage || '/placeholder-school.jpg'}
            alt={school.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
          {school.isFeatured && (
            <span className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-semibold text-gray-900 text-base leading-tight">
                  {school.name}
                </h3>
                {school.isVerified && <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />}
              </div>
              <button
                onClick={() => onShortlist?.(school)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                aria-label="Shortlist school"
              >
                <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {school.town}, {school.county}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {school.curriculum.map((c) => (
                <span
                  key={c}
                  className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {c}
                </span>
              ))}
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">
                {school.boardingOptions}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-gray-800">
                  {school.ratingAverage.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">({school.reviewCount})</span>
              </div>
              <span className="text-sm text-gray-600">
                {formatFee(school.fees.minTermFee)} – {formatFee(school.fees.maxTermFee)}/term
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={() => onCompare?.(school)}
                  className="accent-green-600"
                />
                Compare
              </label>

              <a
                href={`/schools/${school.id}`}
                className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                View
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid variant
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44">
        <img
          src={school.coverImage || '/placeholder-school.jpg'}
          alt={school.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {school.isFeatured && (
          <span className="absolute top-2 left-2 bg-amber-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Featured
          </span>
        )}
        <button
          onClick={() => onShortlist?.(school)}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Shortlist school"
        >
          <Heart className={`w-4 h-4 ${isShortlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-1.5">
          <h3 className="font-heading font-semibold text-gray-900 text-base leading-tight flex-1">
            {school.name}
          </h3>
          {school.isVerified && <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />}
        </div>

        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>
            {school.town}, {school.county}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {school.curriculum.slice(0, 2).map((c) => (
            <span
              key={c}
              className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {c}
            </span>
          ))}
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">
            {school.type}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-800">
              {school.ratingAverage.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">({school.reviewCount})</span>
          </div>
          <span className="text-xs text-gray-500">
            from {formatFee(school.fees.minTermFee)}/term
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => onCompare?.(school)}
              className="accent-green-600"
            />
            Compare
          </label>

          <a
            href={`/schools/${school.id}`}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            View Profile
          </a>
        </div>
      </div>
    </div>
  )
}
