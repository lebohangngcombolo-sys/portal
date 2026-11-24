/**
 * Phone input with E.164 awareness.
 *
 * Validates on blur and displays a mask hint. The value is stored as-is
 * (with +) and passed to the backend for canonical E.164 validation.
 */
import { forwardRef, useState } from 'react';
import styled from 'styled-components';

import { isValidE164, normalizePhone } from '../../common/utils/phone.js';

export const PhoneInput = forwardRef(function PhoneInput(
  { label, error, required, id, onBlur, onChange, value, className, ...rest },
  ref,
) {
  const [localError, setLocalError] = useState(null);
  const inputId = id || rest.name;

  const handleBlur = (e) => {
    const v = e.target.value;
    if (v && !isValidE164(v)) {
      setLocalError('Enter a phone number with country code, e.g. +27123456789');
    } else {
      setLocalError(null);
    }
    onBlur?.(e);
  };

  const handleChange = (e) => {
    onChange?.(e);
  };

  const displayError = error || localError;

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
        type="tel"
        placeholder="+27123456789"
        inputMode="tel"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        aria-invalid={Boolean(displayError)}
        {...rest}
      />
      {displayError ? (
        <ErrorText>{displayError}</ErrorText>
      ) : (
        <Hint>Include the country code (e.g. +27 for South Africa).</Hint>
      )}
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

const Hint = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;