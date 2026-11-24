/**
 * Form for creating/editing a notification template.
 *
 * On edit, template code/channel/language are locked — editing creates
 * a new version server-side.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CHANNEL_CODES } from '../../common/constants/channels.js';
import { LANGUAGE_CODES } from '../../common/constants/languages.js';
import { Button } from '../primitives/Button.jsx';
import { TextInput } from '../primitives/Input.jsx';
import { Textarea } from '../primitives/Textarea.jsx';
import { Select } from '../primitives/Select.jsx';
import { Checkbox } from '../primitives/Checkbox.jsx';

export function NotificationTemplateForm({ initial = {}, isEdit = false, onSubmit, onCancel, busy = false }) {
  const { t } = useTranslation();
  const [values, setValues] = useState({
    templateCode: initial.templateCode || '',
    channel: initial.channel || 'EMAIL',
    languageCode: initial.languageCode || 'en',
    subjectTemplate: initial.subjectTemplate || '',
    bodyTemplate: initial.bodyTemplate || '',
    enabled: initial.enabled ?? true,
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key, v) => setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!values.templateCode || !values.bodyTemplate) {
      setError('Template code and body are required');
      return;
    }
    if (values.channel === 'EMAIL' && !values.subjectTemplate.trim()) {
      setError('Email templates require a subject');
      return;
    }
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
      <TextInput
        label={t('admin.templates.code', { defaultValue: 'Template code' })}
        required
        value={values.templateCode}
        onChange={(e) => set('templateCode', e.target.value)}
        disabled={isEdit}
      />
      <Select
        label={t('admin.templates.channel', { defaultValue: 'Channel' })}
        required
        options={CHANNEL_CODES.map((c) => ({ value: c, label: c }))}
        value={values.channel}
        onChange={(e) => set('channel', e.target.value)}
        disabled={isEdit}
      />
      <Select
        label={t('admin.templates.language', { defaultValue: 'Language' })}
        required
        options={LANGUAGE_CODES.map((c) => ({ value: c, label: c }))}
        value={values.languageCode}
        onChange={(e) => set('languageCode', e.target.value)}
        disabled={isEdit}
      />
      <TextInput
        label={t('admin.templates.subject', { defaultValue: 'Subject template' })}
        value={values.subjectTemplate}
        onChange={(e) => set('subjectTemplate', e.target.value)}
      />
      <Textarea
        label={t('admin.templates.body', { defaultValue: 'Body template' })}
        required
        value={values.bodyTemplate}
        onChange={(e) => set('bodyTemplate', e.target.value)}
        rows={8}
      />
      <Checkbox
        label={t('admin.templates.enabled', { defaultValue: 'Enabled' })}
        checked={values.enabled}
        onChange={(v) => set('enabled', v)}
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