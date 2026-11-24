import { Storage } from '../storage/Storage.js';
import { StorageKeys } from '../storage/StorageKeys.js';

/**
 * Persists and retrieves access + refresh tokens.
 *
 * Wraps {@link Storage} with type-specific accessors so callers never
 * have to remember key names or the refresh-timestamp bookkeeping.
 */
export class TokenStore {
  #storage;

  constructor(storage = new Storage()) {
    this.#storage = storage;
  }

  /**
   * Persist both tokens and stamp the refresh time.
   */
  setTokens({ accessToken, refreshToken }) {
    if (accessToken !== null) {
      this.#storage.set(StorageKeys.ACCESS_TOKEN, accessToken);
    }
    if (refreshToken !== null) {
      this.#storage.set(StorageKeys.REFRESH_TOKEN, refreshToken);
    }
    this.#storage.set(StorageKeys.TOKEN_REFRESHED_AT, Date.now());
  }

  getAccessToken() {
    return this.#storage.get(StorageKeys.ACCESS_TOKEN);
  }

  getRefreshToken() {
    return this.#storage.get(StorageKeys.REFRESH_TOKEN);
  }

  /**
   * Milliseconds since the tokens were last refreshed. Returns Infinity
   * if no refresh has been recorded.
   */
  msSinceRefresh() {
    const at = this.#storage.get(StorageKeys.TOKEN_REFRESHED_AT);
    if (typeof at !== 'number') return Infinity;
    return Date.now() - at;
  }

  /**
   * True if the given number of seconds have elapsed since refresh.
   */
  needsRefreshBeforeExpiry(thresholdSeconds) {
    return this.msSinceRefresh() > thresholdSeconds * 1000;
  }

  /**
   * Remove all tokens.
   */
  clear() {
    this.#storage.remove(StorageKeys.ACCESS_TOKEN);
    this.#storage.remove(StorageKeys.REFRESH_TOKEN);
    this.#storage.remove(StorageKeys.TOKEN_REFRESHED_AT);
  }

  /**
   * True if the caller currently has an access token stored.
   */
  hasSession() {
    const token = this.getAccessToken();
    return typeof token === 'string' && token.length > 0;
  }
}