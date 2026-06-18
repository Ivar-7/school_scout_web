import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore'
import type {
  Application,
  ApplicationFormData,
  ApplicationStatus,
} from '../types/applications.types'

const COLLECTION = 'applications'

const applicationsRef = () => collection(firebaseFirestore, COLLECTION)

export const fetchParentApplications = async (parentId: string): Promise<Application[]> => {
  const q = query(
    applicationsRef(),
    where('parentId', '==', parentId),
    orderBy('submittedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Application[]
}

export const fetchSchoolApplications = async (schoolId: string): Promise<Application[]> => {
  const q = query(
    applicationsRef(),
    where('schoolId', '==', schoolId),
    orderBy('submittedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Application[]
}

export const fetchApplicationById = async (id: string): Promise<Application | null> => {
  const ref = doc(firebaseFirestore, COLLECTION, id)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() } as Application
}

export const submitApplication = async (
  parentId: string,
  parentName: string,
  parentEmail: string,
  parentPhone: string,
  formData: ApplicationFormData
): Promise<string> => {
  const schoolSnap = await getDoc(doc(firebaseFirestore, 'schools', formData.schoolId))
  const schoolOwnerId = schoolSnap.exists() ? (schoolSnap.data().ownerId ?? null) : null

  const docRef = await addDoc(applicationsRef(), {
    ...formData,
    parentId,
    parentName,
    parentEmail,
    parentPhone,
    schoolOwnerId,
    status: 'submitted',
    schoolNotes: '',
    submittedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    reviewedAt: null,
  })
  return docRef.id
}

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  schoolNotes?: string
): Promise<void> => {
  await updateDoc(doc(firebaseFirestore, COLLECTION, applicationId), {
    status,
    ...(schoolNotes !== undefined && { schoolNotes }),
    updatedAt: serverTimestamp(),
    reviewedAt: serverTimestamp(),
  })
}

export const hasApplied = async (parentId: string, schoolId: string): Promise<boolean> => {
  const q = query(
    applicationsRef(),
    where('parentId', '==', parentId),
    where('schoolId', '==', schoolId)
  )
  const snapshot = await getDocs(q)
  return !snapshot.empty
}
