import styled from 'styled-components';

export function Pagination({
  page = 0,
  size = 20,
  totalPages = 0,
  totalElements = 0,
  onPageChange,
  onSizeChange,
  className,
}) {
  const from = totalElements === 0 ? 0 : page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);

  return (
    <Wrapper className={className}>
      <Summary>
        {totalElements === 0
          ? 'No results'
          : `${from}–${to} of ${totalElements}`}
      </Summary>
      <Controls>
        <PageButton
          type="button"
          disabled={page === 0}
          onClick={() => onPageChange?.(page - 1)}
        >
          ‹ Prev
        </PageButton>
        <PageIndicator>
          Page {page + 1} of {Math.max(totalPages, 1)}
        </PageIndicator>
        <PageButton
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange?.(page + 1)}
        >
          Next ›
        </PageButton>
        {onSizeChange && (
          <SizeSelect
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            aria-label="Page size"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </SizeSelect>
        )}
      </Controls>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  flex-wrap: wrap;
`;

const Summary = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.span`
  font-size: 13px;
  color: #374151;
`;

const SizeSelect = styled.select`
  padding: 6px 8px;
  font-size: 13px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
`;