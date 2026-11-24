import styled from 'styled-components';

export function Tag({ children, onRemove, className }) {
  return (
    <StyledTag className={className}>
      {children}
      {onRemove && (
        <Remove type="button" onClick={onRemove} aria-label="Remove">
          ×
        </Remove>
      )}
    </StyledTag>
  );
}

const StyledTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 4px;
  background: #f3f4f6;
  color: #374151;
  font-size: 12px;
`;

const Remove = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #ef4444;
  }
`;