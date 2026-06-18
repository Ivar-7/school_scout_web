import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore'
import type {
  Thread,
  Message,
  VisitBooking,
  VisitRequestInput,
  VisitStatus,
} from '../types/communication.types'

const THREADS_COLLECTION = 'threads'
const VISITS_COLLECTION = 'visitBookings'

export const findOrCreateThread = async (
  parentId: string,
  parentName: string,
  schoolId: string,
  schoolName: string,
  schoolLogo: string,
  schoolOwnerId: string
): Promise<string> => {
  const q = query(
    collection(firebaseFirestore, THREADS_COLLECTION),
    where('parentId', '==', parentId),
    where('schoolId', '==', schoolId),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (!snapshot.empty) return snapshot.docs[0].id

  const docRef = await addDoc(collection(firebaseFirestore, THREADS_COLLECTION), {
    schoolId,
    schoolName,
    schoolLogo,
    parentId,
    parentName,
    schoolOwnerId,
    participantIds: [parentId, schoolOwnerId],
    lastMessage: '',
    lastMessageAt: null,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export const subscribeToThreads = (
  userId: string,
  onData: (threads: Thread[]) => void,
  onError: () => void
): Unsubscribe => {
  const q = query(
    collection(firebaseFirestore, THREADS_COLLECTION),
    where('participantIds', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  )
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Thread[]),
    onError
  )
}

export const subscribeToMessages = (
  threadId: string,
  onData: (messages: Message[]) => void
): Unsubscribe => {
  const q = query(
    collection(firebaseFirestore, THREADS_COLLECTION, threadId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  return onSnapshot(q, (snapshot) =>
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[])
  )
}

export const sendMessage = async (
  threadId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<void> => {
  await addDoc(collection(firebaseFirestore, THREADS_COLLECTION, threadId, 'messages'), {
    senderId,
    senderName,
    text,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(firebaseFirestore, THREADS_COLLECTION, threadId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
  })
}

export const requestVisit = async (
  parentId: string,
  parentName: string,
  schoolOwnerId: string,
  input: VisitRequestInput
): Promise<string> => {
  const docRef = await addDoc(collection(firebaseFirestore, VISITS_COLLECTION), {
    ...input,
    parentId,
    parentName,
    schoolOwnerId,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export const subscribeToVisitBookings = (
  filter: { parentId: string } | { schoolOwnerId: string },
  onData: (bookings: VisitBooking[]) => void,
  onError: () => void
): Unsubscribe => {
  const field = 'parentId' in filter ? 'parentId' : 'schoolOwnerId'
  const value = 'parentId' in filter ? filter.parentId : filter.schoolOwnerId
  const q = query(
    collection(firebaseFirestore, VISITS_COLLECTION),
    where(field, '==', value),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(
    q,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as VisitBooking[]),
    onError
  )
}

export const updateVisitStatus = async (bookingId: string, status: VisitStatus): Promise<void> => {
  await updateDoc(doc(firebaseFirestore, VISITS_COLLECTION, bookingId), {
    status,
    updatedAt: serverTimestamp(),
  })
}
