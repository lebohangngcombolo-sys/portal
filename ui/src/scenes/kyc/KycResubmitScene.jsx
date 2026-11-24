/**
 * KYC resubmit scene — customer resubmits a case after an information
 * request. Uses the shared `KycResubmission` workflow.
 */
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedKycCase } from '../../contexts/KycCaseContext.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { KycProvider } from '../../providers/index.js';
import { KycResubmission } from '../../forms/workflows/KycResubmission.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Card } from '../../components/primitives/Card.jsx';

export default function KycResubmitScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { kycCase, requirements, loading } = useSelectedKycCase();

  const handleSubmit = useCallback(
    async ({ caseId, note }) => {
      const res = await KycProvider.resubmit(caseId);
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Resubmit failed');
        return res;
      }
      toast.success(t('kyc.resubmitSuccess', { defaultValue: 'Case resubmitted' }));
      navigate(routeBuilders.kycCaseDetail(caseId));
      return res;
    },
    [navigate, t, toast],
  );

  if (loading || !kycCase) {
    return <PageLayout><Spinner /></PageLayout>;
  }

  return (
    <PageLayout
      title={t('kyc.actions.resubmit')}
      subtitle={kycCase.caseNumber}
    >
      <Card>
        <KycResubmission
          caseId={id}
          requirements={requirements || []}
          onSubmit={handleSubmit}
          onCancel={() => navigate(routeBuilders.kycCaseDetail(id))}
        />
      </Card>
    </PageLayout>
  );
}