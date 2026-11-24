/**
 * KYC documents section — per-requirement evidence upload.
 */
import { useTranslation } from 'react-i18next';

import { FileUpload } from '../../components/primitives/FileUpload.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { DOCUMENT_FIELDS } from '../configuration/fields.js';

export function DocumentsSection({ form, requirements = [] }) {
  const { t } = useTranslation();
  const reqOptions = requirements.map((r) => ({
    value: r.requirementCode,
    label: `${t(`kyc.requirements.${r.requirementCode}`)} ${r.required ? '*' : ''}`,
  }));

  return (
    <div>
      <Select
        label={t(DOCUMENT_FIELDS.requirementCode.i18nKey)}
        required
        options={reqOptions}
        {...form.getFieldProps('requirementCode')}
      />
      <FileUpload
        label={t(DOCUMENT_FIELDS.file.i18nKey)}
        required
        onChange={(file) => {
          form.setFieldValue('file', file);
          form.setFieldValue('originalFilename', file?.name || '');
        }}
        accept="application/pdf,image/jpeg,image/png"
      />
    </div>
  );
}