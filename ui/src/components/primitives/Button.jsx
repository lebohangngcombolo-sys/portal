/**
 * Button primitive.
 *
 * Variants: primary, secondary, ghost, danger.
 * Sizes: sm, md, lg.
 */
import styled, { css } from 'styled-components';

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  children,
  className,
  ...rest
}) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      type={type}
      disabled={disabled || loading}
      className={className}
      {...rest}
    >
      {loading ? '…' : children}
    </StyledButton>
  );
}

const variantStyles = {
  primary: css`
    background: #0B5FFF;
    color: #FFFFFF;
    border: 1px solid #0B5FFF;
    &:hover:not(:disabled) {
      background: #0A4FE0;
    }
  `,
  secondary: css`
    background: #FFFFFF;
    color: #0B5FFF;
    border: 1px solid #0B5FFF;
    &:hover:not(:disabled) {
      background: #EEF3FF;
    }
  `,
  ghost: css`
    background: transparent;
    color: #374151;
    border: 1px solid transparent;
    &:hover:not(:disabled) {
      background: #F3F4F6;
    }
  `,
  danger: css`
    background: #EF4444;
    color: #FFFFFF;
    border: 1px solid #EF4444;
    &:hover:not(:disabled) {
      background: #DC2626;
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: 4px 12px;
    font-size: 13px;
  `,
  md: css`
    padding: 8px 16px;
    font-size: 14px;
  `,
  lg: css`
    padding: 12px 24px;
    font-size: 16px;
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  ${({ variant }) => variantStyles[variant] || variantStyles.primary}
  ${({ size }) => sizeStyles[size] || sizeStyles.md}
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;