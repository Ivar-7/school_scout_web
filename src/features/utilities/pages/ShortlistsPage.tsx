import { useState } from 'react';
import { useShortlist } from '../hooks/useUtilities';
import {
  Heart,
  MapPin,
  Star,
  CheckCircle,
  Trash2,
  GitCompare,
  Search,
  X,
} from 'lucide-react';
import type { ShortlistedSchool } from '../types/utilities.types';

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-5 bg-gray-200 rounded-full w-14" />
        <div className="h-5 bg-gray-200 rounded-full w-14" />
      </div>
      <div className="h-8 bg-gray-200 rounded" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <Heart className="w-8 h-8 text-red-400" />
    </div>
    <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2">
      No saved schools yet
    </h3>
    <p className="text-gray-500 text-sm max-w-sm mb-6">
      Browse schools and tap the heart icon to save ones you like. They will
      appear here.
    </p>
    `n      <a href="/schools"
      className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
    >
      Browse Schools
    </a>
  </div>
);

const CompareTray = ({
  schools,
  onRemove,
  onCompare,
}: {
  schools: ShortlistedSchool[];
  onRemove: (id: string) => void;
  onCompare: () => void;
}) => {
  if (schools.length === 0) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-x-auto">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Comparing ({schools.length}/4):
          </span>
          <div className="flex gap-2">
            {schools.map((s) => (
              <div
                key={s.schoolId}
                className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 whitespace-nowrap"
              >
                <span className="text-sm text-green-800 font-medium">
                  {s.schoolName}
                </span>
                <button
                  onClick={() => onRemove(s.schoolId)}
                  className="text-green-600 hover:text-green-800"
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
          className="bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2 rounded-lg transition-colors whitespace-nowrap text-sm"
        >
          Compare Now
        </button>
      </div>
    </div>
  );
};

export default function ShortlistsPage() {
  const { shortlist, loading, error, remove, clear } = useShortlist();
  const [compareList, setCompareList] = useState<ShortlistedSchool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = shortlist.filter((s) =>
    s.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.schoolCounty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompareToggle = (school: ShortlistedSchool) => {
    setCompareList((prev) => {
      if (prev.find((s) => s.schoolId === school.schoolId)) {
        return prev.filter((s) => s.schoolId !== school.schoolId);
      }
      if (prev.length >= 4) return prev;
      return [...prev, school];
    });
  };

  const handleCompareNow = () => {
    const ids = compareList.map((s) => s.schoolId).join(',');
    window.location.href = `/parent/compare?schools=${ids}`;
  };

  const handleClear = async () => {
    await clear();
    setShowClearConfirm(false);
    setCompareList([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-heading font-bold text-2xl text-gray-900">
                My Shortlist
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {shortlist.length} saved school{shortlist.length !== 1 ? 's' : ''}
              </p>
            </div>
            {shortlist.length > 0 && (
              <div className="flex items-center gap-3">
                {compareList.length >= 2 && (
                  <button
                    onClick={handleCompareNow}
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <GitCompare className="w-4 h-4" />
                    Compare ({compareList.length})
                  </button>
                )}
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {shortlist.length > 0 && (
            <div className="relative mt-4 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search saved schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && shortlist.length === 0 && <EmptyState />}

        {!loading && shortlist.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">
              No schools match your search.
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((school) => {
              const isCompared = !!compareList.find(
                (s) => s.schoolId === school.schoolId
              );
              const schoolHref = `/schools/${school.schoolId}`;
              return (
                <div
                  key={school.schoolId}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-40">
                    <img
                      src={school.schoolCoverImage || '/placeholder-school.jpg'}
                      alt={school.schoolName}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => remove(school.schoolId)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow text-red-400 hover:text-red-600 transition-colors"
                      aria-label="Remove from shortlist"
                    >
                      <Heart className="w-4 h-4 fill-red-400" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start gap-1.5">
                      <h3 className="font-heading font-semibold text-gray-900 text-sm leading-tight flex-1">
                        {school.schoolName}
                      </h3>
                      {school.schoolIsVerified && (
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{school.schoolCounty}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {school.schoolCurriculum.slice(0, 2).map((c) => (
                        <span
                          key={c}
                          className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium"
                        >
                          {c}
                        </span>
                      ))}
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">
                        {school.schoolType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-gray-800">
                          {school.schoolRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        from KES {school.schoolFees.minTermFee.toLocaleString()}/term
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCompared}
                          onChange={() => handleCompareToggle(school)}
                          className="accent-green-600"
                        />
                        Compare
                      </label>
                      `n                        <a href={schoolHref}
                        className="bg-green-700 hover:bg-green-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Profile
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6">
            <h3 className="font-heading font-semibold text-gray-900 text-lg mb-2">
              Clear shortlist?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              This will remove all {shortlist.length} saved schools. This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <CompareTray
        schools={compareList}
        onRemove={(id) =>
          setCompareList((prev) => prev.filter((s) => s.schoolId !== id))
        }
        onCompare={handleCompareNow}
      />
      {compareList.length > 0 && <div className="h-20" />}
    </div>
  );
}