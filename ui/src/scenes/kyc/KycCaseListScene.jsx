/**
 * KYC case list scene — analyst queue.
 *
 * Filterable by status and reviewer assignment. Each row shows case
 * number, organization legal name (if available from the case payload),
 * risk level, and status. Clicking a row opens the case detail.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { KYC_CASE_STATUS_LIST } from '../../common/constants/kycStatus.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { usePagination } from '../../hooks/usePagination.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { KycProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { Pagination } from '../../components/primitives/Pagination.jsx';
import { StatusBadge } from '../../components/domain/StatusBadge.jsx';
import { formatDate } from '../../common/utils/date.js';

export default function KycCaseListScene() {
  const { t, i18n } = useTranslation();
  const { user } = useSessionUser();
  const [status, setStatus] = useState('');
  const [assignedOnly, setAssignedOnly] = useState(false);
  const pagination = usePagination({ page: 0, size: 20 });

  const statusOptions = useMemo(
    () => [
      { value: '', label: t('common.all', { defaultValue: 'All' }) },
      ...KYC_CASE_STATUS_LIST.map((s) => ({ value: s, label: t(`kyc.statuses.${s}`) })),
    ],
    [t],
  );

  const { data, loading, refetch } = useProviderFetch(
    () =>
      KycProvider.search({
        status: status || undefined,
        assignedReviewerId: assignedOnly ? user?.id : undefined,
        page: pagination.page,
        size: pagination.size,
      }),
    { enabled: Boolean(user), deps: [user?.id, status, assignedOnly, pagination.page, pagination.size] },
  );

  const content = data?.content || [];
  const page = data?.page || { number: 0, size: pagination.size, totalElements: 0, totalPages: 0 };

  return (
    <PageLayout title={t('navigation.kycCases')}>
      <Card>
        <div className="kyc-filters">
          <Select
            label={t('kyc.filters.status', { defaultValue: 'Status' })}
            options={statusOptions}
            value={status}
            onChange={(v) => {
              setStatus(v);
              pagination.setPage(0);
            }}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={assignedOnly}
              onChange={(e) => {
                setAssignedOnly(e.target.checked);
                pagination.setPage(0);
              }}
            />
            {t('kyc.filters.assignedToMe', { defaultValue: 'Assigned to me' })}
          </label>
        </div>

        {loading && <Spinner />}

        <table className="kyc-table">
          <thead>
            <tr>
              <th>{t('kyc.columns.caseNumber', { defaultValue: 'Case' })}</th>
              <th>{t('kyc.columns.type', { defaultValue: 'Type' })}</th>
              <th>{t('kyc.columns.risk', { defaultValue: 'Risk' })}</th>
              <th>{t('kyc.columns.status', { defaultValue: 'Status' })}</th>
              <th>{t('kyc.columns.submitted', { defaultValue: 'Submitted' })}</th>
            </tr>
          </thead>
          <tbody>
            {content.map((kase) => (
              <tr key={kase.id}>
                <td>
                  <Link to={routeBuilders.kycCaseDetail(kase.id)}>{kase.caseNumber}</Link>
                </td>
                <td>{t(`kyc.caseType.${kase.caseType}`, { defaultValue: kase.caseType })}</td>
                <td>{kase.riskLevel ? t(`kyc.riskLevels.${kase.riskLevel}`) : '—'}</td>
                <td>
                  <StatusBadge status={kase.status} />
                </td>
                <td>
                  {kase.submittedAt
                    ? formatDate(kase.submittedAt, 'd MMM yyyy', i18n.language)
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          page={page.number}
          size={page.size}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          onPageChange={(n) => pagination.setPage(n)}
          onSizeChange={(s) => pagination.setSize(s)}
        />
      </Card>
    </PageLayout>
  );
}