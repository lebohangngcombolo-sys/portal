/**
 * Supported countries.
 *
 * Mirrors the initial seed of Country Service (spec §4.2, ZA + PT).
 * New countries are added by Country Service operators; the UI reads
 * the full list from `/api/v1/countries` at runtime. This static list
 * exists only for fallbacks and type-safe references.
 */

export const COUNTRIES = Object.freeze({
  ZA: Object.freeze({
    iso2: 'ZA',
    iso3: 'ZAF',
    name: 'South Africa',
    flag: 'za',
    defaultLanguage: 'en',
    defaultCurrency: 'ZAR',
  }),
  PT: Object.freeze({
    iso2: 'PT',
    iso3: 'PRT',
    name: 'Portugal',
    flag: 'pt',
    defaultLanguage: 'pt',
    defaultCurrency: 'EUR',
  }),
});

export const COUNTRY_CODES = Object.freeze(Object.keys(COUNTRIES));

/**
 * Return the display name for a country code, falling back to the code itself.
 */
export function countryName(iso2) {
  if (!iso2) return '';
  return COUNTRIES[iso2.toUpperCase()]?.name || iso2.toUpperCase();
}