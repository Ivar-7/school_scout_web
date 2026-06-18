import {
  signUp,
  signIn,
  signOutUser,
  resetPassword,
  getUserProfile,
  subscribeToAuthChanges,
} from '../services/auth.service'
import type { SignUpInput, SignInInput } from '../types/auth.types'

export const authApi = {
  signUp: (input: SignUpInput) => signUp(input),
  signIn: (input: SignInInput) => signIn(input),
  signOut: () => signOutUser(),
  resetPassword: (email: string) => resetPassword(email),
  getProfile: (uid: string) => getUserProfile(uid),
  onAuthStateChanged: subscribeToAuthChanges,
}
