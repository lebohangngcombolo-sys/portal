/**
 * Authentication orchestration.
 *
 * Responsibilities:
 * - Expose `signIn`, `verifyMfa`, `signOut`, `signOutAll`, `refresh`.
 * - Fetch and store the current user in `UserContext` after a successful login.
 * - Handle the session-expired callback from `Provider.js` by attempting a
 *   silent refresh, then bouncing the user to login if that fails.
 * - Restore the session on page reload (called once from bootstrap).
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { createDomainContext } from './Context.jsx';
import { AuthProvider, authTokenStore } from '../providers/AuthProvider.js';
import { Provider } from '../providers/Provider.js';
import { IdentityProvider } from '../providers/IdentityProvider.js';
import { useUserUpdate } from './UserContext.jsx';
import { StorageKeys } from 'tb-state';
import { ERROR_CODES } from '../common/constants/errors.js';

const { Provider: AuthProviderContext, useState, useUpdate } = createDomainContext('Auth', {
  status: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
  lastError: null,
  mfaChallengeId: null,
  mfaRequired: false,
});

export const AuthContextProvider = AuthProviderContext;
export const useAuthState = useState;
export const useAuthUpdate = useUpdate;

/**
 * Hook used by scenes to call authentication actions.
 */
export function useAuth() {
  const { set } = useAuthUpdate();
  const { set: setUserState } = useUserUpdate();
  const authOperation = useRef(0);

  // ---------------------------------------------------------- session helpers

  const loadUser = useCallback(async () => {
    setUserState({ loading: true });
    const res = await IdentityProvider.adminGetUser('self'); // never used — see below
    return res;
  }, [setUserState]);

  const fetchMe = useCallback(
    async ({ isCurrent = () => true, skipSessionHandling = false, dedupeKey } = {}) => {
      if (isCurrent()) {
        setUserState({ loading: true, error: null });
      }
      const res = await AuthProvider.me({ skipSessionHandling, dedupeKey });
      if (!isCurrent()) return null;
      if (res.ok) {
        setUserState({ user: res.result, loading: false, error: null });
        return res.result;
      }
      setUserState({ user: null, loading: false, error: res.messages });
      return null;
    },
    [setUserState],
  );

  // ---------------------------------------------------------- actions

  const signIn = useCallback(
    async ({ identifier, password, deviceName }) => {
      authOperation.current += 1;
      set({ status: 'loading', lastError: null });
      const result = await AuthProvider.login({ identifier, password, deviceName });
      if (!result.ok) {
        set({ status: 'unauthenticated', lastError: result.messages?.[0] ?? 'Login failed' });
        return result;
      }
      if (result.mfaRequired) {
        set({ status: 'loading', mfaRequired: true, mfaChallengeId: result.mfaChallengeId });
        return result;
      }
      const user = await fetchMe();
      if (!user) {
        const message = 'Unable to verify your session. Please sign in again.';
        set({ status: 'unauthenticated', lastError: message });
        return { ...result, ok: false, code: ERROR_CODES.SESSION_EXPIRED, messages: [message] };
      }
      set({ status: 'authenticated', mfaRequired: false, mfaChallengeId: null });
      return result;
    },
    [fetchMe, set],
  );

  const verifyMfa = useCallback(
    async ({ challengeId, code }) => {
      authOperation.current += 1;
      set({ status: 'loading', lastError: null });
      const result = await AuthProvider.verifyMfa({ challengeId, code });
      if (!result.ok) {
        set({ status: 'unauthenticated', lastError: result.messages?.[0] ?? 'Verification failed' });
        return result;
      }
      const user = await fetchMe();
      if (!user) {
        const message = 'Unable to verify your session. Please sign in again.';
        set({ status: 'unauthenticated', lastError: message });
        return { ...result, ok: false, code: ERROR_CODES.SESSION_EXPIRED, messages: [message] };
      }
      set({ status: 'authenticated', mfaRequired: false, mfaChallengeId: null });
      return result;
    },
    [fetchMe, set],
  );

  const signOut = useCallback(async () => {
    authOperation.current += 1;
    await AuthProvider.logout();
    setUserState({ user: null, loading: false, error: null });
    set({ status: 'unauthenticated', lastError: null });
    try {
      window.sessionStorage.removeItem(StorageKeys.POST_LOGIN_REDIRECT);
    } catch {
      /* ignore */
    }
  }, [set, setUserState]);

  const signOutAll = useCallback(async () => {
    authOperation.current += 1;
    await AuthProvider.logoutAll();
    setUserState({ user: null, loading: false, error: null });
    set({ status: 'unauthenticated', lastError: null });
  }, [set, setUserState]);

  const refresh = useCallback(async () => {
    return AuthProvider.refresh();
  }, []);

  // ---------------------------------------------------------- session-expired handler

  useEffect(() => {
    Provider.setSessionExpiredHandler(async ({ alreadyRetried } = {}) => {
      if (alreadyRetried) {
        await signOut();
        return false;
      }
      const refreshed = await AuthProvider.refresh();
      if (!refreshed.ok) {
        await signOut();
        return false;
      }
      return true;
    });
  }, [signOut]);

  // ---------------------------------------------------------- restore on mount

  useEffect(() => {
    if (authTokenStore.hasSession()) {
      const operation = authOperation.current;
      set({ status: 'loading' });
      fetchMe({
        isCurrent: () => operation === authOperation.current,
        skipSessionHandling: true,
        dedupeKey: `session-restore:${operation}`,
      }).then((user) => {
        if (operation === authOperation.current) {
          set({ status: user ? 'authenticated' : 'unauthenticated' });
        }
      });
    } else {
      set({ status: 'unauthenticated' });
    }
  }, [fetchMe, set]);

  return {
    signIn,
    verifyMfa,
    signOut,
    signOutAll,
    refresh,
    fetchMe,
  };
}