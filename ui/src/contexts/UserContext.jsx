/**
 * Current user profile.
 *
 * Populated after login (`AuthContext` fetches it) or after page reload
 * (bootstrap restores the token and fetches `/identity/me`). `UserContext`
 * holds the last-known profile; a `loading` flag indicates the initial
 * fetch is still in progress.
 */
import { createDomainContext } from './Context.jsx';

const { Provider, useState, useUpdate } = createDomainContext('User', {
  user: null,
  loading: false,
  error: null,
});

export const UserProvider = Provider;
export const useUserState = useState;
export const useUserUpdate = useUpdate;