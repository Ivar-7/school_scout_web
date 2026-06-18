import { useState } from 'react'
import { useAuthStore } from '../../../shared/store'
import { authApi } from '../api/auth.api'
import { handleError } from '../../../shared/utils/errorHandler'
import type { SignUpInput, SignInInput } from '../types/auth.types'

export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const initializing = useAuthStore((state) => state.initializing)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signUp = async (input: SignUpInput): Promise<boolean> => {
    try {
      setSubmitting(true)
      setError(null)
      await authApi.signUp(input)
      return true
    } catch (err) {
      setError(handleError('useAuth:signUp', err))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const signIn = async (input: SignInInput): Promise<boolean> => {
    try {
      setSubmitting(true)
      setError(null)
      await authApi.signIn(input)
      return true
    } catch (err) {
      setError(handleError('useAuth:signIn', err))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const signOut = async (): Promise<void> => {
    await authApi.signOut()
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setSubmitting(true)
      setError(null)
      await authApi.resetPassword(email)
      return true
    } catch (err) {
      setError(handleError('useAuth:resetPassword', err))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    user,
    profile,
    initializing,
    isAuthenticated: !!user,
    role: profile?.role ?? null,
    submitting,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }
}
