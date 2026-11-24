/**
 * Personal details section — first/last name + DOB.
 */
import { useTranslation } from 'react-i18next';

import { TextInput } from '../../components/primitives/TextInput.jsx';
import { DateInput } from '../../components/primitives/DateInput.jsx';
import { PERSONAL_FIELDS } from '../configuration/fields.js';

export function PersonalDetailsSection({ form }) {
  const { t } = useTranslation();
  return (
    <div>
      <TextInput
        label={t(PERSONAL_FIELDS.firstName.i18nKey)}
        required={PERSONAL_FIELDS.firstName.required}
        error={form.touched.firstName && form.errors.firstName}
        autoComplete={PERSONAL_FIELDS.firstName.autoComplete}
        maxLength={PERSONAL_FIELDS.firstName.maxLength}
        {...form.getFieldProps('firstName')}
      />
      <TextInput
        label={t(PERSONAL_FIELDS.lastName.i18nKey)}
        required={PERSONAL_FIELDS.lastName.required}
        error={form.touched.lastName && form.errors.lastName}
        autoComplete={PERSONAL_FIELDS.lastName.autoComplete}
        maxLength={PERSONAL_FIELDS.lastName.maxLength}
        {...form.getFieldProps('lastName')}
      />
      <DateInput
        label={t(PERSONAL_FIELDS.dateOfBirth.i18nKey)}
        error={form.touched.dateOfBirth && form.errors.dateOfBirth}
        {...form.getFieldProps('dateOfBirth')}
      />
    </div>
  );
}