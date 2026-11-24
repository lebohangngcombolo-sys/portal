import styled from 'styled-components';

export function Radio({ name, value, label, checked, onChange, disabled, className }) {
  return (
    <Label className={className}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
      <span>{label}</span>
    </Label>
  );
}

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  margin-bottom: 8px;

  input {
    width: 16px;
    height: 16px;
    accent-color: #0b5fff;
  }
`;