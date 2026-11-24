/**
 * Company details section — legal name, registration, description.
 */
import { useTranslation } from 'react-i18next';

import { TextInput } from '../../components/primitives/TextInput.jsx';
import { TextArea } from '../../components/primitives/Textarea.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { DateInput } from '../../components/primitives/DateInput.jsx';
import { COMPANY_FIELDS } from '../configuration/fields.js';

const ORGANIZATION_TYPES = [
  { value: 'COMPANY', i18nKey: 'organization.create.organizationTypes.COMPANY' },
  { value: 'SOLE_PROPRIETOR', i18nKey: 'organization.create.organizationTypes.SOLE_PROPRIETOR' },
  { value: 'PARTNERSHIP', i18nKey: 'organization.create.organizationTypes.PARTNERSHIP' },
  { value: 'NONPROFIT', i18nKey: 'organization.create.organizationTypes.NONPROFIT' },
  { value: 'OTHER', i18nKey: 'organization.create.organizationTypes.OTHER' },
];

export function CompanyDetailsSection({ form }) {
  const { t } = useTranslation();
  const orgTypeOptions = ORGANIZATION_TYPES.map((o) => ({
    value: o.value,
    label: t(o.i18nKey),
  }));

  return (
    <div>
      <TextInput
        label={t(COMPANY_FIELDS.legalName.i18nKey)}
        required
        error={form.touched.legalName && form.errors.legalName}
        maxLength={COMPANY_FIELDS.legalName.maxLength}
        {...form.getFieldProps('legalName')}
      />
      <TextInput
        label={t(COMPANY_FIELDS.tradingName.i18nKey)}
        error={form.touched.tradingName && form.errors.tradingName}
        maxLength={COMPANY_FIELDS.tradingName.maxLength}
        {...form.getFieldProps('tradingName')}
      />
      <Select
        label={t(COMPANY_FIELDS.organizationType.i18nKey)}
        required
        options={orgTypeOptions}
        error={form.touched.organizationType && form.errors.organizationType}
        {...form.getFieldProps('organizationType')}
      />
      <TextInput
        label={t(COMPANY_FIELDS.registrationNumber.i18nKey)}
        required
        error={form.touched.registrationNumber && form.errors.registrationNumber}
        maxLength={COMPANY_FIELDS.registrationNumber.maxLength}
        {...form.getFieldProps('registrationNumber')}
      />
      <TextInput
        label={t(COMPANY_FIELDS.taxNumber.i18nKey)}
        error={form.touched.taxNumber && form.errors.taxNumber}
        maxLength={COMPANY_FIELDS.taxNumber.maxLength}
        {...form.getFieldProps('taxNumber')}
      />
      <DateInput
        label={t(COMPANY_FIELDS.incorporationDate.i18nKey)}
        error={form.touched.incorporationDate && form.errors.incorporationDate}
        {...form.getFieldProps('incorporationDate')}
      />
      <TextInput
        label={t(COMPANY_FIELDS.registrationAuthority.i18nKey)}
        error={form.touched.registrationAuthority && form.errors.registrationAuthority}
        maxLength={COMPANY_FIELDS.registrationAuthority.maxLength}
        {...form.getFieldProps('registrationAuthority')}
      />
      <TextArea
        label={t(COMPANY_FIELDS.businessDescription.i18nKey)}
        maxLength={COMPANY_FIELDS.businessDescription.maxLength}
        rows={4}
        {...form.getFieldProps('businessDescription')}
      />
      <TextInput
        label={t(COMPANY_FIELDS.website.i18nKey)}
        type="url"
        error={form.touched.website && form.errors.website}
        maxLength={COMPANY_FIELDS.website.maxLength}
        {...form.getFieldProps('website')}
      />
    </div>
  );
}