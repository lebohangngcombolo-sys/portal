/**
 * Application entry point.
 *
 * Responsibilities:
 * - Set default API headers (Content-Type, X-Client).
 * - Initialise i18next.
 * - Initialise Grafana Faro (if enabled).
 * - Load initial app + user configuration in parallel.
 * - Render the app with all context providers once config is ready.
 *
 * Nothing in this file should throw. Errors during bootstrap are rendered
 * as a fallback page so the user sees a message rather than a blank screen.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Api } from 'tb-state';

import { App } from './App.jsx';
import { initI18n } from './i18n/index.js';
import { initFaro } from './faro/init.js';
import { fetchInitialConfigData } from './hooks/useFetchInitialConfigData.js';
import { AppBootstrapError } from './components/feedback/AppBootstrapError.jsx';

// ------------------------------------------------------------------ default request headers

Api.setDefaultHeaders({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'X-Client': 'tradebridge-ui',
});

// ------------------------------------------------------------------ bootstrap

const rootEl = document.getElementById('root');
const root = createRoot(rootEl);

(async function bootstrap() {
  try {
    // 1. Faro first — so any error during i18n/config load is captured
    initFaro();

    // 2. i18n before config — config itself is used to select a locale
    await initI18n();

    // 3. Fetch app + user config in parallel
    const initialConfig = await fetchInitialConfigData();

    // 4. Remove the static bootstrap splash and render the app
    rootEl.innerHTML = '';
    root.render(
      <StrictMode>
        <App initialConfig={initialConfig} />
      </StrictMode>,
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[bootstrap] failed', error);
    root.render(
      <StrictMode>
        <AppBootstrapError error={error} />
      </StrictMode>,
    );
  }
})();