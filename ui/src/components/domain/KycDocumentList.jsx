/**
 * KYC document list — table with file metadata and per-row remove.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatDate } from '../../common/utils/date.js';
import { Badge } from '../primitives/Badge.jsx';
import { Button } from '../primitives/Button.jsx';
import { EmptyState } from '../primitives/EmptyState.jsx';

const STATUS_VARIANTS = {
  PENDING: 'neutral',
  SCANNING: 'info',
  ACCEPTED: 'success',
  REJECTED: 'error',
  EXPIRED: 'warning',
};

export function KycDocumentList({ documents = [], onRemove }) {
  const { t, i18n } = useTranslation();

  if (!documents || documents.length === 0) {
    return <EmptyState title={t('kyc.documents.empty', { defaultValue: 'No documents yet.' })} />;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>{t('kyc.documents.filename', { defaultValue: 'File' })}</th>
          <th>{t('kyc.documents.type', { defaultValue: 'Type' })}</th>
          <th>{t('kyc.documents.status', { defaultValue: 'Status' })}</th>
          <th>{t('kyc.documents.uploadedAt', { defaultValue: 'Uploaded' })}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {documents.map((d) => (
          <tr key={d.id}>
            <td>
              <Filename>{d.originalFilename}</Filename>
              <Filesize>{(d.fileSizeBytes / 1024).toFixed(0)} KB</Filesize>
            </td>
            <td>{d.documentType}</td>
            <td>
              <Badge variant={STATUS_VARIANTS[d.documentStatus] || 'neutral'}>
                {d.documentStatus}
              </Badge>
            </td>
            <td>{d.uploadedAt ? formatDate(d.uploadedAt, 'd MMM yyyy', i18n.language) : '—'}</td>
            <td>
              {onRemove && d.documentStatus !== 'ACCEPTED' && (
                <Button variant="ghost" size="sm" onClick={() => onRemove(d)}>
                  {t('common.remove')}
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const Table = styled.table`
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
    font-size: 12px;
    color: #374151;
    text-transform: uppercase;
  }
`;

const Filename = styled.div`
  font-weight: 500;
  color: #0b1220;
`;

const Filesize = styled.div`
  font-size: 12px;
  color: #6b7280;
`;