/**
 * Country Service provider — countries, currencies, languages, configuration.
 * Public routes are safe to call without a token.
 */

import { CacheStrategies } from 'tb-state';

import { COUNTRY_API } from '../common/constants/apiPaths.js';
import { Provider } from './Provider.js';

export const CountryProvider = {
  // -------------------------------------------------------- public reads
  listCountries({ enabled = true } = {}) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRIES,
      params: { enabled },
      // Countries change rarely; a 5-min browser cache is safe
      cache: CacheStrategies.CacheFirst,
    });
  },

  getCountry(countryCode) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRY(countryCode),
      cache: CacheStrategies.CacheFirst,
    });
  },

  listCurrencies(countryCode) {
    return Provider.request({
      method: 'GET',
      path: countryCode
        ? COUNTRY_API.COUNTRY_CURRENCIES(countryCode)
        : COUNTRY_API.CURRENCIES,
      cache: CacheStrategies.CacheFirst,
    });
  },

  listLanguages(countryCode) {
    return Provider.request({
      method: 'GET',
      path: countryCode
        ? COUNTRY_API.COUNTRY_LANGUAGES(countryCode)
        : COUNTRY_API.LANGUAGES,
      cache: CacheStrategies.CacheFirst,
    });
  },

  getRequirements(countryCode) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRY_REQUIREMENTS(countryCode),
      cache: CacheStrategies.CacheFirst,
    });
  },

  getKycRequirements(countryCode, { customerType } = {}) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRY_KYC_REQUIREMENTS(countryCode),
      params: customerType ? { customerType } : {},
      cache: CacheStrategies.CacheFirst,
    });
  },

  getOrganizationRequirements(countryCode, { organizationType } = {}) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRY_ORG_REQUIREMENTS(countryCode),
      params: organizationType ? { organizationType } : {},
      cache: CacheStrategies.CacheFirst,
    });
  },

  getActiveConfiguration(countryCode) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRY_CONFIGURATION(countryCode),
      cache: CacheStrategies.CacheFirst,
    });
  },

  // -------------------------------------------------------- admin
  listConfigurationVersions(countryCode) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRY_CONFIGURATION_VERSIONS(countryCode),
    });
  },

  getConfigurationVersion(countryCode, version) {
    return Provider.request({
      method: 'GET',
      path: COUNTRY_API.COUNTRY_CONFIGURATION_VERSION(countryCode, version),
    });
  },

  publishConfiguration(countryCode, { changeSummary, configuration }) {
    return Provider.request({
      method: 'POST',
      path: COUNTRY_API.COUNTRY_CONFIGURATION_PUBLISH(countryCode),
      body: { changeSummary, configuration },
    });
  },

  rollbackConfiguration(countryCode, { targetVersion, reason }) {
    return Provider.request({
      method: 'POST',
      path: COUNTRY_API.COUNTRY_CONFIGURATION_ROLLBACK(countryCode),
      body: { targetVersion, reason },
    });
  },

  createCountry(body) {
    return Provider.request({ method: 'POST', path: COUNTRY_API.COUNTRIES, body });
  },

  updateCountry(countryCode, body) {
    return Provider.request({
      method: 'PUT',
      path: COUNTRY_API.COUNTRY(countryCode),
      body,
    });
  },

  changeCountryStatus(countryCode, { enabled }) {
    return Provider.request({
      method: 'PATCH',
      path: `${COUNTRY_API.COUNTRY(countryCode)}/status`,
      body: { enabled },
    });
  },

  addCurrency(countryCode, body) {
    return Provider.request({
      method: 'POST',
      path: COUNTRY_API.COUNTRY_CURRENCIES(countryCode),
      body,
    });
  },

  removeCurrency(countryCode, currencyCode) {
    return Provider.request({
      method: 'DELETE',
      path: `${COUNTRY_API.COUNTRY_CURRENCIES(countryCode)}/${currencyCode}`,
    });
  },

  addLanguage(countryCode, body) {
    return Provider.request({
      method: 'POST',
      path: COUNTRY_API.COUNTRY_LANGUAGES(countryCode),
      body,
    });
  },

  removeLanguage(countryCode, languageCode) {
    return Provider.request({
      method: 'DELETE',
      path: `${COUNTRY_API.COUNTRY_LANGUAGES(countryCode)}/${languageCode}`,
    });
  },

  createOrganizationRequirement(countryCode, body) {
    return Provider.request({
      method: 'POST',
      path: COUNTRY_API.COUNTRY_ORG_REQUIREMENTS(countryCode),
      body,
    });
  },

  updateOrganizationRequirement(requirementId, body) {
    return Provider.request({
      method: 'PUT',
      path: COUNTRY_API.ORG_REQUIREMENT(requirementId),
      body,
    });
  },

  toggleOrganizationRequirement(requirementId, { enabled }) {
    return Provider.request({
      method: 'PATCH',
      path: COUNTRY_API.ORG_REQUIREMENT_STATUS(requirementId),
      body: { enabled },
    });
  },

  createKycRequirement(countryCode, body) {
    return Provider.request({
      method: 'POST',
      path: COUNTRY_API.COUNTRY_KYC_REQUIREMENTS(countryCode),
      body,
    });
  },

  updateKycRequirement(requirementId, body) {
    return Provider.request({
      method: 'PUT',
      path: COUNTRY_API.KYC_REQUIREMENT(requirementId),
      body,
    });
  },

  toggleKycRequirement(requirementId, { enabled }) {
    return Provider.request({
      method: 'PATCH',
      path: COUNTRY_API.KYC_REQUIREMENT_STATUS(requirementId),
      body: { enabled },
    });
  },
};