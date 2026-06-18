import { create } from 'zustand'
import type { User } from 'firebase/auth'
import type { UserProfile } from '../types/user.types'

interface AuthState {
  user: User | null
  profile: UserProfile | null
  initializing: boolean
  setSession: (user: User | null, profile: UserProfile | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  initializing: true,
  setSession: (user, profile) => set({ user, profile, initializing: false }),
  clear: () => set({ user: null, profile: null, initializing: false }),
}))
