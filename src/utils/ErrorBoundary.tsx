import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    this.setState({ errorInfo: errorInfo ? JSON.stringify(errorInfo) : null })
    console.error('[DevBox ErrorBoundary]', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      
      return (
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="text-lg font-semibold text-red-900 mb-2">Tool Error</h2>
              <p className="text-sm text-red-700 mb-4">
                Something went wrong while loading this tool. The error has been logged.
              </p>
              <details className="text-sm">
                <summary className="cursor-pointer text-red-800 font-medium mb-2">
                  Technical Details
                </summary>
                <pre className="p-4 bg-red-100 border border-red-200 rounded-lg overflow-auto text-xs font-mono text-red-900 whitespace-pre-wrap break-words">
                  {this.state.error?.message}
                  {this.state.errorInfo && '\n\n' + this.state.errorInfo}
                </pre>
              </details>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
