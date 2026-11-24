/**
 * Form for creating/editing a KYC requirement.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '../primitives/Button.jsx';
import { TextInput } from '../primitives/Input.jsx';
import { Textarea } from '../primitives/Textarea.jsx';
import { Select } from '../primitives/Select.jsx';
import { Checkbox } from '../primitives/Checkbox.jsx';
import { Tag } from '../primitives/Tag.jsx';

const MIME_OPTIONS = ['application/pdf', 'image/jpeg', 'image/png'];

export function KycRequirementForm({ initial = {}, onSubmit, onCancel, busy = false }) {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    customerType: initial.customerType || 'COMPANY',
    documentType: initial.documentType || '',
    requirementCode: initial.requirementCode || '',
    description: initial.description || '',
    required: initial.required ?? true,
    enabled: initial.enabled ?? true,
    allowedMimeTypes: initial.allowedMimeTypes || MIME_OPTIONS,
    maxFileSizeBytes: initial.maxFileSizeBytes ?? 5242880,
    validityDays: initial.validityDays ?? 365,
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key, v) => setValues((prev) => ({ ...prev, [key]: v }));

  const toggleMime = (mime) => {
    setValues((prev) => ({
      ...prev,
      allowedMimeTypes: prev.allowedMimeTypes.includes(mime)
        ? prev.allowedMimeTypes.filter((m) => m !== mime)
        : [...prev.allowedMimeTypes, mime],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await onSubmit?.(values);
      if (result && result.ok === false) {
        setError(result.messages?.[0] || 'Save failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Select
        label={t('admin.kycRequirements.customerType', { defaultValue: 'Customer type' })}
        required
        options={[
          { value: 'COMPANY', label: 'Company' },
          { value: 'INDIVIDUAL', label: 'Individual' },
        ]}
        value={values.customerType}
        onChange={(e) => set('customerType', e.target.value)}
      />
      <TextInput
        label={t('admin.kycRequirements.documentType', { defaultValue: 'Document type' })}
        required
        value={values.documentType}
        onChange={(e) => set('documentType', e.target.value)}
      />
      <TextInput
        label={t('admin.kycRequirements.code', { defaultValue: 'Requirement code' })}
        required
        value={values.requirementCode}
        onChange={(e) => set('requirementCode', e.target.value.toUpperCase())}
      />
      <Textarea
        label={t('admin.kycRequirements.description', { defaultValue: 'Description' })}
        value={values.description}
        onChange={(e) => set('description', e.target.value)}
        rows={3}
      />
      <Checkbox
        label={t('admin.kycRequirements.required', { defaultValue: 'Required' })}
        checked={values.required}
        onChange={(v) => set('required', v)}
      />
      <Checkbox
        label={t('admin.kycRequirements.enabled', { defaultValue: 'Enabled' })}
        checked={values.enabled}
        onChange={(v) => set('enabled', v)}
      />
      <FieldLabel>
        {t('admin.kycRequirements.mimeTypes', { defaultValue: 'Allowed MIME types' })}
      </FieldLabel>
      <Tags>
        {MIME_OPTIONS.map((mime) => (
          <Tag
            key={mime}
            onRemove={
              values.allowedMimeTypes.includes(mime)
                ? () => toggleMime(mime)
                : undefined
            }
          >
            <label style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={values.allowedMimeTypes.includes(mime)}
                onChange={() => toggleMime(mime)}
                style={{ marginRight: 6 }}
              />
              {mime}
            </label>
          </Tag>
        ))}
      </Tags>
      <TextInput
        label={t('admin.kycRequirements.maxFileSize', { defaultValue: 'Max file size (bytes)' })}
        type="number"
        value={values.maxFileSizeBytes}
        onChange={(e) => set('maxFileSizeBytes', Number(e.target.value))}
      />
      <TextInput
        label={t('admin.kycRequirements.validityDays', { defaultValue: 'Validity (days)' })}
        type="number"
        value={values.validityDays}
        onChange={(e) => set('validityDays', Number(e.target.value))}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Actions>
        <Button variant="ghost" type="button" onClick={onCancel} disabled={busy || submitting}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={busy || submitting}>
          {submitting ? t('common.saving') : t('common.save')}
        </Button>
      </Actions>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 13px;
  margin-bottom: 8px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;