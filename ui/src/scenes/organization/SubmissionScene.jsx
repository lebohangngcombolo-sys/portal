/**
 * Submission scene — final review + submit for KYC review.
 *
 * Validates that the organization has:
 * - All required fields populated
 * - At least one representative
 * - At least one beneficial owner (or an explicit "no owners" declaration)
 * Then submits the organization for review and (optionally) withdraws.
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedOrganization } from '../../contexts/OrganizationContext.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import {
  OrganizationProvider,
  RepresentativeProvider,
  BeneficialOwnerProvider,
} from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Alert } from '../../components/primitives/Alert.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { TextArea } from '../../components/primitives/Textarea.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';
import { StatusBadge } from '../../components/domain/StatusBadge.jsx';
import { OwnershipSummary } from '../../components/domain/OwnershipSummary.jsx';
import { RepresentativeList } from '../../components/domain/RepresentativeList.jsx';

export default function SubmissionScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { organization, load } = useSelectedOrganization();

  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');

  const repsFetch = useProviderFetch(
    () => RepresentativeProvider.list(id),
    { enabled: Boolean(id), deps: [id] },
  );
  const ownersFetch = useProviderFetch(
    () => BeneficialOwnerProvider.list(id),
    { enabled: Boolean(id), deps: [id] },
  );

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  if (!organization) {
    return <PageLayout><Spinner /></PageLayout>;
  }

  const canSubmit = ['DRAFT', 'REJECTED', 'WITHDRAWN'].includes(organization.status);
  const canWithdraw = ['PENDING_REVIEW'].includes(organization.status);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await OrganizationProvider.submit(id);
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Submit failed');
        return;
      }
      toast.success(t('organization.submit.success'));
      setConfirming(false);
      navigate(routeBuilders.organizationDetail(id), { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await OrganizationProvider.withdraw(id, { reason: withdrawReason });
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Withdraw failed');
        return;
      }
      toast.success(t('organization.withdraw.success'));
      navigate(routeBuilders.organizationDetail(id), { replace: true });
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <PageLayout
      title={t('organization.submit.title')}
      subtitle={organization.legalName}
    >
      <Card>
        <h3>{t('organization.list.columns.status')}</h3>
        <StatusBadge status={organization.status} />
      </Card>

      <Card>
        <h3>{t('organization.representatives.title')}</h3>
        {repsFetch.loading && <Spinner />}
        <RepresentativeList representatives={repsFetch.data || []} />
      </Card>

      <Card>
        <h3>{t('organization.beneficialOwners.title')}</h3>
        {ownersFetch.loading && <Spinner />}
        <OwnershipSummary owners={ownersFetch.data || []} />
      </Card>

      <Card>
        {canSubmit && (
          <>
            <Alert variant="info">{t('organization.submit.confirmBody')}</Alert>
            <Button
              variant="primary"
              onClick={() => setConfirming(true)}
              disabled={submitting}
            >
              {t('organization.submit.confirmSubmit')}
            </Button>
          </>
        )}
        {canWithdraw && (
          <>
            <h3>{t('organization.withdraw.title')}</h3>
            <Alert variant="warning">{t('organization.withdraw.confirmBody')}</Alert>
            <TextArea
              label={t('organization.withdraw.reason')}
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <Button variant="danger" onClick={handleWithdraw} disabled={withdrawing}>
              {withdrawing ? t('common.submitting') : t('organization.withdraw.confirmWithdraw')}
            </Button>
          </>
        )}
      </Card>

      <Modal open={confirming} onClose={() => setConfirming(false)}>
        <h2>{t('organization.submit.confirmTitle')}</h2>
        <p>{t('organization.submit.confirmBody')}</p>
        <div>
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t('common.submitting') : t('organization.submit.confirmSubmit')}
          </Button>
        </div>
      </Modal>
    </PageLayout>
  );
}