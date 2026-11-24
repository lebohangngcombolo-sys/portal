import { forwardRef, useState } from 'react';
import styled from 'styled-components';

export const PasswordInput = forwardRef(function PasswordInput(
  { label, hint, error, required, id, className, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const inputId = id || rest.name;

  return (
    <Wrapper className={className}>
      {label && (
        <Label htmlFor={inputId}>
          {label}
          {required && <Required aria-hidden="true">*</Required>}
        </Label>
      )}
      <InputRow>
        <StyledInput
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          required={required}
          aria-invalid={Boolean(error)}
          {...rest}
        />
        <Toggle
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? '🙈' : '👁'}
        </Toggle>
      </InputRow>
      {hint && !error && <Hint>{hint}</Hint>}
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
});

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

const InputRow = styled.div`
  display: flex;
  gap: 0;
  position: relative;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 8px 40px 8px 12px;
  font-size: 14px;
  border: 1px solid ${({ 'aria-invalid': invalid }) => (invalid ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #0b5fff;
    box-shadow: 0 0 0 3px rgba(11, 95, 255, 0.1);
  }
`;

const Toggle = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
`;

const Hint = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;