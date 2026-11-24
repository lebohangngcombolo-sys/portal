import { forwardRef } from 'react';
import styled from 'styled-components';

export const Textarea = forwardRef(function Textarea(
  { label, hint, error, required, id, rows = 4, className, ...rest },
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
      <StyledTextarea
        ref={ref}
        id={inputId}
        required={required}
        rows={rows}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {hint && !error && <Hint>{hint}</Hint>}
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
});

export const TextArea = Textarea;

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

const StyledTextarea = styled.textarea`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid ${({ 'aria-invalid': invalid }) => (invalid ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  background: #ffffff;
  color: #0b1220;
  font-family: inherit;
  resize: vertical;
  outline: none;

  &:focus {
    border-color: #0b5fff;
    box-shadow: 0 0 0 3px rgba(11, 95, 255, 0.1);
  }
`;

const Hint = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;