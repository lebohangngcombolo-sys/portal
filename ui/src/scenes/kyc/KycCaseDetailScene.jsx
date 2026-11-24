/**
 * KYC case detail scene — analyst view.
 *
 * Shows the case metadata, current status, risk level, review history,
 * decisions, and evidence. Provides contextual actions (assign, review,
 * request info, decide) based on the case's status and the analyst's
 * role.
 */
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import {
  canAnalystDecideCase,
  canAnalystReviewCase,
  requiresSecondReviewer,
} from '../../common/business/kycRules.js';
import { formatDate, formatDateTime } from '../../common/utils/date.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedKycCase } from '../../contexts/KycCaseContext.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { usePermissions } from '../../hooks/usePermissions.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { KycProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { StatusBadge } from '../../components/domain/StatusBadge.jsx';
import { KycCaseTimeline } from '../../components/domain/KycCaseTimeline.jsx';
import { KycDocumentList } from '../../components/domain/KycDocumentList.jsx';
import { KycDecisionHistory } from '../../components/domain/KycDecisionHistory.jsx';
import { RequirementChecklist } from '../../components/domain/RequirementChecklist.jsx';

export default function KycCaseDetailScene() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useSessionUser();
  const { can } = usePermissions();
  const { kycCase, requirements, decisions, loading, load } = useSelectedKycCase();

  const { data: documents, loading: docsLoading } = useProviderFetch(
    () => KycProvider.listDocuments(id),
    { enabled: Boolean(id), deps: [id] },
  );
  const { data: reviews, loading: reviewsLoading } = useProviderFetch(
    () => KycProvider.listReviews(id),
    { enabled: Boolean(id), deps: [id] },
  );

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  if (loading || !kycCase) {
    return <PageLayout><Spinner /></PageLayout>;
  }

  const canDecide = can('kyc.case.approve') && canAnalystDecideCase(kycCase);
  const canReview = can('kyc.case.review') && canAnalystReviewCase(kycCase);
  const needsSecondReviewer = requiresSecondReviewer(kycCase);

  return (
    <PageLayout
      title={`${kycCase.caseNumber}`}
      subtitle={t(`kyc.caseType.${kycCase.caseType}`, { defaultValue: kycCase.caseType })}
      actions={
        <>
          {canReview && (
            <Link to={routeBuilders.kycCaseReview(id)}>
              <Button variant="secondary">{t('kyc.actions.review', { defaultValue: 'Review' })}</Button>
            </Link>
          )}
          {canDecide && (
            <Link to={routeBuilders.kycCaseDecision(id)}>
              <Button variant="primary">{t('kyc.actions.decide', { defaultValue: 'Decide' })}</Button>
            </Link>
          )}
        </>
      }
    >
      <Card>
        <dl>
          <dt>{t('kyc.columns.status')}</dt>
          <dd><StatusBadge status={kycCase.status} /></dd>
          <dt>{t('kyc.columns.risk')}</dt>
          <dd>{kycCase.riskLevel ? t(`kyc.riskLevels.${kycCase.riskLevel}`) : '—'}</dd>
          <dt>{t('kyc.columns.assignedReviewer', { defaultValue: 'Assigned reviewer' })}</dt>
          <dd>{kycCase.assignedReviewerId || '—'}</dd>
          <dt>{t('kyc.columns.submitted')}</dt>
          <dd>
            {kycCase.submittedAt
              ? formatDateTime(kycCase.submittedAt, i18n.language)
              : '—'}
          </dd>
          <dt>{t('kyc.columns.configVersion', { defaultValue: 'Configuration version' })}</dt>
          <dd>{kycCase.countryConfigurationVersion}</dd>
          {needsSecondReviewer && (
            <dt>{t('kyc.secondReviewer', { defaultValue: 'Second reviewer required' })}</dt>
          )}
        </dl>
      </Card>

      <Card>
        <h3>{t('kyc.requirements.title', { defaultValue: 'Required evidence' })}</h3>
        <RequirementChecklist requirements={requirements} />
      </Card>

      <Card>
        <h3>{t('kyc.documents.title', { defaultValue: 'Evidence' })}</h3>
        {docsLoading && <Spinner />}
        <KycDocumentList documents={documents || []} />
      </Card>

      <Card>
        <h3>{t('kyc.reviews.title', { defaultValue: 'Reviews' })}</h3>
        {reviewsLoading && <Spinner />}
        <KycCaseTimeline cases={reviews || []} />
      </Card>

      <Card>
        <h3>{t('kyc.decisions.title', { defaultValue: 'Decisions' })}</h3>
        <KycDecisionHistory decisions={decisions || []} />
      </Card>
    </PageLayout>
  );
}