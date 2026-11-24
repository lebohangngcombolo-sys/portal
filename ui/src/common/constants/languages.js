/**
 * Supported UI languages.
 *
 * Mirrors the country-service language seed. The `code` values match
 * the filenames under `portal-config/translations/`.
 */

export const LANGUAGES = Object.freeze({
  en: Object.freeze({
    code: 'en',
    name: 'English',
    nativeName: 'English',
  }),
  pt: Object.freeze({
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
  }),
});

export const LANGUAGE_CODES = Object.freeze(Object.keys(LANGUAGES));

export const DEFAULT_LANGUAGE = 'en';

/**
 * Return the display name for a language code.
 */
export function languageName(code) {
  if (!code) return '';
  return LANGUAGES[code.toLowerCase()]?.name || code.toUpperCase();
}

/**
 * Return the native name for a language code — used in language pickers.
 */
export function languageNativeName(code) {
  if (!code) return '';
  return LANGUAGES[code.toLowerCase()]?.nativeName || code.toUpperCase();
}