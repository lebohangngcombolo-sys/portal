/**
 * Fallback rendered by `index.js` when bootstrap (Faro / i18n / config
 * fetch) throws before the app is mounted.
 */
import styled from 'styled-components';

export function AppBootstrapError({ error }) {
  return (
    <Wrapper>
      <h1>TradeBridge Africa</h1>
      <p>We couldn't load the application.</p>
      <details>
        <summary>Details</summary>
        <pre>{error?.message || String(error)}</pre>
      </details>
      <button type="button" onClick={() => window.location.reload()}>
        Reload
      </button>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  padding: 64px 24px;
  text-align: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  h1 {
    font-size: 20px;
    margin-bottom: 8px;
  }

  p {
    color: #6b7280;
    margin-bottom: 16px;
  }

  details {
    max-width: 480px;
    margin: 0 auto 24px;
    text-align: left;
    color: #374151;
    font-size: 13px;
  }

  pre {
    background: #f3f4f6;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 12px;
  }

  button {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #0b5fff;
    background: #0b5fff;
    color: #ffffff;
    cursor: pointer;
  }
`;