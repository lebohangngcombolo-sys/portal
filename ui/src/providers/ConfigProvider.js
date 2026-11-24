/**
 * Aggregated configuration loader.
 *
 * Startup sequence:
 * 1. Fetch the list of enabled countries.
 * 2. Fetch the list of languages.
 * 3. If the user is authenticated, fetch their profile and the country config.
 * 4. Return a single ConfigBundle that the ConfigContext consumes.
 *
 * If any individual call fails, the bundle reflects the failure but does
 * not throw — the UI shows what it can and logs the rest.
 */

import { COUNTRY_API } from '../common/constants/apiPaths.js';
import { COUNTRIES } from '../common/constants/countries.js';
import { LANGUAGES } from '../common/constants/languages.js';
import { Provider } from './Provider.js';

const DEFAULT_COUNTRIES = Object.values(COUNTRIES).map((country) => ({
  iso2Code: country.iso2,
  iso3Code: country.iso3,
  name: country.name,
  defaultLanguageCode: country.defaultLanguage,
  defaultCurrencyCode: country.defaultCurrency,
  enabled: true,
}));

const DEFAULT_LANGUAGES = Object.values(LANGUAGES);

export const ConfigProvider = {
  async loadAll({ countryCode = null, authenticated = false } = {}) {
    const bundle = {
      countries: [],
      languages: [],
      activeCountryCode: countryCode || null,
      countryConfiguration: null,
      countryKycRequirements: null,
      countryOrganizationRequirements: null,
      errors: [],
    };

    // Countries (public)
    const countriesRes = await Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRIES,
      skipAuth: true,
    });
    if (countriesRes.ok && Array.isArray(countriesRes.result)) {
      bundle.countries = countriesRes.result;
    } else {
      bundle.errors.push({ scope: 'countries', res: countriesRes });
    }
    if (bundle.countries.length === 0) {
      bundle.countries = DEFAULT_COUNTRIES;
    }

    // Languages (public)
    const languagesRes = await Provider.request({
      method: 'GET',
      path: COUNTRY_API.LANGUAGES,
      skipAuth: true,
    });
    if (languagesRes.ok && Array.isArray(languagesRes.result)) {
      bundle.languages = languagesRes.result;
    } else {
      bundle.errors.push({ scope: 'languages', res: languagesRes });
    }
    if (bundle.languages.length === 0) {
      bundle.languages = DEFAULT_LANGUAGES;
    }

    // Country-specific config — only when a country is selected
    const code = bundle.activeCountryCode;
    if (code) {
      const [configRes, kycReqRes, orgReqRes] = await Promise.all([
        Provider.request({
          method: 'GET',
          path: COUNTRY_API.COUNTRY_CONFIGURATION(code),
          skipAuth: !authenticated,
        }),
        Provider.request({
          method: 'GET',
          path: COUNTRY_API.COUNTRY_KYC_REQUIREMENTS(code),
          skipAuth: !authenticated,
        }),
        Provider.request({
          method: 'GET',
          path: COUNTRY_API.COUNTRY_ORG_REQUIREMENTS(code),
          skipAuth: !authenticated,
        }),
      ]);

      if (configRes.ok) bundle.countryConfiguration = configRes.result;
      else bundle.errors.push({ scope: 'countryConfig', res: configRes });

      if (kycReqRes.ok) bundle.countryKycRequirements = kycReqRes.result;
      else bundle.errors.push({ scope: 'kycRequirements', res: kycReqRes });

      if (orgReqRes.ok) bundle.countryOrganizationRequirements = orgReqRes.result;
      else bundle.errors.push({ scope: 'orgRequirements', res: orgReqRes });
    }

    return bundle;
  },
};