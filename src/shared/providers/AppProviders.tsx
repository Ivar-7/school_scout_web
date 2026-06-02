import type { ReactNode } from 'react'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { ThemeProvider } from './ThemeProvider'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>{children}</ThemeProvider>
    </ErrorBoundary>
  )
}