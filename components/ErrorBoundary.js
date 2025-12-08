/**
 * Error Boundary Component
 * Gracefully handles errors in React components
 */

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          borderRadius: '8px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <h2 style={{ color: '#856404', marginTop: 0 }}>
            Something went wrong
          </h2>
          <p style={{ color: '#856404', marginBottom: '10px' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: '#856404',
              fontSize: '12px',
              marginTop: '10px',
              padding: '10px',
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '4px',
            }}>
              {this.state.errorInfo.componentStack}
            </details>
          )}
          <button
            onClick={this.resetError}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#856404',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
