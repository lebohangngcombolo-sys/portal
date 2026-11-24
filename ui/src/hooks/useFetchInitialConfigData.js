/**
 * Startup configuration loader.
 *
 * Called from src/index.js. Returns the initial ConfigBundle that the
 * ConfigContext consumes on first render. Restores the auth token from
 * storage before fetching so authenticated requests succeed on refresh.
 *
 * The bundle is intentionally defensive: it never throws. If any remote
 * call fails, the bundle reflects what succeeded and what didn't. The UI
 * shows what it has and can retry.
 */

import { ConfigProvider } from '../providers/index.js';
import { authTokenStore } from '../providers/index.js';
import { StorageKeys } from 'tb-state';

export async function fetchInitialConfigData() {
  // Restore the last selected country (if any) from storage.
  const storedCountry =
    typeof window !== 'undefined'
      ? window.sessionStorage?.getItem(StorageKeys.COUNTRY_CODE)
      : null;
  const countryCode = storedCountry ? JSON.parse(storedCountry) : null;

  const authenticated = authTokenStore.hasSession();

  // Fetch the public countries + languages, plus country-specific config
  // if the user had a country selected in a previous session.
  const bundle = await ConfigProvider.loadAll({ countryCode, authenticated });

  return bundle;
}