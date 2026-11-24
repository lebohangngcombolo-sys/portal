/**
 * Country picker driven by ConfigContext.
 *
 * Renders a Select with the currently enabled countries. If the config
 * hasn't loaded yet, renders a disabled select with a "loading" hint.
 */
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../contexts/ConfigContext.jsx';
import { Select } from '../primitives/Select.jsx';

export function CountrySelect({ value, onChange, label, error, required, ...rest }) {
  const { t } = useTranslation();
  const { countries, loaded } = useConfig();

  const options = countries.map((c) => ({
    value: c.iso2Code,
    label: `${c.name} (${c.iso2Code})`,
  }));

  return (
    <Select
      label={label || t('auth.register.country')}
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