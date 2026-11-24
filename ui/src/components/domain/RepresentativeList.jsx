/**
 * Representative list — table view with optional edit/delete/verify
 * actions. Renders a placeholder when the list is empty.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '../primitives/Button.jsx';
import { Badge } from '../primitives/Badge.jsx';
import { EmptyState } from '../primitives/EmptyState.jsx';

const VERIFICATION_VARIANTS = {
  PENDING: 'warning',
  VERIFIED: 'success',
  REJECTED: 'error',
};

export function RepresentativeList({ representatives = [], onEdit, onDelete, onVerify }) {
  const { t } = useTranslation();

  if (!representatives || representatives.length === 0) {
    return <EmptyState title={t('organization.representatives.empty', { defaultValue: 'No representatives yet.' })} />;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>{t('organization.representatives.name', { defaultValue: 'Name' })}</th>
          <th>{t('organization.representatives.type', { defaultValue: 'Role' })}</th>
          <th>{t('organization.representatives.email', { defaultValue: 'Email' })}</th>
          <th>{t('organization.representatives.status', { defaultValue: 'Status' })}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {representatives.map((r) => (
          <tr key={r.id}>
            <td>
              {r.firstName} {r.lastName}
              {r.authorizedSignatory && (
                <Badge variant="info">{t('organization.representatives.signatoryBadge')}</Badge>
              )}
            </td>
            <td>{r.representativeType}</td>
            <td>{r.email}</td>
            <td>
              <Badge variant={VERIFICATION_VARIANTS[r.verificationStatus] || 'neutral'}>
                {r.verificationStatus}
              </Badge>
            </td>
            <td>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(r)}>
                  {t('common.edit')}
                </Button>
              )}
              {onVerify && r.verificationStatus === 'PENDING' && (
                <Button variant="ghost" size="sm" onClick={() => onVerify(r, 'VERIFIED')}>
                  {t('organization.representatives.verify', { defaultValue: 'Verify' })}
                </Button>
              )}
              {onVerify && r.verificationStatus === 'PENDING' && (
                <Button variant="ghost" size="sm" onClick={() => onVerify(r, 'REJECTED')}>
                  {t('organization.representatives.reject', { defaultValue: 'Reject' })}
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(r)}>
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
    letter-spacing: 0.05em;
  }
`;