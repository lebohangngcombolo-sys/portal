/**
 * KYC status widget — shows the most recent KYC case for the user's
 * organizations (customer) or assigned cases (analyst).
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES, routeBuilders } from '../../../common/constants/routes.js';
import { useSessionUser } from '../../../hooks/useSessionUser.js';
import { usePermissions } from '../../../hooks/usePermissions.js';
import { useProviderFetch } from '../../../hooks/useProviderFetch.js';
import { KycProvider, OrganizationProvider } from '../../../providers/index.js';
import { Card } from '../../../components/primitives/Card.jsx';
import { Spinner } from '../../../components/primitives/Spinner.jsx';
import { StatusBadge } from '../../../components/domain/StatusBadge.jsx';

export function KycStatusWidget() {
  const { t } = useTranslation();
  const { user } = useSessionUser();
  const { isKycAnalyst } = usePermissions();

  // Analysts get the queue, customers get their orgs
  const customerFetch = useProviderFetch(
    () => OrganizationProvider.listMine(),
    { enabled: Boolean(user) && !isKycAnalyst, deps: [user?.id, isKycAnalyst] },
  );
  const analystFetch = useProviderFetch(
    () => KycProvider.search({ status: 'IN_REVIEW', page: 0, size: 5 }),
    { enabled: isKycAnalyst, deps: [isKycAnalyst] },
  );

  if (!user) return null;

  if (isKycAnalyst) {
    const cases = analystFetch.data?.content || [];
    return (
      <Card>
        <h3>{t('dashboard.kycStatus')}</h3>
        {analystFetch.loading && <Spinner />}
        {cases.length === 0 ? (
          <p className="hint">{t('dashboard.noAssignedCases', { defaultValue: 'No assigned cases right now.' })}</p>
        ) : (
          <ul>
            {cases.map((c) => (
              <li key={c.id}>
                <Link to={routeBuilders.kycCaseDetail(c.id)}>
                  {c.caseNumber} <StatusBadge status={c.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link to={ROUTES.KYC_CASES}>{t('dashboard.viewKyc')}</Link>
      </Card>
    );
  }

  const orgs = customerFetch.data || [];
  const firstOrg = orgs[0];

  return (
    <Card>
      <h3>{t('dashboard.kycStatus')}</h3>
      {customerFetch.loading && <Spinner />}
      {!firstOrg && (
        <p className="hint">{t('organization.list.empty')}</p>
      )}
      {firstOrg && (
        <>
          <p>{firstOrg.legalName}</p>
          <StatusBadge status={firstOrg.status} />
          <Link to={routeBuilders.organizationDetail(firstOrg.id)}>
            {t('organization.list.view', { defaultValue: 'View organization' })}
          </Link>
        </>
      )}
    </Card>
  );
}