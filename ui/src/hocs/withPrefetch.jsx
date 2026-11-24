/**
 * Prefetch HOC — no-op today, extensible for route-level data priming.
 *
 * The goal is to allow a route to declare a `prefetch` function that runs
 * on navigation (e.g. preload a country config). Currently no route uses
 * prefetching; when it's needed, the route entry adds:
 *
 *   { path, scene, prefetch: (params) => CountryProvider.getCountry(params.code) }
 *
 * and the HOC runs it once per params change before rendering.
 */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function withPrefetch(Component, route = {}) {
  function PrefetchedComponent(props) {
    const params = useParams();

    useEffect(() => {
      if (typeof route.prefetch === 'function') {
        Promise.resolve(route.prefetch(params)).catch(() => {
          /* silent — prefetch is an optimization, not a requirement */
        });
      }
    }, [JSON.stringify(params)]);

    return <Component {...props} />;
  }

  PrefetchedComponent.displayName = `withPrefetch(${Component.displayName || Component.name || 'Component'})`;
  return PrefetchedComponent;
}