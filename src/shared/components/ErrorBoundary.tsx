import { Component, type ReactNode } from 'react'
import { logError } from '../utils/errorHandler'

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

  componentDidCatch(error: unknown) {
    logError('ErrorBoundary', error)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted">
            Application error
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Something went wrong while rendering this page.
          </h1>
          <p className="mt-3 max-w-lg text-base leading-7 text-muted">
            Please try again. If the problem keeps happening, refresh the page.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReset}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-brand-soft"
            >
              Go home
            </a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
