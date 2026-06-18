import type { Timestamp } from 'firebase/firestore'

export interface Thread {
  id: string
  schoolId: string
  schoolName: string
  schoolLogo: string
  parentId: string
  parentName: string
  schoolOwnerId: string
  participantIds: string[]
  lastMessage: string
  lastMessageAt: Timestamp | null
  createdAt: Timestamp
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  text: string
  createdAt: Timestamp | null
}

export type VisitMode = 'in_person' | 'virtual'
export type VisitStatus = 'pending' | 'confirmed' | 'declined' | 'cancelled'

export interface VisitBooking {
  id: string
  schoolId: string
  schoolName: string
  schoolLogo: string
  parentId: string
  parentName: string
  schoolOwnerId: string
  mode: VisitMode
  requestedDate: string
  notes: string
  status: VisitStatus
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface VisitRequestInput {
  schoolId: string
  schoolName: string
  schoolLogo: string
  mode: VisitMode
  requestedDate: string
  notes: string
}
