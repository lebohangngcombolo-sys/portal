/**
 * Email helpers (spec §3.4).
 *
 * Validation mirrors the server-side EmailValidator: length limits,
 * local-part structure, and domain with a 2+ character TLD.
 */

const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_LENGTH = 64;
const MAX_DOMAIN_LENGTH = 255;

const LOCAL_PATTERN = /^(?!\.)(?!.*\.\.)[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}(?<!\.)$/;
const DOMAIN_PATTERN = /^(?=.{1,255}$)(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

/**
 * True if the string is a syntactically valid email.
 */
export function isValidEmail(value) {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LENGTH) return false;
  const at = trimmed.lastIndexOf('@');
  if (at <= 0 || at === trimmed.length - 1) return false;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  if (local.length > MAX_LOCAL_LENGTH || domain.length > MAX_DOMAIN_LENGTH) return false;
  return LOCAL_PATTERN.test(local) && DOMAIN_PATTERN.test(domain);
}

/**
 * Normalize an email to lowercase + trimmed.
 */
export function normalizeEmail(value) {
  if (!value) return '';
  return String(value).trim().toLowerCase();
}

/**
 * Mask an email for display: john.smith@example.com → jo***@example.com.
 */
export function maskEmail(value) {
  if (!value) return '';
  const trimmed = String(value).trim();
  const at = trimmed.indexOf('@');
  if (at <= 0 || at === trimmed.length - 1) return '***';
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at);
  const head = local.length <= 2 ? local.charAt(0) : local.slice(0, 2);
  return `${head}***${domain}`;
}