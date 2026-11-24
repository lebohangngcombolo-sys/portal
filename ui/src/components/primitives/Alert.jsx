import styled, { css } from 'styled-components';

const variants = {
  info: css`
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1e40af;
  `,
  success: css`
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  `,
  warning: css`
    background: #fffbeb;
    border-color: #fcd34d;
    color: #92400e;
  `,
  error: css`
    background: #fef2f2;
    border-color: #fecaca;
    color: #991b1b;
  `,
};

export function Alert({ variant = 'info', title, children, className }) {
  return (
    <Wrapper variant={variant} className={className}>
      {title && <Title>{title}</Title>}
      {children && <Body>{children}</Body>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 12px 16px;
  border: 1px solid;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
  ${({ variant }) => variants[variant] || variants.info}
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const Body = styled.div``;