/**
 * Top-level React error boundary.
 *
 * Catches render-phase errors from anywhere in the app. Shows a compact
 * fallback that lets the user reload or go back to the dashboard. Logs
 * the error to Faro.
 */
import { Component } from 'react';
import styled from 'styled-components';

import { faro } from '../../faro/logger.js';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    faro.api?.pushError(error, {
      context: { componentStack: info?.componentStack ?? null },
    });
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <Fallback>
          <h1>Something went wrong</h1>
          <p>{this.state.error.message || 'An unexpected error occurred.'}</p>
          <button type="button" onClick={this.handleReset}>
            Try again
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Go to home
          </button>
        </Fallback>
      );
    }
    return this.props.children;
  }
}

const Fallback = styled.main`
  padding: 64px 24px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    margin-bottom: 24px;
  }

  button {
    margin: 0 6px;
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #0b5fff;
    background: #0b5fff;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;

    &:last-child {
      background: #ffffff;
      color: #0b5fff;
    }
  }
`;