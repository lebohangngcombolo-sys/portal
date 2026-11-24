/**
 * Mask sensitive values for display.
 *
 * Never use these to prepare data for storage — masking is display-only.
 * The original values must live in the API/store and never be logged.
 */

/**
 * Mask a string showing only the last `visible` characters.
 * Example: maskTail('0123456789', 4) → '******6789'
 */
export function maskTail(value, visible = 4) {
  if (!value) return '';
  const str = String(value);
  if (str.length <= visible) return '*'.repeat(str.length);
  return '*'.repeat(str.length - visible) + str.slice(-visible);
}

/**
 * Mask everything except the first `head` characters.
 */
export function maskHead(value, head = 2) {
  if (!value) return '';
  const str = String(value);
  if (str.length <= head) return str;
  return str.slice(0, head) + '*'.repeat(str.length - head);
}

/**
 * Mask an identifier showing its first 4 and last 4 characters.
 * Example: maskId('a7f3e2b9c8d1...') → 'a7f3…e2b9'
 */
export function maskId(value) {
  if (!value) return '';
  const str = String(value);
  if (str.length <= 8) return str;
  return `${str.slice(0, 4)}…${str.slice(-4)}`;
}

/**
 * Mask a full name, e.g. "John Smith" → "J. S."
 */
export function maskName(value) {
  if (!value) return '';
  const parts = String(value).trim().split(/\s+/);
  return parts.map((p) => (p.length > 0 ? `${p.charAt(0)}.` : '')).join(' ');
}