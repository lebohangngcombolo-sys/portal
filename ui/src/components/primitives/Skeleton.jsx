import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

export function Skeleton({ width = '100%', height = 16, radius = 4, className }) {
  return (
    <StyledSkeleton
      width={width}
      height={height}
      radius={radius}
      className={className}
    />
  );
}

const StyledSkeleton = styled.div`
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  height: ${({ height }) => (typeof height === 'number' ? `${height}px` : height)};
  border-radius: ${({ radius }) => `${radius}px`};
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;