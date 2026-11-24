/**
 * E.164 phone number helpers (spec §3.4, §4.4).
 *
 * Validation and normalization mirror the server-side
 * E164PhoneValidator: + followed by 7–15 digits, no leading zero.
 */

const E164_PATTERN = /^\+[1-9]\d{6,14}$/;

/**
 * True if the string is a valid E.164 phone number.
 */
export function isValidE164(value) {
  if (!value) return false;
  return E164_PATTERN.test(String(value).trim());
}

/**
 * Normalize a phone number to E.164. Throws if invalid.
 */
export function normalizePhone(value) {
  if (value == null) {
    throw new Error('Phone number is required');
  }
  const trimmed = String(value).trim();
  if (!trimmed.startsWith('+')) {
    throw new Error('Phone number must include country code (start with +)');
  }
  // Strip common separators; keep only + and digits
  const digits = trimmed.replace(/[\s\-().]/g, '');
  if (!isValidE164(digits)) {
    throw new Error('Invalid E.164 phone number');
  }
  return digits;
}

/**
 * Format a phone number for display. Keeps the country code prefix,
 * adds spaces every 3 digits after it for readability.
 *
 * +27123456789 → +27 123 456 789
 */
export function formatPhone(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  if (!trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.slice(1);
  if (digits.length <= 3) return `+${digits}`;
  // Country code heuristic: 1-3 digits at the start
  const countryCodeLen = guessCountryCodeLength(digits);
  const cc = digits.slice(0, countryCodeLen);
  const rest = digits.slice(countryCodeLen);
  const groups = rest.match(/.{1,3}/g) || [];
  return `+${cc} ${groups.join(' ')}`;
}

/**
 * Mask a phone number for display: +27 *** *** 789.
 */
export function maskPhone(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  if (trimmed.length <= 4) return '****';
  const prefixLen = trimmed.startsWith('+') ? 3 : 2;
  if (trimmed.length <= prefixLen + 4) return '****';
  const prefix = trimmed.slice(0, Math.min(prefixLen, trimmed.length));
  const suffix = trimmed.slice(-4);
  return `${prefix}****${suffix}`;
}

// ------------------------------------------------------------------ helpers

function guessCountryCodeLength(digits) {
  // Common single-digit codes (US, CA, RU): 1
  if (/^1/.test(digits)) return 1;
  // Two-digit codes cover most of Africa + Europe: 27 (ZA), 351 (PT), etc.
  // Three-digit codes are the fallback.
  const twoDigitCodes = ['27', '34', '39', '44', '49', '55', '61', '65', '81', '86'];
  const twoDigit = digits.slice(0, 2);
  if (twoDigitCodes.includes(twoDigit)) return 2;
  return Math.min(3, digits.length);
}