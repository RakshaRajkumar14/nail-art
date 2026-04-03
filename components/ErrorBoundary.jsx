import React, { Component } from 'react';
import { AlertTriangle, RotateCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Optional: Send to error tracking service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.__SENTRY__) {
      window.__SENTRY__.captureException(error);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FAF7F4' }}>
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="p-4 rounded-full"
                style={{ backgroundColor: 'rgba(230, 183, 169, 0.2)' }}
              >
                <AlertTriangle size={32} style={{ color: '#E6B7A9' }} />
              </div>
            </div>

            {/* Error Title */}
            <h1
              className="text-2xl font-bold text-center mb-2"
              style={{ color: '#1E1E1E', fontFamily: 'Playfair Display' }}
            >
              Oops! Something went wrong
            </h1>

            {/* Error Description */}
            <p
              className="text-center mb-6"
              style={{ color: '#777777', fontFamily: 'Inter' }}
            >
              We're sorry for the inconvenience. Our team has been notified about this issue.
            </p>

            {/* Development Error Info */}
            {isDevelopment && this.state.error && (
              <div
                className="mb-6 p-4 rounded-lg text-sm overflow-auto max-h-40"
                style={{
                  backgroundColor: '#F5F5F5',
                  color: '#1E1E1E',
                  fontFamily: 'Courier New',
                  border: '1px solid #E0E0E0',
                }}
              >
                <p className="font-semibold mb-2">Error Details:</p>
                <p className="text-xs mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <p className="text-xs">{this.state.errorInfo.componentStack}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#E6B7A9',
                  color: '#FAF7F4',
                  fontFamily: 'Inter',
                }}
              >
                <RotateCw size={18} />
                Try Again
              </button>

              <button
                onClick={this.handleReload}
                className="flex-1 py-2 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#E0E0E0',
                  color: '#1E1E1E',
                  fontFamily: 'Inter',
                }}
              >
                <Home size={18} />
                Home
              </button>
            </div>

            {/* Support Message */}
            <p
              className="text-center mt-6 text-sm"
              style={{ color: '#777777', fontFamily: 'Inter' }}
            >
              Need help?{' '}
              <a
                href="mailto:support@elegancenails.com"
                className="font-semibold transition-colors"
                style={{ color: '#E6B7A9' }}
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * USAGE EXAMPLE
 * =============
 *
 * Wrap your app or specific components:
 *
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 *
 * Note: Error boundaries only catch errors in render methods,
 * lifecycle methods, and constructors. For async errors, use try-catch
 * or promise rejection handlers.
 */
