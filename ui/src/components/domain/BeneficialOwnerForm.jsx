/**
 * Beneficial owner add/edit form.
 *
 * Conditional logic: DIRECT and INDIRECT require an ownership percentage.
 * Others (CONTROL, TRUST, NOMINEE) do not.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { beneficialOwnerSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { useConfig } from '../../contexts/ConfigContext.jsx';
import { Button } from '../primitives/Button.jsx';
import { TextInput } from '../primitives/Input.jsx';
import { Select } from '../primitives/Select.jsx';
import { DatePicker } from '../primitives/DatePicker.jsx';

const CONTROL_TYPES = ['DIRECT', 'INDIRECT', 'CONTROL', 'TRUST', 'NOMINEE'];

export function BeneficialOwnerForm({ initial = {}, onSubmit, onCancel, busy = false }) {
  const { t } = useTranslation();
  const config = useConfig();
  const [submitError, setSubmitError] = useState(null);

  const form = useForm({
    initialValues: {
      ownerFirstName: initial.firstName || '',
      ownerLastName: initial.lastName || '',
      ownerDateOfBirth: initial.dateOfBirth || '',
      ownerNationalityCountryCode: initial.nationalityCountryCode || '',
      ownerResidenceCountryCode: initial.residenceCountryCode || '',
      ownershipPercentage:
        initial.ownershipPercentage !== null ? String(initial.ownershipPercentage) : '',
      controlType: initial.controlType || 'DIRECT',
      identityReference: '',
    },
    validationSchema: beneficialOwnerSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      try {
        const result = await onSubmit?.({
          firstName: values.ownerFirstName,
          lastName: values.ownerLastName,
          dateOfBirth: values.ownerDateOfBirth || null,
          nationalityCountryCode: values.ownerNationalityCountryCode || null,
          residenceCountryCode: values.ownerResidenceCountryCode || null,
          ownershipPercentage:
            values.ownershipPercentage === '' ? null : Number(values.ownershipPercentage),
          controlType: values.controlType,
          identityReference: values.identityReference || null,
        });
        if (result && result.ok === false) {
          setSubmitError(result.messages?.[0] || 'Save failed');
        }
      } catch (err) {
        setSubmitError(err.message || 'Save failed');
      }
    },
  });

  const controlTypeOptions = CONTROL_TYPES.map((type) => ({
    value: type,
    label: t(`organization.beneficialOwners.controlTypes.${type}`, { defaultValue: type }),
  }));
  const countryOptions = config.countries.map((c) => ({ value: c.iso2Code, label: c.name }));
  const needsPercentage =
    form.values.controlType === 'DIRECT' || form.values.controlType === 'INDIRECT';

  return (
    <Form onSubmit={form.handleSubmit} noValidate>
      <TextInput
        label={t('organization.beneficialOwners.fields.firstName')}
        required
        error={form.touched.ownerFirstName && form.errors.ownerFirstName}
        {...form.getFieldProps('ownerFirstName')}
      />
      <TextInput
        label={t('organization.beneficialOwners.fields.lastName')}
        required
        error={form.touched.ownerLastName && form.errors.ownerLastName}
        {...form.getFieldProps('ownerLastName')}
      />
      <DatePicker
        label={t('organization.beneficialOwners.fields.dateOfBirth')}
        error={form.touched.ownerDateOfBirth && form.errors.ownerDateOfBirth}
        {...form.getFieldProps('ownerDateOfBirth')}
      />
      <Select
        label={t('organization.beneficialOwners.fields.nationality')}
        options={countryOptions}
        error={form.touched.ownerNationalityCountryCode && form.errors.ownerNationalityCountryCode}
        {...form.getFieldProps('ownerNationalityCountryCode')}
      />
      <Select
        label={t('organization.beneficialOwners.fields.residence')}
        options={countryOptions}
        error={form.touched.ownerResidenceCountryCode && form.errors.ownerResidenceCountryCode}
        {...form.getFieldProps('ownerResidenceCountryCode')}
      />
      <Select
        label={t('organization.beneficialOwners.fields.controlType')}
        required
        options={controlTypeOptions}
        error={form.touched.controlType && form.errors.controlType}
        {...form.getFieldProps('controlType')}
      />
      {needsPercentage && (
        <TextInput
          label={t('organization.beneficialOwners.fields.ownershipPercentage')}
          type="number"
          min={0}
          max={100}
          step={0.01}
          required
          error={form.touched.ownershipPercentage && form.errors.ownershipPercentage}
          {...form.getFieldProps('ownershipPercentage')}
        />
      )}
      <TextInput
        label={t('organization.beneficialOwners.fields.identityReference', {
          defaultValue: 'Identity reference (optional)',
        })}
        error={form.touched.identityReference && form.errors.identityReference}
        {...form.getFieldProps('identityReference')}
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