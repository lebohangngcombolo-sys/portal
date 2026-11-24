/**
 * Organizations list scene — the customer's organizations.
 *
 * Empty state prompts to create the first one. Each row shows the legal
 * name, status, and last update, with actions to view or edit (only when
 * the status allows editing).
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES, routeBuilders } from '../../common/constants/routes.js';
import { ORGANIZATION_EDITABLE_STATUSES } from '../../common/constants/kycStatus.js';
import { formatDate } from '../../common/utils/date.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { OrganizationProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { EmptyState } from '../../components/primitives/EmptyState.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { StatusBadge } from '../../components/domain/StatusBadge.jsx';

export default function OrganizationsListScene() {
  const { t, i18n } = useTranslation();
  const { user } = useSessionUser();

  const { data: organizations, loading, error, refetch } = useProviderFetch(
    () => OrganizationProvider.listMine(),
    { enabled: Boolean(user), deps: [user?.id] },
  );

  const canEdit = (org) => ORGANIZATION_EDITABLE_STATUSES.includes(org.status);

  return (
    <PageLayout
      title={t('organization.list.title')}
      actions={
        <Link to={ROUTES.ORGANIZATIONS_NEW}>
          <Button variant="primary">{t('organization.list.createOne')}</Button>
        </Link>
      }
    >
      {loading && <Spinner />}

      {error && !loading && (
        <Card>
          <EmptyState
            title={t('organization.list.loadError')}
            action={
              <Button variant="secondary" onClick={refetch}>
                {t('common.retry')}
              </Button>
            }
          />
        </Card>
      )}

      {!loading && !error && (organizations || []).length === 0 && (
        <Card>
          <EmptyState
            title={t('organization.list.empty')}
            action={
              <Link to={ROUTES.ORGANIZATIONS_NEW}>
                <Button variant="primary">{t('organization.list.createOne')}</Button>
              </Link>
            }
          />
        </Card>
      )}

      {!loading && !error && (organizations || []).length > 0 && (
        <Card>
          <table className="organizations-table">
            <thead>
              <tr>
                <th>{t('organization.list.columns.name')}</th>
                <th>{t('organization.list.columns.type')}</th>
                <th>{t('organization.list.columns.registration')}</th>
                <th>{t('organization.list.columns.status')}</th>
                <th>{t('organization.list.columns.updated')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td>
                    <Link to={routeBuilders.organizationDetail(org.id)}>{org.legalName}</Link>
                  </td>
                  <td>{org.organizationType}</td>
                  <td>{org.registrationNumber}</td>
                  <td>
                    <StatusBadge status={org.status} />
                  </td>
                  <td>{formatDate(org.updatedAt, 'd MMM yyyy', i18n.language)}</td>
                  <td>
                    <Link to={routeBuilders.organizationDetail(org.id)}>
                      <Button variant="ghost">{t('common.view', { defaultValue: 'View' })}</Button>
                    </Link>
                    {canEdit(org) && (
                      <Link to={routeBuilders.organizationEdit(org.id)}>
                        <Button variant="ghost">{t('common.edit')}</Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </PageLayout>
  );
}