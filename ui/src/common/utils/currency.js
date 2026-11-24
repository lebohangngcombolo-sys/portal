/**
 * Currency formatting utilities using Intl.NumberFormat.
 *
 * All currency codes are ISO 4217 (spec §4.4). The UI never formats a
 * currency with a decimal precision other than the one supported by the
 * code; amounts from the API carry their own decimal precision.
 */

/**
 * Format a numeric amount as a currency string.
 *
 * @param {number|string} amount
 * @param {string} currencyCode — ISO 4217 (e.g. 'ZAR', 'EUR')
 * @param {string} language — locale for formatting ('en', 'pt')
 * @returns {string}
 */
export function formatCurrency(amount, currencyCode, language = 'en') {
  const n = toNumber(amount);
  if (n == null || !currencyCode) return '';
  try {
    return new Intl.NumberFormat(localeFor(language), {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${currencyCode} ${n.toFixed(2)}`;
  }
}

/**
 * Format a numeric amount without a currency symbol.
 */
export function formatAmount(amount, language = 'en') {
  const n = toNumber(amount);
  if (n == null) return '';
  try {
    return new Intl.NumberFormat(localeFor(language), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return n.toFixed(2);
  }
}

/**
 * Format as a percentage (0..100 → "12.5%").
 */
export function formatPercent(value, language = 'en', decimals = 2) {
  const n = toNumber(value);
  if (n == null) return '';
  try {
    return new Intl.NumberFormat(localeFor(language), {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(n / 100);
  } catch {
    return `${n.toFixed(decimals)}%`;
  }
}

/**
 * Round an amount to the currency's native precision.
 */
export function roundToCurrency(amount, decimalPlaces = 2) {
  const n = toNumber(amount);
  if (n == null) return null;
  const factor = 10 ** decimalPlaces;
  return Math.round(n * factor) / factor;
}

// ------------------------------------------------------------------ helpers

function toNumber(value) {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function localeFor(language) {
  return language === 'pt' ? 'pt-PT' : 'en-ZA';
}