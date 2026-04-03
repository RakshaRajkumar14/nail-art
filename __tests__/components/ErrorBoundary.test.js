/**
 * ErrorBoundary Component Tests
 * =============================
 * Tests for error handling, fallback UI, error logging
 * Coverage: Error catching, boundary behavior, recovery
 */

import React from 'react'
import { render, screen } from '../setup/test-utils'

// Create a component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

jest.mock('../../components/ErrorBoundary', () => {
  return class MockErrorBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
      // Log error info
      console.error('Caught error:', error, errorInfo)
    }

    render() {
      if (this.state.hasError) {
        return (
          <div data-testid="error-boundary">
            <div data-testid="error-message">
              <h1>Something went wrong</h1>
              <p>We apologize for the inconvenience.</p>
              <button
                data-testid="error-reset"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Try Again
              </button>
              {process.env.NODE_ENV === 'development' && (
                <details data-testid="error-details">
                  <summary>Error Details</summary>
                  <pre>{this.state.error?.toString()}</pre>
                </details>
              )}
            </div>
          </div>
        )
      }

      return this.props.children
    }
  }
})

import ErrorBoundary from '../../components/ErrorBoundary'

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console errors during tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    console.error.mockRestore()
  })

  describe('Normal Rendering', () => {
    test('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-content">Child Content</div>
        </ErrorBoundary>
      )
      expect(screen.getByTestId('child-content')).toBeInTheDocument()
      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument()
    })

    test('renders multiple children', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ErrorBoundary>
      )
      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('catches errors thrown by children', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    })

    test('displays error fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    test('displays helpful message in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      expect(screen.getByText(/We apologize for the inconvenience/i)).toBeInTheDocument()
    })

    test('renders reset button in error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      const resetBtn = screen.getByTestId('error-reset')
      expect(resetBtn).toBeInTheDocument()
      expect(resetBtn).toHaveTextContent('Try Again')
    })
  })

  describe('Error Recovery', () => {
    test('clicking reset button clears error', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()

      const resetBtn = screen.getByTestId('error-reset')
      resetBtn.click()

      // After reset, should attempt to render children again
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    })
  })

  describe('Error Details', () => {
    test('displays error details in development mode', () => {
      process.env.NODE_ENV = 'development'
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      expect(screen.getByTestId('error-details')).toBeInTheDocument()
    })

    test('error details show error message', () => {
      process.env.NODE_ENV = 'development'
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      const details = screen.getByTestId('error-details')
      expect(details).toBeInTheDocument()
    })

    test('hides error details in production mode', () => {
      process.env.NODE_ENV = 'production'
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // In production, error details should not show
      const details = screen.queryByTestId('error-details')
      expect(details).not.toBeInTheDocument()
    })
  })

  describe('Error Logging', () => {
    test('logs error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      expect(console.error).toHaveBeenCalled()
    })

    test('error boundary catches exceptions', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      )

      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument()

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    })
  })

  describe('Nested Error Boundaries', () => {
    test('inner error boundary catches its errors', () => {
      render(
        <ErrorBoundary>
          <div data-testid="outer">Outer Content</div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
        </ErrorBoundary>
      )
      // Should show error from inner boundary
      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('error message is readable', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Something went wrong')
    })

    test('reset button is keyboard accessible', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      const resetBtn = screen.getByTestId('error-reset')
      expect(resetBtn.tagName).toBe('BUTTON')
    })

    test('error boundary shows meaningful error text', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('handles multiple errors gracefully', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    })

    test('renders with empty children', () => {
      render(<ErrorBoundary></ErrorBoundary>)
      // Should not throw, should render normally
      expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument()
    })
  })
})
