/**
 * KYC review scene — analyst creates and completes review records.
 *
 * The analyst selects a review stage (INITIAL / SECONDARY / ENHANCED),
 * writes notes, and marks the review complete with an outcome
 * (APPROVED / REJECTED / NEEDS_INFO). The outcome is advisory — the actual
 * decision happens in the KycDecisionScene.
 */
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSelectedKycCase } from '../../contexts/KycCaseContext.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { KycProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { TextArea } from '../../components/primitives/Textarea.jsx';

const STAGE_OPTIONS = [
  { value: 'INITIAL', label: 'Initial review' },
  { value: 'SECONDARY', label: 'Secondary review' },
  { value: 'ENHANCED', label: 'Enhanced due diligence' },
];
const OUTCOME_OPTIONS = [
  { value: 'APPROVED', label: 'Approve (advisory)' },
  { value: 'REJECTED', label: 'Reject (advisory)' },
  { value: 'NEEDS_INFO', label: 'Needs more information' },
];

export default function KycReviewScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSessionUser();
  const { kycCase, loading } = useSelectedKycCase();
  const [stage, setStage] = useState('INITIAL');
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('APPROVED');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await KycProvider.createReview(id, { reviewStage: stage, notes });
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Failed');
        return;
      }
      toast.success(t('common.save'));
      navigate(routeBuilders.kycCaseDetail(id));
    } finally {
      setSubmitting(false);
    }
  }, [id, stage, notes, navigate, t, toast]);

  const handleCreateAndComplete = useCallback(async () => {
    setSubmitting(true);
    try {
      const createRes = await KycProvider.createReview(id, { reviewStage: stage, notes });
      if (!createRes.ok) {
        toast.error(createRes.messages?.[0] || 'Failed');
        return;
      }
      const reviewId = createRes.result.id;
      const completeRes = await KycProvider.completeReview(id, reviewId, {
        outcome,
        notes,
      });
      if (!completeRes.ok) {
        toast.error(completeRes.messages?.[0] || 'Failed');
        return;
      }
      toast.success(t('common.save'));
      navigate(routeBuilders.kycCaseDetail(id));
    } finally {
      setSubmitting(false);
    }
  }, [id, stage, notes, outcome, navigate, t, toast]);

  if (loading || !kycCase) {
    return <PageLayout><Spinner /></PageLayout>;
  }

  return (
    <PageLayout
      title={t('kyc.actions.review', { defaultValue: 'Review' })}
      subtitle={kycCase.caseNumber}
    >
      <Card>
        <Select
          label={t('kyc.review.stage', { defaultValue: 'Review stage' })}
          options={STAGE_OPTIONS}
          value={stage}
          onChange={setStage}
        />
        <TextArea
          label={t('kyc.review.notes', { defaultValue: 'Review notes' })}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          maxLength={2000}
        />
        <Select
          label={t('kyc.review.outcome', { defaultValue: 'Advisory outcome' })}
          options={OUTCOME_OPTIONS}
          value={outcome}
          onChange={setOutcome}
        />
        <div className="review-actions">
          <Link to={routeBuilders.kycCaseDetail(id)}>
            <Button variant="ghost">{t('common.cancel')}</Button>
          </Link>
          <Button variant="secondary" onClick={handleCreate} disabled={submitting}>
            {t('kyc.review.saveDraft', { defaultValue: 'Save draft' })}
          </Button>
          <Button variant="primary" onClick={handleCreateAndComplete} disabled={submitting}>
            {submitting ? t('common.submitting') : t('kyc.review.complete', { defaultValue: 'Complete' })}
          </Button>
        </div>
      </Card>
    </PageLayout>
  );
}