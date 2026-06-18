import { Timestamp } from 'firebase/firestore'

export interface ShortlistedSchool {
  schoolId: string
  schoolName: string
  schoolCoverImage: string
  schoolCounty: string
  schoolType: string
  schoolRating: number
  schoolFees: {
    minTermFee: number
    maxTermFee: number
  }
  schoolCurriculum: string[]
  schoolIsVerified: boolean
  savedAt: Timestamp
}

export type NotificationType = 'message' | 'application' | 'deadline' | 'system'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  link: string
  schoolId: string | null
  schoolName: string | null
  createdAt: Timestamp
}
