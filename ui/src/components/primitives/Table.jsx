import styled from 'styled-components';

export function Table({ columns = [], data = [], emptyMessage = 'No data', className }) {
  if (data.length === 0) {
    return <Empty>{emptyMessage}</Empty>;
  }
  return (
    <StyledTable className={className}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={row.id ?? i}>
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th,
  td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    color: #374151;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody tr:hover {
    background: #f9fafb;
  }
`;

const Empty = styled.div`
  padding: 32px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
`;