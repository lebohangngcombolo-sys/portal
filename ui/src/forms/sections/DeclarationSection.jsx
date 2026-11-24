/**
 * Ownership declaration section.
 */
import { useTranslation } from 'react-i18next';

import { TextArea } from '../../components/primitives/Textarea.jsx';
import { Checkbox } from '../../components/primitives/Checkbox.jsx';
import { DECLARATION_FIELDS } from '../configuration/fields.js';

export function DeclarationSection({ form, belowThreshold = false }) {
  const { t } = useTranslation();
  return (
    <div>
      <p>{t('organization.beneficialOwners.declaration.subtitle')}</p>
      <TextArea
        label={t(DECLARATION_FIELDS.declaration.i18nKey)}
        required
        rows={3}
        maxLength={DECLARATION_FIELDS.declaration.maxLength}
        error={form.touched.declaration && form.errors.declaration}
        {...form.getFieldProps('declaration')}
      />
      {belowThreshold && (
        <Checkbox
          label={t(DECLARATION_FIELDS.noBeneficialOwnersAboveThreshold.i18nKey)}
          checked={form.values.noBeneficialOwnersAboveThreshold || false}
          onChange={(checked) => form.setFieldValue('noBeneficialOwnersAboveThreshold', checked)}
        />
      )}
    </div>
  );
}