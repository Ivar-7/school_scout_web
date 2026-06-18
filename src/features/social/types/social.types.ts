import type { Timestamp } from 'firebase/firestore'

export type { Review, Announcement } from '../../schools/types/schools.types'

export interface Question {
  id: string
  schoolId: string
  schoolName: string
  schoolLogo: string
  askedBy: string
  askedByName: string
  question: string
  answer: string | null
  answeredAt: Timestamp | null
  createdAt: Timestamp
}
