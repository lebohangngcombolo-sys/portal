/**
 * Representative editor — add/remove representatives on an organization.
 * Repeated inline for editing workflows; card list for view workflows.
 */
import { useTranslation } from 'react-i18next';

import { TextInput } from '../../components/primitives/TextInput.jsx';
import { PhoneInput } from '../../components/primitives/PhoneInput.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { Checkbox } from '../../components/primitives/Checkbox.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { REPRESENTATIVE_FIELDS } from '../configuration/fields.js';

const REPRESENTATIVE_TYPES = [
  { value: 'DIRECTOR', i18nKey: 'organization.representatives.types.DIRECTOR' },
  { value: 'OFFICER', i18nKey: 'organization.representatives.types.OFFICER' },
  { value: 'SHAREHOLDER', i18nKey: 'organization.representatives.types.SHAREHOLDER' },
  { value: 'SIGNATORY', i18nKey: 'organization.representatives.types.SIGNATORY' },
  { value: 'OTHER', i18nKey: 'organization.representatives.types.OTHER' },
];

export function RepresentativeSection({ form, index, onRemove, isOnly = false }) {
  const { t } = useTranslation();
  const typeOptions = REPRESENTATIVE_TYPES.map((o) => ({
    value: o.value,
    label: t(o.i18nKey),
  }));

  return (
    <div className="representative-editor">
      <h4>
        {t('organization.representatives.title')} #{index + 1}
      </h4>
      <Select
        label={t(REPRESENTATIVE_FIELDS.representativeType.i18nKey)}
        required
        options={typeOptions}
        {...form.getFieldProps(`representatives[${index}].representativeType`)}
      />
      <TextInput
        label={t(REPRESENTATIVE_FIELDS.repFirstName.i18nKey)}
        required
        {...form.getFieldProps(`representatives[${index}].repFirstName`)}
      />
      <TextInput
        label={t(REPRESENTATIVE_FIELDS.repLastName.i18nKey)}
        required
        {...form.getFieldProps(`representatives[${index}].repLastName`)}
      />
      <TextInput
        label={t(REPRESENTATIVE_FIELDS.repEmail.i18nKey)}
        required
        type="email"
        {...form.getFieldProps(`representatives[${index}].repEmail`)}
      />
      <PhoneInput
        label={t(REPRESENTATIVE_FIELDS.repPhoneNumber.i18nKey)}
        {...form.getFieldProps(`representatives[${index}].repPhoneNumber`)}
      />
      <Checkbox
        label={t(REPRESENTATIVE_FIELDS.repAuthorizedSignatory.i18nKey)}
        checked={form.values.representatives?.[index]?.repAuthorizedSignatory || false}
        onChange={(checked) =>
          form.setFieldValue(`representatives[${index}].repAuthorizedSignatory`, checked)
        }
      />
      {!isOnly && (
        <Button variant="ghost" onClick={() => onRemove?.(index)}>
          {t('common.remove')}
        </Button>
      )}
    </div>
  );
}