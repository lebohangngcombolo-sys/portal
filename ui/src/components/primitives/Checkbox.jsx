import styled from 'styled-components';

export function Checkbox({ label, error, checked, onChange, disabled, className, ...rest }) {
  return (
    <Wrapper className={className}>
      <Label>
        <input
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          {...rest}
        />
        <span>{label}</span>
      </Label>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;

  input {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    accent-color: #0b5fff;
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #ef4444;
`;