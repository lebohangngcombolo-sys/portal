/**
 * Contact details section — email, phone, country, language.
 */
import { useTranslation } from 'react-i18next';

import { TextInput } from '../../components/primitives/TextInput.jsx';
import { PhoneInput } from '../../components/primitives/PhoneInput.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { CONTACT_FIELDS } from '../configuration/fields.js';
import { useConfig } from '../../contexts/ConfigContext.jsx';
import { languageNativeName } from '../../common/constants/languages.js';

export function ContactDetailsSection({ form }) {
  const { t } = useTranslation();
  const config = useConfig();

  const countryOptions = config.countries.map((c) => ({
    value: c.iso2Code,
    label: c.name,
  }));
  const languageOptions = config.languages.map((l) => ({
    value: l.code,
    label: l.nativeName || languageNativeName(l.code),
  }));

  return (
    <div>
      <TextInput
        label={t(CONTACT_FIELDS.email.i18nKey)}
        required
        type="email"
        autoComplete="email"
        error={form.touched.email && form.errors.email}
        {...form.getFieldProps('email')}
      />
      <PhoneInput
        label={t(CONTACT_FIELDS.phoneNumber.i18nKey)}
        required
        error={form.touched.phoneNumber && form.errors.phoneNumber}
        {...form.getFieldProps('phoneNumber')}
      />
      <Select
        label={t(CONTACT_FIELDS.countryCode.i18nKey)}
        required
        options={countryOptions}
        error={form.touched.countryCode && form.errors.countryCode}
        {...form.getFieldProps('countryCode')}
      />
      <Select
        label={t(CONTACT_FIELDS.preferredLanguage.i18nKey)}
        required
        options={languageOptions}
        error={form.touched.preferredLanguage && form.errors.preferredLanguage}
        {...form.getFieldProps('preferredLanguage')}
      />
    </div>
  );
}