import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-6 rounded-full bg-neutral-lighter p-5">
            <svg
              className="h-10 w-10 text-neutral"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h2 className="mb-2 font-heading text-2xl font-semibold text-gray-800">
            Algo sali&oacute; mal
          </h2>
          <p className="mb-6 max-w-md font-body text-neutral leading-relaxed">
            Ocurri&oacute; un error inesperado. Por favor intenta de nuevo. Si el
            problema persiste, contacta al equipo de soporte.
          </p>
          {this.state.error && (
            <pre className="mb-6 max-w-lg overflow-auto rounded-xl bg-neutral-lighter p-4 text-left text-sm text-gray-600">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="rounded-xl bg-accent px-6 py-3 font-body font-medium text-white shadow-card transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2"
          >
            Reintentar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
