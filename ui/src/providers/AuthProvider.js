/**
 * Authentication orchestration.
 *
 * Responsibilities:
 * - Login, MFA challenge, token refresh, logout.
 * - Persist tokens via tb-state TokenStore.
 * - Wire the Provider's session-expired handler to a token refresh attempt.
 * - Expose the current session user for downstream providers.
 */

import { TokenStore } from 'tb-state';

import { IDENTITY_API } from '../common/constants/apiPaths.js';
import { ERROR_CODES } from '../common/constants/errors.js';
import { Provider } from './Provider.js';

/**
 * Single shared token store used by the Provider. Exported so Provider.js
 * can attach the Authorization header without circular imports.
 */
export const authTokenStore = new TokenStore();

class AuthProviderImpl {
  #refreshInFlight = null;

  // ------------------------------------------------------------------ login flow

  /**
   * Sign in with an identifier (email or phone) and password.
   *
   * @returns {Promise<{
   *   ok: boolean,
   *   tokens?: { accessToken: string, refreshToken: string },
   *   mfaRequired?: boolean,
   *   mfaChallengeId?: string | null,
   *   user?: object,
   *   code?: string | null,
   *   messages: string[],
   * }>}
   */
  async login({ identifier, password, deviceName }) {
    const res = await Provider.request({
      method: 'POST',
      path: IDENTITY_API.LOGIN,
      body: { identifier, password, deviceName },
      skipAuth: true,
    });

    if (!res.ok) {
      return { ok: false, messages: res.messages, code: res.code };
    }

    if (res.result?.mfaRequired) {
      // No tokens issued — return challenge info to the UI
      return {
        ok: true,
        mfaRequired: true,
        mfaChallengeId: res.result.mfaChallengeId,
        user: res.result.user,
        messages: [],
      };
    }

    authTokenStore.setTokens({
      accessToken: res.result?.accessToken,
      refreshToken: res.result?.refreshToken,
    });

    return {
      ok: true,
      tokens: {
        accessToken: res.result?.accessToken,
        refreshToken: res.result?.refreshToken,
      },
      mfaRequired: false,
      user: res.result?.user,
      messages: [],
    };
  }

  // ------------------------------------------------------------------ MFA

  /**
   * Verify an MFA challenge and obtain tokens.
   */
  async verifyMfa({ challengeId, code }) {
    const res = await Provider.request({
      method: 'POST',
      path: IDENTITY_API.MFA_VERIFY,
      body: { code, challengeId },
      // The MFA verify endpoint is public on the backend (it re-verifies via
      // the challenge itself), so no Authorization header is required.
      skipAuth: true,
    });

    if (!res.ok) {
      return { ok: false, messages: res.messages, code: res.code };
    }

    authTokenStore.setTokens({
      accessToken: res.result?.accessToken,
      refreshToken: res.result?.refreshToken,
    });

    return {
      ok: true,
      tokens: {
        accessToken: res.result?.accessToken,
        refreshToken: res.result?.refreshToken,
      },
      user: res.result?.user,
      messages: [],
    };
  }

  // ------------------------------------------------------------------ refresh

  /**
   * Exchange the refresh token for a new access token.
   * Concurrent calls are coalesced — only one network request is made.
   */
  async refresh() {
    if (this.#refreshInFlight) return this.#refreshInFlight;

    const refreshToken = authTokenStore.getRefreshToken();
    if (!refreshToken) {
      return { ok: false, code: ERROR_CODES.TOKEN_INVALID, messages: ['No refresh token'] };
    }

    this.#refreshInFlight = (async () => {
      const res = await Provider.request({
        method: 'POST',
        path: IDENTITY_API.REFRESH,
        body: { refreshToken },
        skipAuth: true,
      });

      if (!res.ok) {
        authTokenStore.clear();
        return { ok: false, code: res.code, messages: res.messages };
      }

      authTokenStore.setTokens({
        accessToken: res.result?.accessToken,
        refreshToken: res.result?.refreshToken,
      });

      return { ok: true };
    })().finally(() => {
      this.#refreshInFlight = null;
    });

    return this.#refreshInFlight;
  }

  /**
   * True if the token has not been refreshed within `thresholdSeconds`.
   * Use before an authenticated request to proactively refresh.
   */
  needsRefresh(thresholdSeconds) {
    return authTokenStore.hasSession() && authTokenStore.needsRefreshBeforeExpiry(thresholdSeconds);
  }

  // ------------------------------------------------------------------ logout

  /**
   * Revoke the current session and clear local tokens.
   * Silent failure is intentional — even if the server call fails,
   * the local session is cleared so the user is signed out.
   */
  async logout() {
    try {
      await Provider.request({
        method: 'POST',
        path: IDENTITY_API.LOGOUT,
        skipSessionHandling: true,
      });
    } catch {
      /* ignore */
    }
    authTokenStore.clear();
  }

  /**
   * Revoke all sessions for the current user.
   */
  async logoutAll() {
    try {
      await Provider.request({
        method: 'POST',
        path: IDENTITY_API.LOGOUT_ALL,
        skipSessionHandling: true,
      });
    } catch {
      /* ignore */
    }
    authTokenStore.clear();
  }

  // ------------------------------------------------------------------ helpers

  /**
   * Fetch the current user's profile.
   */
  async me({ skipSessionHandling = false, dedupeKey } = {}) {
    return Provider.request({
      method: 'GET',
      path: IDENTITY_API.ME,
      skipSessionHandling,
      dedupeKey,
    });
  }

  hasSession() {
    return authTokenStore.hasSession();
  }
}

export const AuthProvider = new AuthProviderImpl();