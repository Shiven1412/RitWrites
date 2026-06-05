import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ color: '#b91c1c' }}>Something went wrong</h2>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#111', color: '#fff', padding: 12, borderRadius: 6, overflowX: 'auto' }}>
          {String(this.state.error && this.state.error.toString())}
          {this.state.info?.componentStack ? `\n\n${this.state.info.componentStack}` : ''}
        </pre>
      </div>
    );
  }
}
