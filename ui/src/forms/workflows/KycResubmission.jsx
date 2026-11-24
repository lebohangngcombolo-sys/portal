/**
 * KYC resubmission workflow — upload additional evidence after an
 * information request and resubmit the case.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '../../contexts/ToastContext.jsx';
import { DocumentsSection } from '../sections/DocumentsSection.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { TextArea } from '../../components/primitives/Textarea.jsx';

export function KycResubmission({ caseId, requirements = [], onSubmit, onCancel }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await onSubmit?.({ caseId, note });
      if (!result?.ok) toast.error(result?.messages?.[0] || t('errors.unexpected'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3>{t('kyc.actions.resubmit')}</h3>
      <p>{t('kyc.resubmitSubtitle')}</p>

      {/* Evidence uploader — a separate component manages file upload per requirement */}
      <DocumentsSection
        form={{
          values: {},
          errors: {},
          touched: {},
          getFieldProps: () => ({}),
          setFieldValue: () => {},
        }}
        requirements={requirements}
      />

      <TextArea
        label={t('kyc.resubmitNote')}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        maxLength={2000}
      />

      <div>
        {onCancel && <Button variant="ghost" onClick={onCancel}>{t('common.cancel')}</Button>}
        <Button onClick={handleSubmit} disabled={submitting}>
          {t('kyc.actions.resubmit')}
        </Button>
      </div>
    </div>
  );
}