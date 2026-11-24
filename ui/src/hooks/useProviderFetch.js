/**
 * Fetch data from a Provider and manage loading/error/data state.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useProviderFetch(
 *     () => CountryProvider.listCountries(),
 *     { deps: [] },
 *   );
 *
 * Behavior:
 * - Calls `fetcher()` on mount and whenever `deps` changes.
 * - Cancels stale responses (ignores results from outdated requests).
 * - Ignores responses after unmount.
 * - Exposes `refetch()` to manually re-run the request.
 * - `enabled=false` skips the initial fetch (used by conditional hooks).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export function useProviderFetch(fetcher, options = {}) {
  const {
    deps = [],
    enabled = true,
    initialData = null,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  // Track each invocation so we can ignore stale responses
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    if (!enabled) return null;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await fetcher();
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        // Stale or unmounted — drop the result
        return res;
      }

      if (res?.ok) {
        setData(res.result);
        setStatus(res.status);
        onSuccess?.(res);
      } else {
        setError({
          messages: res?.messages?.length ? res.messages : ['Request failed'],
          code: res?.code ?? 'UNKNOWN',
          correlationId: res?.correlationId ?? null,
        });
        setData(null);
        setStatus(res?.status ?? null);
        onError?.(res);
      }
      return res;
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return null;
      const payload = {
        messages: [err.message || 'Unexpected error'],
        code: 'UNEXPECTED',
        correlationId: null,
      };
      setError(payload);
      setData(null);
      onError?.(payload);
      return null;
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fetcher, ...deps]);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return {
    data,
    loading,
    error,
    status,
    refetch: run,
    setData,
  };
}