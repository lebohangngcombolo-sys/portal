/**
 * Representative add/edit form. Rendered inside a Modal by the
 * RepresentativesScene. Receives an initial values object and calls
 * onSubmit(values) with the form data.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { representativeSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { Button } from '../primitives/Button.jsx';
import { TextInput } from '../primitives/Input.jsx';
import { PhoneInput } from '../primitives/PhoneInput.jsx';
import { Select } from '../primitives/Select.jsx';
import { Checkbox } from '../primitives/Checkbox.jsx';

const TYPE_OPTIONS = ['DIRECTOR', 'OFFICER', 'SHAREHOLDER', 'SIGNATORY', 'OTHER'];

export function RepresentativeForm({ initial = {}, onSubmit, onCancel, busy = false }) {
  const { t } = useTranslation();
  const [submitError, setSubmitError] = useState(null);

  const form = useForm({
    initialValues: {
      representativeType: initial.representativeType || 'DIRECTOR',
      repFirstName: initial.firstName || '',
      repLastName: initial.lastName || '',
      repEmail: initial.email || '',
      repPhoneNumber: initial.phoneNumber || '',
      repAuthorizedSignatory: initial.authorizedSignatory || false,
    },
    validationSchema: representativeSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const result = await onSubmit?.(values);
        if (result && result.ok === false) {
          setSubmitError(result.messages?.[0] || 'Save failed');
        }
      } catch (err) {
        setSubmitError(err.message || 'Save failed');
      }
    },
  });

  const typeOptions = TYPE_OPTIONS.map((type) => ({
    value: type,
    label: t(`organization.representatives.types.${type}`, { defaultValue: type }),
  }));

  return (
    <Form onSubmit={form.handleSubmit} noValidate>
      <Select
        label={t('organization.representatives.type', { defaultValue: 'Role' })}
        required
        options={typeOptions}
        error={form.touched.representativeType && form.errors.representativeType}
        {...form.getFieldProps('representativeType')}
      />
      <TextInput
        label={t('organization.representatives.firstName', { defaultValue: 'First name' })}
        required
        error={form.touched.repFirstName && form.errors.repFirstName}
        {...form.getFieldProps('repFirstName')}
      />
      <TextInput
        label={t('organization.representatives.lastName', { defaultValue: 'Last name' })}
        required
        error={form.touched.repLastName && form.errors.repLastName}
        {...form.getFieldProps('repLastName')}
      />
      <TextInput
        label={t('organization.representatives.email', { defaultValue: 'Email' })}
        type="email"
        required
        error={form.touched.repEmail && form.errors.repEmail}
        {...form.getFieldProps('repEmail')}
      />
      <PhoneInput
        label={t('organization.representatives.phoneNumber', { defaultValue: 'Phone' })}
        error={form.touched.repPhoneNumber && form.errors.repPhoneNumber}
        {...form.getFieldProps('repPhoneNumber')}
      />
      <Checkbox
        label={t('organization.representatives.signatoryLabel', { defaultValue: 'Authorized signatory' })}
        checked={form.values.repAuthorizedSignatory}
        onChange={(v) => form.setFieldValue('repAuthorizedSignatory', v)}
      />
      {submitError && <ErrorText>{submitError}</ErrorText>}
      <Actions>
        <Button variant="ghost" type="button" onClick={onCancel} disabled={busy}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={busy || form.isSubmitting}>
          {busy || form.isSubmitting ? t('common.saving') : t('common.save')}
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