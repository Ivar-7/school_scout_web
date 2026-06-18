import { Timestamp } from 'firebase/firestore'

export interface SchoolFees {
  minTermFee: number
  maxTermFee: number
  admissionFee: number
  uniformEstimate: number
  paymentMethods: string[]
}

export interface SchoolTransport {
  available: boolean
  routes: string
  monthlyCost: number
}

export interface SchoolSocialMedia {
  facebook: string
  instagram: string
  twitter: string
}

export interface SchoolRatings {
  academics: number
  safety: number
  facilities: number
  teachers: number
  valueMoney: number
  communication: number
}

export interface School {
  id: string
  ownerId: string | null
  name: string
  slug: string
  description: string
  county: string
  town: string
  address: string
  latitude: number
  longitude: number
  type: 'primary' | 'secondary' | 'ecd' | 'university'
  curriculum: string[]
  gender: 'mixed' | 'boys' | 'girls'
  religion: 'secular' | 'catholic' | 'protestant' | 'muslim' | 'other'
  boardingOptions: 'day' | 'boarding' | 'both'
  isVerified: boolean
  isFeatured: boolean
  subscriptionTier: 'free' | 'premium' | 'featured'
  coverImage: string
  logoImage: string
  gallery: string[]
  ratingAverage: number
  reviewCount: number
  foundedYear: number
  headTeacher: string
  motto: string
  registrationNumber: string
  teacherStudentRatio: string
  totalStudents: number
  specialNeedsSupport: boolean
  facilities: string[]
  website: string
  phone: string
  email: string
  whatsapp: string
  socialMedia: SchoolSocialMedia
  fees: SchoolFees
  transport: SchoolTransport
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Review {
  id: string
  schoolId: string
  schoolName: string
  schoolLogo: string
  parentId: string
  parentName: string
  parentAvatar: string
  ratings: SchoolRatings
  comment: string
  isVerified: boolean
  schoolReply: string
  createdAt: Timestamp
}

export interface Announcement {
  id: string
  schoolId: string
  schoolName: string
  schoolLogo: string
  title: string
  category: 'Open Day' | 'Fee Update' | 'Achievement' | 'General'
  content: string
  status: 'published' | 'draft'
  createdAt: Timestamp
}

export interface AcademicRecord {
  year: string
  kcpeMeanScore: number
  kcseMeanScore: number
  subjectStrengths: string[]
}

// Editable fields for a school owner creating/updating their own listing
export type SchoolDraft = Omit<
  School,
  | 'id'
  | 'ownerId'
  | 'createdAt'
  | 'updatedAt'
  | 'ratingAverage'
  | 'reviewCount'
  | 'isFeatured'
  | 'isVerified'
  | 'subscriptionTier'
>

// Filter shape used on SchoolsPage
export interface SchoolFilters {
  county: string
  type: string
  curriculum: string
  gender: string
  boardingOptions: string
  religion: string
  minFee: number
  maxFee: number
  specialNeedsSupport: boolean
  isVerified: boolean
}
