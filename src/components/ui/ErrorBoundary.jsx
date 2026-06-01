import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Feature Error:', error, errorInfo);
    // You could log to an error tracking service like Sentry here
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5 text-center my-4">
          <div className="text-3xl mb-2">⚠️</div>
          <h3 className="text-lg font-bold text-white mb-2">Feature Unavailable</h3>
          <p className="text-white/60 text-sm mb-4">
            There was an error loading this part of the application.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
