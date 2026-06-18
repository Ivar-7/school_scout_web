import {
  findOrCreateThread,
  subscribeToThreads,
  subscribeToMessages,
  sendMessage,
  requestVisit,
  subscribeToVisitBookings,
  updateVisitStatus,
} from '../services/communication.service'
import type { VisitRequestInput, VisitStatus } from '../types/communication.types'

export const communicationApi = {
  findOrCreateThread: (
    parentId: string,
    parentName: string,
    schoolId: string,
    schoolName: string,
    schoolLogo: string,
    schoolOwnerId: string
  ) => findOrCreateThread(parentId, parentName, schoolId, schoolName, schoolLogo, schoolOwnerId),

  subscribeToThreads,
  subscribeToMessages,

  sendMessage: (threadId: string, senderId: string, senderName: string, text: string) =>
    sendMessage(threadId, senderId, senderName, text),

  requestVisit: (
    parentId: string,
    parentName: string,
    schoolOwnerId: string,
    input: VisitRequestInput
  ) => requestVisit(parentId, parentName, schoolOwnerId, input),

  subscribeToVisitBookings,

  updateVisitStatus: (bookingId: string, status: VisitStatus) =>
    updateVisitStatus(bookingId, status),
}
