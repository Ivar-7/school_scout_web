import type { ReactNode } from 'react'
import { ErrorBoundary } from '../../shared/components/ErrorBoundary'
import { ThemeProvider } from '../../shared/providers/ThemeProvider'
import { AuthProvider } from '../../features/auth/providers/AuthProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
