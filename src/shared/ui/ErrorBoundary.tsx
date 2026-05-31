import { Component, type ErrorInfo, type ReactNode } from 'react'
import styles from '../styles/ErrorBoundary.module.css'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  info: string | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    info: null,
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info: info.componentStack ?? null })
    console.error('Unhandled error caught by ErrorBoundary:', error, info)
  }

  render() {
    const { hasError, error, info } = this.state

    if (hasError) {
      return (
        <div className={styles.errorBoundary} role="alert">
          <div className={styles.errorBox}>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
              An unexpected error occurred while loading the form. Please refresh the page or try again later.
            </p>
            {error ? <pre className={styles.details}>{error.message}</pre> : null}
            {info ? <pre className={styles.details}>{info}</pre> : null}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
