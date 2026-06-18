import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth.types'

interface RoleRouteProps {
  role: UserRole
}

export function RoleRoute({ role }: RoleRouteProps) {
  const { isAuthenticated, initializing, role: currentRole } = useAuth()

  if (initializing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (currentRole !== role) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
