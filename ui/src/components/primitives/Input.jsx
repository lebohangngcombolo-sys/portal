/**
 * Base text input with label, hint, error, and required indicator.
 *
 * Exported as both `Input` (base) and `TextInput` (alias used by scenes).
 * React.forwardRef so tests can focus it.
 */
import { forwardRef } from 'react';
import styled from 'styled-components';

export const Input = forwardRef(function Input(
  { label, hint, error, required, id, className, ...rest },
  ref,
) {
  const inputId = id || rest.name;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <Wrapper className={className}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <Required aria-hidden="true">*</Required>}
        </Label>
      )}
      <StyledInput
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
        {...rest}
      />
      {hint && !error && <Hint id={hintId}>{hint}</Hint>}
      {error && <ErrorText id={errorId}>{error}</ErrorText>}
    </Wrapper>
  );
});

export const TextInput = Input;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
`;

const Required = styled.span`
  color: #EF4444;
  margin-left: 4px;
`;

const StyledInput = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid ${({ 'aria-invalid': invalid }) => (invalid ? '#EF4444' : '#D1D5DB')};
  border-radius: 6px;
  background: #FFFFFF;
  color: #0B1220;
  outline: none;

  &:focus {
    border-color: #0B5FFF;
    box-shadow: 0 0 0 3px rgba(11, 95, 255, 0.1);
  }

  &:disabled {
    background: #F3F4F6;
    cursor: not-allowed;
  }
`;

const Hint = styled.span`
  font-size: 12px;
  color: #6B7280;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #EF4444;
`;