/**
 * Read the current authenticated user from the UserContext.
 *
 * Returns a stable object with the current user's basic identity and
 * role helpers. Returns `null` when the user is not signed in.
 *
 * `isLoading` is true while the profile is being fetched after login
 * (there's a short window between token storage and profile availability).
 */

import { useMemo } from 'react';

import { useUserState } from '../contexts/UserContext.jsx';
import { expandRoles } from '../common/constants/userRoles.js';

export function useSessionUser() {
  const { user, loading } = useUserState();

  return useMemo(() => {
    if (!user) {
      return { user: null, isLoading: loading, roles: [], effectiveRoles: [] };
    }
    const rawRoles = Array.isArray(user.roles) ? user.roles : [];
    return {
      user,
      isLoading: false,
      roles: rawRoles,
      effectiveRoles: expandRoles(rawRoles),
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' '),
      countryCode: user.countryCode,
      preferredLanguage: user.preferredLanguage,
      emailVerified: Boolean(user.emailVerified),
      mfaEnabled: Boolean(user.mfaEnabled),
    };
  }, [user, loading]);
}