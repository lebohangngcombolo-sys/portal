/**
 * Native date input styled consistently with other primitives.
 * Exported both as DatePicker and DateInput (alias used by scenes).
 */
import { forwardRef } from 'react';
import styled from 'styled-components';

export const DatePicker = forwardRef(function DatePicker(
  { label, error, required, id, className, ...rest },
  ref,
) {
  const inputId = id || rest.name;
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
        type="date"
        required={required}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
});

export const DateInput = DatePicker;

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
  color: #ef4444;
  margin-left: 4px;
`;

const StyledInput = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid ${({ 'aria-invalid': invalid }) => (invalid ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #0b5fff;
    box-shadow: 0 0 0 3px rgba(11, 95, 255, 0.1);
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;