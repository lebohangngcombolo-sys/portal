import { forwardRef } from 'react';
import styled from 'styled-components';

export const CurrencyInput = forwardRef(function CurrencyInput(
  { label, currency, error, required, id, className, ...rest },
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
      <Row>
        {currency && <Currency>{currency}</Currency>}
        <StyledInput
          ref={ref}
          id={inputId}
          type="number"
          step="0.01"
          required={required}
          aria-invalid={Boolean(error)}
          {...rest}
        />
      </Row>
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

const Row = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
`;

const Currency = styled.span`
  padding: 8px 12px;
  background: #f3f4f6;
  border-right: 1px solid #d1d5db;
  font-size: 14px;
  color: #374151;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  outline: none;

  &:focus {
    box-shadow: inset 0 0 0 2px rgba(11, 95, 255, 0.2);
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;