/**
 * Asset URL helpers.
 *
 * Assets that are served from portal-config (CDN) live under the
 * `staticBaseUrl` config value. When it's not set, paths fall through
 * to the app's own origin — useful for local development.
 */
const CDN_BASE =
  ((typeof window !== 'undefined' && window.__APP_CONFIG__?.staticBaseUrl) || '').replace(/\/+$/, '');

const LOGO_FILES = {
  'logo-primary': 'tradebridge-africa-logo.svg',
  'logo-white': 'tradebridge-africa-logo.svg',
  'logo-mark': 'tradebridge-africa-logo.svg',
};

export function logoUrl(name) {
  const fileName = LOGO_FILES[name];
  if (!fileName) {
    throw new Error(`Unknown logo asset: ${name}`);
  }
  return `${CDN_BASE}/assets/logos/${fileName}`;
}

export function flagUrl(countryCode) {
  if (!countryCode) return '';
  return `${CDN_BASE}/assets/flags/${countryCode.toLowerCase()}.svg`;
}

export function legalUrl(docType, countryCode) {
  if (!docType || !countryCode) return '';
  return `${CDN_BASE}/legal/${docType}-${countryCode.toUpperCase()}.md`;
}