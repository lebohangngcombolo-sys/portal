/**
 * Company address section.
 */
import { useTranslation } from 'react-i18next';

import { TextInput } from '../../components/primitives/TextInput.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { ADDRESS_FIELDS } from '../configuration/fields.js';
import { useConfig } from '../../contexts/ConfigContext.jsx';

export function CompanyAddressSection({ form }) {
  const { t } = useTranslation();
  const config = useConfig();
  const countryOptions = config.countries.map((c) => ({
    value: c.iso2Code,
    label: c.name,
  }));

  return (
    <div>
      <TextInput
        label={t(ADDRESS_FIELDS.addressLine1.i18nKey)}
        required
        error={form.touched.addressLine1 && form.errors.addressLine1}
        maxLength={ADDRESS_FIELDS.addressLine1.maxLength}
        autoComplete="address-line1"
        {...form.getFieldProps('addressLine1')}
      />
      <TextInput
        label={t(ADDRESS_FIELDS.addressLine2.i18nKey)}
        maxLength={ADDRESS_FIELDS.addressLine2.maxLength}
        autoComplete="address-line2"
        {...form.getFieldProps('addressLine2')}
      />
      <TextInput
        label={t(ADDRESS_FIELDS.city.i18nKey)}
        required
        error={form.touched.city && form.errors.city}
        maxLength={ADDRESS_FIELDS.city.maxLength}
        autoComplete="address-level2"
        {...form.getFieldProps('city')}
      />
      <TextInput
        label={t(ADDRESS_FIELDS.region.i18nKey)}
        maxLength={ADDRESS_FIELDS.region.maxLength}
        autoComplete="address-level1"
        {...form.getFieldProps('region')}
      />
      <TextInput
        label={t(ADDRESS_FIELDS.postalCode.i18nKey)}
        maxLength={ADDRESS_FIELDS.postalCode.maxLength}
        autoComplete="postal-code"
        {...form.getFieldProps('postalCode')}
      />
      <Select
        label={t(ADDRESS_FIELDS.addressCountryCode.i18nKey)}
        required
        options={countryOptions}
        error={form.touched.addressCountryCode && form.errors.addressCountryCode}
        {...form.getFieldProps('addressCountryCode')}
      />
    </div>
  );
}