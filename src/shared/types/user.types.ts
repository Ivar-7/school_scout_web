import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'parent' | 'school'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  phone: string
  photoURL: string
  schoolId: string | null
  createdAt: Timestamp
}
