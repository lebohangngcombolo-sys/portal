/**
 * Canonical storage key constants.
 *
 * All keys are namespaced with `tb.` so multiple apps in the same origin
 * (e.g. marketing site + this SPA) don't collide.
 */
export const StorageKeys = Object.freeze({
  /** Signed-in user (id, email, roles, firstName, lastName) */
  USER: 'tb.user',

  /** Access token (short-lived JWT) */
  ACCESS_TOKEN: 'tb.access_token',

  /** Refresh token (opaque, single-use) */
  REFRESH_TOKEN: 'tb.refresh_token',

  /** Timestamp (ms) of the last successful token refresh */
  TOKEN_REFRESHED_AT: 'tb.token_refreshed_at',

  /** Signed-in user's preferred language */
  LANGUAGE: 'tb.language',

  /** Country code (ISO2) selected for onboarding */
  COUNTRY_CODE: 'tb.country_code',

  /** Notification preferences cache */
  NOTIFICATION_PREFS: 'tb.notification_prefs',

  /** Draft onboarding form values (per organization id) */
  FORM_DRAFT_PREFIX: 'tb.form_draft.',

  /** Post-login redirect path */
  POST_LOGIN_REDIRECT: 'tb.post_login_redirect',
});

/**
 * Keys that must survive a `Storage.clear()` (e.g. logout of a specific
 * session but keeping the current user for a re-login).
 */
export const PRESERVED_KEYS_ON_CLEAR = Object.freeze([
  StorageKeys.USER,
  StorageKeys.LANGUAGE,
  StorageKeys.COUNTRY_CODE,
]);