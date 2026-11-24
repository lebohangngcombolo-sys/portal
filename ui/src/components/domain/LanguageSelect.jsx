import { useTranslation } from 'react-i18next';

import { useConfig } from '../../contexts/ConfigContext.jsx';
import { Select } from '../primitives/Select.jsx';

export function LanguageSelect({ value, onChange, label, error, required, ...rest }) {
  const { t } = useTranslation();
  const { languages, loaded } = useConfig();

  const options = languages.map((l) => ({
    value: l.code,
    label: l.nativeName || l.name,
  }));

  return (
    <Select
      label={label || t('auth.register.language')}
      options={options}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      error={error}
      required={required}
      disabled={!loaded}
      {...rest}
    />
  );
}