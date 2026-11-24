/**
 * Configuration context — countries, languages, current country config.
 *
 * Seeded once at bootstrap (index.js) via `useFetchInitialConfigData()`.
 * Scenes read from it to populate dropdowns, drive onboarding forms, etc.
 */
import { useMemo } from 'react';

import { createDomainContext } from './Context.jsx';
import { DEFAULT_LANGUAGE } from '../common/constants/languages.js';

const { Provider, useState, useUpdate } = createDomainContext('Config', {
  countries: [],
  languages: [],
  activeCountryCode: null,
  countryConfiguration: null,
  countryKycRequirements: null,
  countryOrganizationRequirements: null,
  errors: [],
  loaded: false,
});

export const ConfigProvider = Provider;
export const useConfigState = useState;
export const useConfigUpdate = useUpdate;

/**
 * Convenience hook returning derived, memoized config values.
 */
export function useConfig() {
  const state = useState();

  return useMemo(
    () => ({
      countries: state.countries || [],
      languages: state.languages || [],
      activeCountryCode: state.activeCountryCode,
      countryConfiguration: state.countryConfiguration,
      countryKycRequirements: state.countryKycRequirements || [],
      countryOrganizationRequirements: state.countryOrganizationRequirements || [],
      loaded: state.loaded,
      errors: state.errors || [],
      hasErrors: (state.errors || []).length > 0,

      // Convenience: find a country by ISO2
      findCountry: (code) =>
        (state.countries || []).find((c) => c.iso2Code === code?.toUpperCase()) || null,

      // Convenience: find a language by code
      findLanguage: (code) =>
        (state.languages || []).find((l) => l.code === code?.toLowerCase()) || null,

      // Fallback when no preferred language is set
      defaultLanguage: DEFAULT_LANGUAGE,
    }),
    [state],
  );
}