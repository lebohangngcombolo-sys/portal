import { TokenStore } from './TokenStore.js';

/**
 * Header helpers for authenticated requests.
 *
 * Merges the caller's headers with the `Authorization: Bearer <token>`
 * header derived from {@link TokenStore}. Callers can override by
 * passing an explicit `Authorization` in their own headers.
 */
export class AuthHeaders {
  #tokenStore;

  constructor(tokenStore = new TokenStore()) {
    this.#tokenStore = tokenStore;
  }

  /**
   * Produce an Authorization header object suitable for `Api.request({ headers })`.
   *
   * @param {Record<string,string>} [baseHeaders] — headers to merge in
   * @returns {Record<string,string>}
   */
  withAuth(baseHeaders = {}) {
    const token = this.#tokenStore.getAccessToken();
    const hasAuthorization = Object.keys(baseHeaders).some(
      (k) => k.toLowerCase() === 'authorization',
    );
    if (!token || hasAuthorization) {
      return { ...baseHeaders };
    }
    return { ...baseHeaders, Authorization: `Bearer ${token}` };
  }

  /**
   * True if the given response status indicates the session has expired
   * (401 is the canonical signal; the UI Provider maps this to logout).
   */
  static isSessionExpired(status) {
    return status === 401;
  }
}