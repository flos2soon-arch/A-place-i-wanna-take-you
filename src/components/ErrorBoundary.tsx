import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '18px',
          flexDirection: 'column',
          gap: '20px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2>Application Error</h2>
          <p style={{ opacity: 0.7, fontSize: '14px', maxWidth: '600px' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {this.state.error?.stack && (
            <pre style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              maxWidth: '800px',
              maxHeight: '200px',
              overflow: 'auto',
              textAlign: 'left'
            }}>
              {this.state.error.stack}
            </pre>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 182, 193, 0.2)',
              border: '1px solid #ffb6c1',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: '20px',
              marginRight: '10px'
            }}
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              background: 'rgba(255, 182, 193, 0.2)',
              border: '1px solid #ffb6c1',
              color: '#fff',
              cursor: 'pointer',
              borderRadius: '20px'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary