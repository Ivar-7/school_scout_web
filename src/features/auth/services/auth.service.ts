import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { firebaseAuth } from '../../../shared/api/firebase/firebase.auth'
import { firebaseFirestore } from '../../../shared/api/firebase/firebase.firestore'
import type { SignUpInput, SignInInput, UserProfile } from '../types/auth.types'

const USERS_COLLECTION = 'users'

export const signUp = async ({
  displayName,
  email,
  password,
  role,
  phone,
}: SignUpInput): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
  await updateProfile(credential.user, { displayName })

  await setDoc(doc(firebaseFirestore, USERS_COLLECTION, credential.user.uid), {
    uid: credential.user.uid,
    email,
    displayName,
    role,
    phone,
    photoURL: '',
    schoolId: null,
    createdAt: serverTimestamp(),
  })

  return credential.user
}

export const signIn = async ({ email, password }: SignInInput): Promise<User> => {
  const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
  return credential.user
}

export const signOutUser = (): Promise<void> => signOut(firebaseAuth)

export const resetPassword = (email: string): Promise<void> =>
  sendPasswordResetEmail(firebaseAuth, email)

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(doc(firebaseFirestore, USERS_COLLECTION, uid))
  if (!snapshot.exists()) return null
  return snapshot.data() as UserProfile
}

export const subscribeToAuthChanges = (callback: (user: User | null) => void) =>
  onAuthStateChanged(firebaseAuth, callback)
