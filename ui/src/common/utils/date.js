import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { enUS, pt as ptLocale } from 'date-fns/locale';

const LOCALES = { en: enUS, pt: ptLocale };

/**
 * Return the date-fns locale for a language code.
 */
function localeFor(language) {
  return LOCALES[language?.toLowerCase()] || enUS;
}

/**
 * Parse a value (string, Date, number) into a Date object. Returns null
 * for invalid input so callers can branch cleanly.
 */
export function toDate(value) {
  if (value == null) return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Format a date using a date-fns pattern.
 * Locale is derived from `language` (default 'en').
 */
export function formatDate(value, pattern = 'd MMM yyyy', language = 'en') {
  const date = toDate(value);
  if (!date) return '';
  try {
    return format(date, pattern, { locale: localeFor(language) });
  } catch {
    return '';
  }
}

/**
 * Format a date and time.
 */
export function formatDateTime(value, language = 'en') {
  return formatDate(value, 'd MMM yyyy, HH:mm', language);
}

/**
 * Format as a short relative time — e.g. "3 minutes ago".
 */
export function formatRelative(value, language = 'en') {
  const date = toDate(value);
  if (!date) return '';
  try {
    return formatDistanceToNow(date, { addSuffix: true, locale: localeFor(language) });
  } catch {
    return '';
  }
}

/**
 * UTC-safe ISO timestamp for API requests (no timezone suffix).
 */
export function toIsoUtc(value) {
  const date = toDate(value);
  if (!date) return null;
  return date.toISOString();
}

/**
 * True if the given date is in the future.
 */
export function isFuture(value) {
  const date = toDate(value);
  return date != null && date.getTime() > Date.now();
}

/**
 * True if the given date is in the past.
 */
export function isPast(value) {
  const date = toDate(value);
  return date != null && date.getTime() < Date.now();
}