/**
 * Beneficial owner editor + aggregate summary.
 */
import { useTranslation } from 'react-i18next';

import { TextInput } from '../../components/primitives/TextInput.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { DateInput } from '../../components/primitives/DateInput.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { BENEFICIAL_OWNER_FIELDS } from '../configuration/fields.js';
import { useConfig } from '../../contexts/ConfigContext.jsx';
import { OwnershipSummary } from '../../components/domain/OwnershipSummary.jsx';

const CONTROL_TYPES = [
  { value: 'DIRECT', i18nKey: 'organization.beneficialOwners.controlTypes.DIRECT' },
  { value: 'INDIRECT', i18nKey: 'organization.beneficialOwners.controlTypes.INDIRECT' },
  { value: 'CONTROL', i18nKey: 'organization.beneficialOwners.controlTypes.CONTROL' },
  { value: 'TRUST', i18nKey: 'organization.beneficialOwners.controlTypes.TRUST' },
  { value: 'NOMINEE', i18nKey: 'organization.beneficialOwners.controlTypes.NOMINEE' },
];

export function BeneficialOwnershipSection({ form, index, onRemove, isOnly = false }) {
  const { t } = useTranslation();
  const config = useConfig();
  const countryOptions = config.countries.map((c) => ({ value: c.iso2Code, label: c.name }));
  const controlOptions = CONTROL_TYPES.map((o) => ({ value: o.value, label: t(o.i18nKey) }));
  const path = (field) => `beneficialOwners[${index}].${field}`;
  const values = form.values.beneficialOwners?.[index] || {};

  return (
    <div className="beneficial-owner-editor">
      <h4>
        {t('organization.beneficialOwners.title')} #{index + 1}
      </h4>
      <TextInput
        label={t(BENEFICIAL_OWNER_FIELDS.ownerFirstName.i18nKey)}
        required
        {...form.getFieldProps(path('ownerFirstName'))}
      />
      <TextInput
        label={t(BENEFICIAL_OWNER_FIELDS.ownerLastName.i18nKey)}
        required
        {...form.getFieldProps(path('ownerLastName'))}
      />
      <DateInput
        label={t(BENEFICIAL_OWNER_FIELDS.ownerDateOfBirth.i18nKey)}
        {...form.getFieldProps(path('ownerDateOfBirth'))}
      />
      <Select
        label={t(BENEFICIAL_OWNER_FIELDS.ownerNationalityCountryCode.i18nKey)}
        options={countryOptions}
        {...form.getFieldProps(path('ownerNationalityCountryCode'))}
      />
      <Select
        label={t(BENEFICIAL_OWNER_FIELDS.ownerResidenceCountryCode.i18nKey)}
        options={countryOptions}
        {...form.getFieldProps(path('ownerResidenceCountryCode'))}
      />
      <Select
        label={t(BENEFICIAL_OWNER_FIELDS.controlType.i18nKey)}
        required
        options={controlOptions}
        {...form.getFieldProps(path('controlType'))}
      />
      {(values.controlType === 'DIRECT' || values.controlType === 'INDIRECT') && (
        <TextInput
          label={t(BENEFICIAL_OWNER_FIELDS.ownershipPercentage.i18nKey)}
          type="number"
          min={0}
          max={100}
          step={0.01}
          required
          {...form.getFieldProps(path('ownershipPercentage'))}
        />
      )}
      <TextInput
        label={t(BENEFICIAL_OWNER_FIELDS.identityReference.i18nKey)}
        {...form.getFieldProps(path('identityReference'))}
      />
      {!isOnly && (
        <Button variant="ghost" onClick={() => onRemove?.(index)}>
          {t('common.remove')}
        </Button>
      )}
    </div>
  );
}

/**
 * Aggregate summary — reads from the parent form via a resolver prop.
 */
export function BeneficialOwnershipSummary({ owners }) {
  return <OwnershipSummary owners={owners} />;
}