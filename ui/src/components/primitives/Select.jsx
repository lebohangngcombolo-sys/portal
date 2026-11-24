import { forwardRef } from 'react';
import styled from 'styled-components';

export const Select = forwardRef(function Select(
  { label, options = [], error, required, placeholder, id, className, ...rest },
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
      <StyledSelect
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </StyledSelect>
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

const StyledSelect = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid ${({ 'aria-invalid': invalid }) => (invalid ? '#ef4444' : '#d1d5db')};
  border-radius: 6px;
  background: #ffffff;
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