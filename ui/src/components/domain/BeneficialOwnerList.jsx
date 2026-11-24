/**
 * Beneficial owner list — table with ownership percentage and control
 * type. Has a footer with the aggregate percentage (rendered by the
 * caller via <OwnershipSummary />).
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatPercent } from '../../common/utils/currency.js';
import { Button } from '../primitives/Button.jsx';
import { Badge } from '../primitives/Badge.jsx';
import { EmptyState } from '../primitives/EmptyState.jsx';

export function BeneficialOwnerList({ owners = [], onEdit, onDelete }) {
  const { t, i18n } = useTranslation();

  if (!owners || owners.length === 0) {
    return <EmptyState title={t('organization.beneficialOwners.empty', { defaultValue: 'No beneficial owners declared.' })} />;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>{t('organization.beneficialOwners.fields.firstName', { defaultValue: 'Name' })}</th>
          <th>{t('organization.beneficialOwners.fields.controlType', { defaultValue: 'Control' })}</th>
          <th>{t('organization.beneficialOwners.fields.ownershipPercentage', { defaultValue: 'Ownership' })}</th>
          <th>{t('organization.beneficialOwners.fields.nationality', { defaultValue: 'Nationality' })}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {owners.map((o) => (
          <tr key={o.id}>
            <td>
              {o.firstName} {o.lastName}
            </td>
            <td>
              <Badge variant="neutral">{o.controlType}</Badge>
            </td>
            <td>{o.ownershipPercentage !== null ? formatPercent(o.ownershipPercentage, i18n.language) : '—'}</td>
            <td>{o.nationalityCountryCode || '—'}</td>
            <td>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(o)}>
                  {t('common.edit')}
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(o)}>
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