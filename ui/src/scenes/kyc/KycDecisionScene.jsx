/**
 * KYC decision scene — approve or reject the case.
 *
 * Approve: optional note. Reject: mandatory reason code and reason text.
 * Enforces separation of duties server-side; the UI shows a clear error
 * if that rule is hit.
 */
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedKycCase } from '../../contexts/KycCaseContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { KycProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { TextArea } from '../../components/primitives/Textarea.jsx';
import { Alert } from '../../components/primitives/Alert.jsx';

const REJECT_REASON_CODES = [
  { value: 'INCOMPLETE_EVIDENCE', label: 'Incomplete evidence' },
  { value: 'SANCTIONS_HIT', label: 'Sanctions match' },
  { value: 'HIGH_RISK_UNMITIGATED', label: 'High risk without mitigation' },
  { value: 'FRAUD_INDICATOR', label: 'Fraud indicator' },
  { value: 'OTHER', label: 'Other (explain below)' },
];

export default function KycDecisionScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { kycCase, loading } = useSelectedKycCase();

  const [action, setAction] = useState('approve');
  const [note, setNote] = useState('');
  const [reasonCode, setReasonCode] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && kycCase?.status && !['IN_REVIEW', 'RESUBMITTED'].includes(kycCase.status)) {
      setError(t('kyc.decision.invalidStatus', { defaultValue: 'Case is not awaiting a decision.' }));
    }
  }, [loading, kycCase, t]);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res =
        action === 'approve'
          ? await KycProvider.approve(id, { note })
          : await KycProvider.reject(id, { reasonCode, reason });
      if (!res.ok) {
        setError(res.messages?.[0] || 'Failed');
        return;
      }
      toast.success(
        action === 'approve'
          ? t('kyc.decision.approvedSuccess', { defaultValue: 'Case approved' })
          : t('kyc.decision.rejectedSuccess', { defaultValue: 'Case rejected' }),
      );
      navigate(routeBuilders.kycCaseDetail(id), { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !kycCase) {
    return <PageLayout><Spinner /></PageLayout>;
  }

  const canSubmit =
    !submitting &&
    (action === 'approve' || (reasonCode && reason.trim().length > 0));

  return (
    <PageLayout
      title={t('kyc.actions.decide', { defaultValue: 'Decision' })}
      subtitle={kycCase.caseNumber}
    >
      <Card>
        {error && <Alert variant="error">{error}</Alert>}

        <div className="decision-tabs">
          <button
            className={action === 'approve' ? 'active' : ''}
            onClick={() => setAction('approve')}
          >
            {t('kyc.actions.approve')}
          </button>
          <button
            className={action === 'reject' ? 'active' : ''}
            onClick={() => setAction('reject')}
          >
            {t('kyc.actions.reject')}
          </button>
        </div>

        {action === 'approve' && (
          <TextArea
            label={t('kyc.decision.note', { defaultValue: 'Note (optional)' })}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={2000}
          />
        )}

        {action === 'reject' && (
          <>
            <Select
              label={t('kyc.decision.reasonCode', { defaultValue: 'Reason code' })}
              options={REJECT_REASON_CODES}
              value={reasonCode}
              onChange={setReasonCode}
            />
            <TextArea
              label={t('kyc.decision.reason', { defaultValue: 'Reason' })}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              maxLength={2000}
            />
          </>
        )}

        <div className="decision-actions">
          <Link to={routeBuilders.kycCaseDetail(id)}>
            <Button variant="ghost">{t('common.cancel')}</Button>
          </Link>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? t('common.submitting') : t('common.submit')}
          </Button>
        </div>
      </Card>
    </PageLayout>
  );
}