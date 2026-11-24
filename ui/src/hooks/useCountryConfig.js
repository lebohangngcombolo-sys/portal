/**
 * Load the active configuration + requirements for a country.
 *
 * Used by onboarding forms to know which fields and evidence are required.
 * Returns the country's configuration version, KYC requirements, and
 * organization requirements — all cached client-side by Provider.
 */

import { useMemo } from 'react';

import { CountryProvider } from '../providers/index.js';
import { useProviderFetch } from './useProviderFetch.js';

export function useCountryConfig(countryCode) {
  const enabled = Boolean(countryCode);

  const configFetch = useProviderFetch(
    () => CountryProvider.getActiveConfiguration(countryCode),
    { enabled, deps: [countryCode] },
  );

  const kycReqFetch = useProviderFetch(
    () => CountryProvider.getKycRequirements(countryCode),
    { enabled, deps: [countryCode] },
  );

  const orgReqFetch = useProviderFetch(
    () => CountryProvider.getOrganizationRequirements(countryCode),
    { enabled, deps: [countryCode] },
  );

  return useMemo(
    () => ({
      loading: configFetch.loading || kycReqFetch.loading || orgReqFetch.loading,
      configuration: configFetch.data,
      configurationVersion: configFetch.data?.version ?? null,
      kycRequirements: kycReqFetch.data ?? [],
      organizationRequirements: orgReqFetch.data ?? [],
      error:
        configFetch.error ||
        kycReqFetch.error ||
        orgReqFetch.error ||
        null,
      refetch: () => {
        configFetch.refetch();
        kycReqFetch.refetch();
        orgReqFetch.refetch();
      },
    }),
    [configFetch, kycReqFetch, orgReqFetch],
  );
}