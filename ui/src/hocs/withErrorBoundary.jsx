/**
 * Error boundary HOC — isolates scene-level failures.
 *
 * A crash inside a single scene should not blank the whole app. This HOC
 * catches render-phase errors and renders a small fallback with a
 * "reload" button. The shell (header, sidebar) keeps working.
 */
import { Component } from 'react';

import { SceneErrorFallback } from '../components/feedback/SceneErrorFallback.jsx';

export function withErrorBoundary(SceneComponent) {
  class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
      return { error };
    }

    componentDidCatch(error, info) {
      // Log to console for dev — Faro auto-captures via window.onerror
      // eslint-disable-next-line no-console
      console.error('[Scene error]', error, info);
    }

    render() {
      if (this.state.error) {
        return <SceneErrorFallback error={this.state.error} onReset={() => this.setState({ error: null })} />;
      }
      return <SceneComponent {...this.props} />;
    }
  }

  ErrorBoundary.displayName = `withErrorBoundary(${SceneComponent.displayName || SceneComponent.name || 'Component'})`;
  return ErrorBoundary;
}