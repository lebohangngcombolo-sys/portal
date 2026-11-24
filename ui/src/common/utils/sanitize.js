/**
 * DOMPurify wrapper for sanitizing user- and server-supplied HTML
 * (spec §5.4 "Template rendering must escape untrusted input").
 *
 * Any HTML from a notification body, a legal document, or a template
 * preview must pass through `sanitize()` before being rendered with
 * `dangerouslySetInnerHTML`.
 */

import DOMPurify from 'dompurify';

const CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'target', 'rel', 'class', 'id',
    'colspan', 'rowspan', 'scope',
  ],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
  // Force external links to open in a new tab with safe rel
  ADD_ATTR: ['target', 'rel'],
};

/**
 * Sanitize an HTML string, returning safe markup for `dangerouslySetInnerHTML`.
 */
export function sanitize(html) {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, CONFIG);
}

/**
 * Sanitize and force all links to open externally with proper rel.
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  const cleaned = DOMPurify.sanitize(html, CONFIG);
  return cleaned.replace(
    /<a\s+([^>]+)>/g,
    (match, attrs) => {
      const hasTarget = /target\s*=/.test(attrs);
      const hasRel = /rel\s*=/.test(attrs);
      let updated = attrs;
      if (!hasTarget) updated += ' target="_blank"';
      if (!hasRel) updated += ' rel="noopener noreferrer"';
      return `<a ${updated}>`;
    },
  );
}