import styled from 'styled-components';

export function Spinner({ size = 20, className, label = 'Loading…' }) {
  return (
    <Wrapper className={className} role="status" aria-label={label}>
      <Circle size={size} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.div`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 2px solid #e5e7eb;
  border-top-color: #0b5fff;
  border-radius: 50%;
  animation: tb-spin 0.7s linear infinite;

  @keyframes tb-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;