import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Heart,
  CheckCircle,
  X,
  Star,
  ChevronRight,
  BookOpen,
  Building2,
  Users,
  Calendar,
  Bus,
  Wifi,
  Shield,
  ArrowLeft,
} from 'lucide-react'
import {
  useSchool,
  useReviews,
  useAnnouncements,
  useAcademics,
  useNearbySchools,
} from '../hooks/useSchools'
import { useAuth } from '../../auth/hooks/useAuth'
import { useShortlist, toShortlistedSchool } from '../../utilities/hooks/useUtilities'
import type { Review } from '../types/schools.types'

const TABS = ['Overview', 'Academics', 'Facilities', 'Fees', 'Reviews', 'Gallery'] as const
type Tab = (typeof TABS)[number]

const HeaderSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 w-full" />
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
)

const Stars = ({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${sizes[size]} ${
            i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

const FACILITY_ICONS: Record<string, React.ElementType> = {
  'Science Laboratory': BookOpen,
  'Computer Lab': Wifi,
  Library: BookOpen,
  'Sports Field': Users,
  'Swimming Pool': Shield,
  'School Bus': Bus,
  Dormitory: Building2,
  default: CheckCircle,
}

const ReviewCard = ({ review }: { review: Review }) => {
  const avgRating =
    Object.values(review.ratings).reduce((a, b) => a + b, 0) / Object.values(review.ratings).length

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
            {review.parentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-gray-900">{review.parentName}</p>
              {review.isVerified && <CheckCircle className="w-3.5 h-3.5 text-green-600" />}
            </div>
            <p className="text-xs text-gray-400">
              {review.createdAt?.toDate?.().toLocaleDateString('en-KE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <Stars value={Math.round(avgRating)} />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {Object.entries(review.ratings).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-xs text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </span>
            <Stars value={val} size="sm" />
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
      {review.schoolReply && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-800 mb-1">School Response</p>
          <p className="text-sm text-green-700">{review.schoolReply}</p>
        </div>
      )}
    </div>
  )
}

const ReviewModal = ({
  onClose,
  onSubmit,
  submitting,
  reviewerId,
  reviewerName,
}: {
  onClose: () => void
  onSubmit: (
    data: Omit<Review, 'id' | 'createdAt' | 'schoolId' | 'schoolName' | 'schoolLogo'>
  ) => void
  submitting: boolean
  reviewerId: string
  reviewerName: string
}) => {
  const [comment, setComment] = useState('')
  const [ratings, setRatings] = useState({
    academics: 3,
    safety: 3,
    facilities: 3,
    teachers: 3,
    valueMoney: 3,
    communication: 3,
  })

  const handleSubmit = () => {
    if (!comment.trim()) return
    onSubmit({
      parentId: reviewerId,
      parentName: reviewerName,
      parentAvatar: '',
      ratings,
      comment,
      isVerified: false,
      schoolReply: '',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-gray-900">Write a Review</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            {Object.entries(ratings).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize w-32">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings((prev) => ({ ...prev, [key]: star }))}
                      aria-label={`Rate ${key} ${star} stars`}
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= val
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-200 hover:text-amber-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Review</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience at this school..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !comment.trim()}
            className="px-5 py-2 text-sm bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SchoolDetailsPage() {
  const { schoolId } = useParams<{ schoolId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, user, profile } = useAuth()
  const { isShortlisted, add: addShortlist, remove: removeShortlist } = useShortlist()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  const { school, loading, error } = useSchool(schoolId!)
  const { reviews, submitting, addReview } = useReviews(schoolId!)
  const { announcements } = useAnnouncements(schoolId!)
  const { academics } = useAcademics(schoolId!)
  const { schools: nearbySchools } = useNearbySchools(school?.county ?? '', schoolId!)

  if (loading) return <HeaderSkeleton />

  if (error || !school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || 'School not found.'}</p>
          <button
            onClick={() => navigate('/schools')}
            className="text-green-700 hover:underline font-medium"
          >
            Back to Schools
          </button>
        </div>
      </div>
    )
  }

  const s = school

  const handleReviewSubmit = async (
    data: Omit<Review, 'id' | 'createdAt' | 'schoolId' | 'schoolName' | 'schoolLogo'>
  ) => {
    await addReview({ ...data, schoolId: s.id, schoolName: s.name, schoolLogo: s.logoImage })
    setShowReviewModal(false)
  }

  const telHref = `tel:${s.phone}`
  const mailHref = `mailto:${s.email}`
  const waHref = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`
  const mapsHref = `https://www.google.com/maps?q=${s.latitude},${s.longitude}`
  const enquiryHref = `/communication/messages?schoolId=${s.id}`
  const visitHref = `/communication/visits?schoolId=${s.id}`
  const questionHref = `/social/qa?schoolId=${s.id}`
  const applyHref = `/applications/admission-forms?schoolId=${s.id}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
        <img
          src={s.coverImage || '/placeholder-school.jpg'}
          alt={s.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-700 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium transition-colors shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        {s.isFeatured && (
          <span className="absolute top-4 right-4 bg-amber-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* School Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl border-2 border-white shadow-md overflow-hidden bg-gray-100 shrink-0 -mt-12 md:-mt-16 relative z-10">
              {s.logoImage ? (
                <img
                  src={s.logoImage}
                  alt={`${s.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-2xl">
                  {s.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-heading font-bold text-2xl text-gray-900">{s.name}</h1>
                    {s.isVerified && (
                      <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {s.address}, {s.town}, {s.county}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/auth/login', {
                          state: { from: { pathname: `/schools/${s.id}` } },
                        })
                        return
                      }
                      if (isShortlisted(s.id)) removeShortlist(s.id)
                      else addShortlist(toShortlistedSchool(s))
                    }}
                    className={`p-2.5 rounded-lg border transition-colors ${
                      isShortlisted(s.id)
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                    }`}
                    aria-label="Shortlist"
                  >
                    <Heart className={`w-5 h-5 ${isShortlisted(s.id) ? 'fill-red-500' : ''}`} />
                  </button>

                  <Link
                    to={applyHref}
                    className="bg-green-700 hover:bg-green-800 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Stars value={Math.round(s.ratingAverage)} />
                  <span className="font-semibold text-gray-800">{s.ratingAverage.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({s.reviewCount} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.curriculum.map((c) => (
                    <span
                      key={c}
                      className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium border border-green-100"
                    >
                      {c}
                    </span>
                  ))}
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full capitalize">
                    {s.type}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full capitalize">
                    {s.boardingOptions}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full capitalize">
                    {s.gender}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mt-6 border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0 space-y-6">
            {activeTab === 'Overview' && (
              <>
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="font-heading font-semibold text-gray-900 mb-3">About {s.name}</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {s.description || 'No description available.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Calendar, label: 'Founded', value: s.foundedYear || '—' },
                    { icon: Users, label: 'Head Teacher', value: s.headTeacher || '—' },
                    {
                      icon: Users,
                      label: 'Students',
                      value: s.totalStudents?.toLocaleString() || '—',
                    },
                    { icon: Users, label: 'Teacher Ratio', value: s.teacherStudentRatio || '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-white rounded-xl border border-gray-100 p-4 text-center"
                    >
                      <Icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold text-gray-900 text-sm mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {announcements.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="font-heading font-semibold text-gray-900 mb-4">
                      Latest Announcements
                    </h2>
                    <div className="space-y-3">
                      {announcements.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                        >
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                            {a.category}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{a.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {a.content.slice(0, 100)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'Academics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="font-heading font-semibold text-gray-900 mb-4">
                    Academic Performance
                  </h2>
                  {academics.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 text-gray-500 font-medium">Year</th>
                            <th className="text-left py-2 text-gray-500 font-medium">KCPE Mean</th>
                            <th className="text-left py-2 text-gray-500 font-medium">KCSE Mean</th>
                            <th className="text-left py-2 text-gray-500 font-medium">
                              Subject Strengths
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {academics.map((a) => (
                            <tr key={a.year} className="border-b border-gray-50">
                              <td className="py-3 font-semibold text-gray-900">{a.year}</td>
                              <td className="py-3 text-gray-700">{a.kcpeMeanScore || '—'}</td>
                              <td className="py-3 text-gray-700">{a.kcseMeanScore || '—'}</td>
                              <td className="py-3">
                                <div className="flex flex-wrap gap-1">
                                  {a.subjectStrengths.map((sub) => (
                                    <span
                                      key={sub}
                                      className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                                    >
                                      {sub}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No academic records available yet.</p>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="font-heading font-semibold text-gray-900 mb-4">
                    Staff Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Teacher:Student Ratio</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {s.teacherStudentRatio || '—'}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1">Total Students</p>
                      <p className="font-bold text-gray-900 text-lg">
                        {s.totalStudents?.toLocaleString() || '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Facilities' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-heading font-semibold text-gray-900 mb-5">Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Science Laboratory',
                    'Computer Lab',
                    'Library',
                    'Sports Field',
                    'Swimming Pool',
                    'Chapel/Church',
                    'Mosque',
                    'Medical Room',
                    'Tuck Shop',
                    'School Bus',
                    'Dormitory',
                    'Dining Hall',
                    'Music Room',
                    'Art Room',
                    'Drama Hall',
                    'Special Needs Support',
                  ].map((facility) => {
                    const available = s.facilities.includes(facility)
                    const Icon = FACILITY_ICONS[facility] || FACILITY_ICONS['default']
                    return (
                      <div
                        key={facility}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          available
                            ? 'bg-green-50 border-green-100'
                            : 'bg-gray-50 border-gray-100 opacity-50'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            available ? 'text-green-600' : 'text-gray-400'
                          }`}
                        />
                        <span
                          className={`text-sm ${available ? 'text-gray-800' : 'text-gray-400'}`}
                        >
                          {facility}
                        </span>
                        {available ? (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-auto shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 ml-auto shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'Fees' && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="font-heading font-semibold text-gray-900 mb-5">Fee Structure</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      {
                        label: 'Min Term Fee',
                        value: `KES ${s.fees.minTermFee.toLocaleString()}`,
                      },
                      {
                        label: 'Max Term Fee',
                        value: `KES ${s.fees.maxTermFee.toLocaleString()}`,
                      },
                      {
                        label: 'Admission Fee',
                        value: `KES ${s.fees.admissionFee.toLocaleString()}`,
                      },
                      {
                        label: 'Uniform Estimate',
                        value: `KES ${s.fees.uniformEstimate.toLocaleString()}`,
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">{label}</p>
                        <p className="font-bold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Payment Methods Accepted
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {s.fees.paymentMethods.map((m) => (
                        <span
                          key={m}
                          className="bg-green-50 text-green-700 border border-green-100 text-sm px-3 py-1 rounded-full"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {s.transport.available && (
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Bus className="w-5 h-5 text-green-600" />
                      Transport
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Monthly Cost</p>
                        <p className="font-bold text-gray-900">
                          KES {s.transport.monthlyCost.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs text-gray-500 mb-1">Routes</p>
                        <p className="text-sm text-gray-700">{s.transport.routes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="font-heading font-semibold text-gray-900">Reviews</h2>
                      <p className="text-sm text-gray-500 mt-0.5">{s.reviewCount} reviews</p>
                    </div>
                    <button
                      onClick={() =>
                        isAuthenticated
                          ? setShowReviewModal(true)
                          : navigate('/auth/login', {
                              state: { from: { pathname: `/schools/${s.id}` } },
                            })
                      }
                      className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Write a Review
                    </button>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-heading font-bold text-5xl text-gray-900">
                        {s.ratingAverage.toFixed(1)}
                      </p>
                      <Stars value={Math.round(s.ratingAverage)} size="md" />
                      <p className="text-xs text-gray-400 mt-1">out of 5</p>
                    </div>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      No reviews yet. Be the first to review this school.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Gallery' && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-heading font-semibold text-gray-900 mb-5">Photo Gallery</h2>
                {s.gallery.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-10">
                    No photos available yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {s.gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setLightboxImg(img)}
                        className="relative h-40 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={img}
                          alt={`Gallery ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-heading font-semibold text-gray-900">Contact School</h3>
              {s.phone && (
                <a
                  href={telHref}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-700 transition-colors"
                >
                  <Phone className="w-4 h-4 text-green-600" />
                  {s.phone}
                </a>
              )}
              {s.email && (
                <a
                  href={mailHref}
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-700 transition-colors"
                >
                  <Mail className="w-4 h-4 text-green-600" />
                  {s.email}
                </a>
              )}
              {s.website && (
                <a
                  href={s.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-700 transition-colors"
                >
                  <Globe className="w-4 h-4 text-green-600" />
                  Visit Website
                </a>
              )}
              {Number.isFinite(s.latitude) && Number.isFinite(s.longitude) && (
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-700 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-green-600" />
                  Open in Google Maps
                </a>
              )}
              {s.whatsapp && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium w-full py-2.5 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp School
                </a>
              )}

              <Link
                to={enquiryHref}
                className="flex items-center justify-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 text-sm font-medium w-full py-2.5 rounded-lg transition-colors"
              >
                Send Enquiry
              </Link>
              <Link
                to={visitHref}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium w-full py-2.5 rounded-lg transition-colors"
              >
                Request a Visit
              </Link>
              <Link
                to={questionHref}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium w-full py-2.5 rounded-lg transition-colors"
              >
                Ask a Question
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
              <h3 className="font-heading font-semibold text-gray-900">Quick Info</h3>
              {[
                { label: 'Founded', value: String(s.foundedYear || '—') },
                { label: 'Religion', value: s.religion },
                { label: 'Reg. Number', value: s.registrationNumber },
                {
                  label: 'Special Needs',
                  value: s.specialNeedsSupport ? 'Supported' : 'Not available',
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-900 font-medium capitalize">{value || '—'}</span>
                </div>
              ))}
            </div>

            {nearbySchools.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-heading font-semibold text-gray-900 mb-4">Nearby Schools</h3>
                <div className="space-y-3">
                  {nearbySchools.map((ns) => {
                    const nsHref = `/schools/${ns.id}`
                    return (
                      <Link
                        key={ns.id}
                        to={nsHref}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {ns.coverImage ? (
                            <img
                              src={ns.coverImage}
                              alt={ns.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-sm">
                              {ns.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{ns.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-500">
                              {ns.ratingAverage.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightboxImg(null)}
          >
            <X className="w-7 h-7" />
          </button>
          <img
            src={lightboxImg ?? ''}
            alt="Gallery"
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && user && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
          submitting={submitting}
          reviewerId={user.uid}
          reviewerName={profile?.displayName ?? user.email ?? 'Parent'}
        />
      )}
    </div>
  )
}
