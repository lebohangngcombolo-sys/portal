/**
 * Organization detail scene.
 *
 * Shows the organization's core fields, current status, representatives,
 * beneficial owners, and any active KYC case. Provides quick links to
 * the sub-scenes (edit, representatives, owners, ownership, submit) and,
 * when a KYC case is active, to the KYC resubmission scene.
 */
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  ROUTES,
  routeBuilders,
} from '../../common/constants/routes.js';
import {
  ORGANIZATION_EDITABLE_STATUSES,
  KYC_CUSTOMER_ACTION_STATUSES,
} from '../../common/constants/kycStatus.js';
import { formatDate } from '../../common/utils/date.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedOrganization } from '../../contexts/OrganizationContext.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { RepresentativeProvider, BeneficialOwnerProvider, OrganizationProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { StatusBadge } from '../../components/domain/StatusBadge.jsx';
import { RepresentativeList } from '../../components/domain/RepresentativeList.jsx';
import { BeneficialOwnerList } from '../../components/domain/BeneficialOwnerList.jsx';
import { OwnershipSummary } from '../../components/domain/OwnershipSummary.jsx';
import { KycCaseTimeline } from '../../components/domain/KycCaseTimeline.jsx';

export default function OrganizationDetailScene() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { organization, loading, load } = useSelectedOrganization();

  const repsFetch = useProviderFetch(
    () => RepresentativeProvider.list(id),
    { enabled: Boolean(id), deps: [id] },
  );
  const ownersFetch = useProviderFetch(
    () => BeneficialOwnerProvider.list(id),
    { enabled: Boolean(id), deps: [id] },
  );
  const casesFetch = useProviderFetch(
    () => OrganizationProvider.listKycCases(id),
    { enabled: Boolean(id), deps: [id] },
  );

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  if (loading || !organization) {
    return <PageLayout><Spinner /></PageLayout>;
  }

  const canEdit = ORGANIZATION_EDITABLE_STATUSES.includes(organization.status);
  const activeCase = (casesFetch.data || []).find((c) =>
    KYC_CUSTOMER_ACTION_STATUSES.includes(c.status),
  );

  return (
    <PageLayout
      title={organization.legalName}
      subtitle={organization.organizationNumber}
      actions={
        <>
          {canEdit && (
            <Link to={routeBuilders.organizationEdit(id)}>
              <Button variant="secondary">{t('common.edit')}</Button>
            </Link>
          )}
          {activeCase && (
            <Link to={routeBuilders.kycResubmit(activeCase.id)}>
              <Button variant="primary">{t('kyc.actions.resubmit')}</Button>
            </Link>
          )}
        </>
      }
    >
      <Card>
        <h3>{t('organization.create.sections.basic')}</h3>
        <dl>
          <dt>{t('organization.create.fields.legalName')}</dt>
          <dd>{organization.legalName}</dd>
          <dt>{t('organization.create.fields.tradingName')}</dt>
          <dd>{organization.tradingName || '—'}</dd>
          <dt>{t('organization.create.fields.organizationType')}</dt>
          <dd>{organization.organizationType}</dd>
          <dt>{t('organization.create.fields.registrationNumber')}</dt>
          <dd>{organization.registrationNumber}</dd>
          <dt>{t('organization.create.fields.taxNumber')}</dt>
          <dd>{organization.taxNumber || '—'}</dd>
          <dt>{t('organization.create.fields.incorporationDate')}</dt>
          <dd>
            {organization.incorporationDate
              ? formatDate(organization.incorporationDate, 'd MMM yyyy', i18n.language)
              : '—'}
          </dd>
          <dt>{t('organization.create.fields.registrationAuthority')}</dt>
          <dd>{organization.registrationAuthority || '—'}</dd>
          <dt>{t('organization.list.columns.status')}</dt>
          <dd>
            <StatusBadge status={organization.status} />
          </dd>
        </dl>
      </Card>

      <Card>
        <h3>{t('organization.representatives.title')}</h3>
        {repsFetch.loading && <Spinner />}
        <RepresentativeList representatives={repsFetch.data || []} />
        <Link to={routeBuilders.organizationRepresentatives(id)}>
          <Button variant="ghost">{t('organization.representatives.title')}</Button>
        </Link>
      </Card>

      <Card>
        <h3>{t('organization.beneficialOwners.title')}</h3>
        {ownersFetch.loading && <Spinner />}
        <BeneficialOwnerList owners={ownersFetch.data || []} />
        <OwnershipSummary owners={ownersFetch.data || []} />
        <Link to={routeBuilders.organizationBeneficialOwners(id)}>
          <Button variant="ghost">{t('organization.beneficialOwners.title')}</Button>
        </Link>
      </Card>

      <Card>
        <h3>{t('navigation.kycCases')}</h3>
        {casesFetch.loading && <Spinner />}
        <KycCaseTimeline cases={casesFetch.data || []} />
      </Card>
    </PageLayout>
  );
}