/**
 * Faro telemetry hook.
 *
 * Provides small, safe wrappers around the Faro API. Every method no-ops
 * when Faro is disabled (see faro/init.js) so callers don't need to
 * check availability.
 */

import { useCallback } from 'react';

import { faro } from '../faro/logger.js';

export function useFaro() {
  const logEvent = useCallback((name, attributes = {}) => {
    faro.api?.pushEvent(name, { attributes });
  }, []);

  const logError = useCallback((error, context = {}) => {
    faro.api?.pushError(error, { context });
  }, []);

  const setUser = useCallback((user) => {
    if (!user) {
      faro.api?.resetUserMeta?.();
      return;
    }
    faro.api?.setUser?.({
      id: user.id,
      email: user.email,
      username: user.firstName,
      attributes: {
        roles: Array.isArray(user.roles) ? user.roles.join(',') : '',
      },
    });
  }, []);

  return { logEvent, logError, setUser };
}