import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
            Application error
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">
            Something went wrong while rendering this route.
          </h1>
        </div>
      )
    }

    return this.props.children
  }
}