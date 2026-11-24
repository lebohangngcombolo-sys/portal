import styled, { css } from 'styled-components';

export function Badge({ variant = 'neutral', children, className }) {
  return (
    <StyledBadge variant={variant} className={className}>
      {children}
    </StyledBadge>
  );
}

const variants = {
  neutral: css`
    background: #f3f4f6;
    color: #374151;
  `,
  success: css`
    background: #d1fae5;
    color: #065f46;
  `,
  warning: css`
    background: #fef3c7;
    color: #92400e;
  `,
  error: css`
    background: #fee2e2;
    color: #991b1b;
  `,
  info: css`
    background: #dbeafe;
    color: #1e40af;
  `,
};

const StyledBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  ${({ variant }) => variants[variant] || variants.neutral}
`;