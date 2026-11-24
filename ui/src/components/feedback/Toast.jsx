import styled, { css } from 'styled-components';

const variantStyles = {
  success: css`
    background: #ecfdf5;
    border-color: #a7f3d0;
    color: #065f46;
  `,
  error: css`
    background: #fef2f2;
    border-color: #fecaca;
    color: #991b1b;
  `,
  warning: css`
    background: #fffbeb;
    border-color: #fcd34d;
    color: #92400e;
  `,
  info: css`
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #1e40af;
  `,
};

export function Toast({ type = 'info', message, onClose }) {
  return (
    <Wrapper type={type} role="alert">
      <Message>{message}</Message>
      {onClose && (
        <Close type="button" onClick={onClose} aria-label="Dismiss">
          ×
        </Close>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 14px;
  min-width: 260px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  ${({ type }) => variantStyles[type] || variantStyles.info}
`;

const Message = styled.span`
  flex: 1;
`;

const Close = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;