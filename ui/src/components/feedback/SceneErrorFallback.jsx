/**
 * Fallback rendered by `withErrorBoundary` when a scene throws.
 */
import styled from 'styled-components';

export function SceneErrorFallback({ error, onReset }) {
  return (
    <Wrapper>
      <h2>Something went wrong</h2>
      <p>{error?.message || 'An unexpected error occurred in this page.'}</p>
      {onReset && (
        <button type="button" onClick={onReset}>
          Try again
        </button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 48px 24px;
  text-align: center;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;

  h2 {
    margin: 0 0 8px;
    font-size: 18px;
  }

  p {
    margin: 0 0 16px;
    font-size: 14px;
  }

  button {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #991b1b;
    background: #ffffff;
    color: #991b1b;
    cursor: pointer;
  }
`;