import {
  collection,
  collectionGroup,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore'
import type { Question, Review, Announcement } from '../types/social.types'

const SCHOOLS_COLLECTION = 'schools'
const FEED_LIMIT = 20

export const fetchQuestions = async (schoolId: string): Promise<Question[]> => {
  const q = query(
    collection(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'questions'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Question[]
}

export const askQuestion = async (
  schoolId: string,
  schoolName: string,
  schoolLogo: string,
  askedBy: string,
  askedByName: string,
  question: string
): Promise<void> => {
  await addDoc(collection(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'questions'), {
    schoolId,
    schoolName,
    schoolLogo,
    askedBy,
    askedByName,
    question,
    answer: null,
    answeredAt: null,
    createdAt: serverTimestamp(),
  })
}

export const answerQuestion = async (
  schoolId: string,
  questionId: string,
  answer: string
): Promise<void> => {
  await updateDoc(doc(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'questions', questionId), {
    answer,
    answeredAt: serverTimestamp(),
  })
}

export const deleteQuestion = async (schoolId: string, questionId: string): Promise<void> => {
  await deleteDoc(doc(firebaseFirestore, SCHOOLS_COLLECTION, schoolId, 'questions', questionId))
}

export const fetchRecentQuestions = async (): Promise<Question[]> => {
  const q = query(
    collectionGroup(firebaseFirestore, 'questions'),
    orderBy('createdAt', 'desc'),
    limit(FEED_LIMIT)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Question[]
}

export const fetchRecentReviews = async (): Promise<Review[]> => {
  const q = query(
    collectionGroup(firebaseFirestore, 'reviews'),
    orderBy('createdAt', 'desc'),
    limit(FEED_LIMIT)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Review[]
}

export const fetchRecentAnnouncements = async (): Promise<Announcement[]> => {
  const q = query(
    collectionGroup(firebaseFirestore, 'announcements'),
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc'),
    limit(FEED_LIMIT)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Announcement[]
}
