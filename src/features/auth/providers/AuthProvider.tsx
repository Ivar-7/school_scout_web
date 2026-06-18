import { useEffect, type ReactNode } from 'react'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../../../shared/store'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setSession = useAuthStore((state) => state.setSession)
  const clear = useAuthStore((state) => state.clear)

  useEffect(() => {
    const unsubscribe = authApi.onAuthStateChanged((user) => {
      if (!user) {
        clear()
        return
      }
      authApi.getProfile(user.uid).then((profile) => setSession(user, profile))
    })
    return unsubscribe
  }, [setSession, clear])

  return <>{children}</>
}
