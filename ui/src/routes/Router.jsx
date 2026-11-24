/**
 * Router — React Router v6 configuration.
 *
 * Wraps every route in:
 * - Suspense boundary for lazy-loaded scenes
 * - withSecurity (auth + role gate)
 * - withPrefetch (route-level data prefetch)
 * - withErrorBoundary (isolates scene failures)
 */
import { Suspense, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '../common/constants/routes.js';
import { withSecurity } from '../hocs/withSecurity.jsx';
import { withPrefetch } from '../hocs/withPrefetch.jsx';
import { withErrorBoundary } from '../hocs/withErrorBoundary.jsx';
import { useAuthState } from '../contexts/AuthContext.jsx';
import { Spinner } from '../components/primitives/Spinner.jsx';

import { routes } from './index.js';

function LoadingFallback() {
  return (
    <div style={{ padding: 40, display: 'flex', justifyContent: 'center' }}>
      <Spinner size={28} />
    </div>
  );
}

function SceneWrapper({ route }) {
  const Scene = route.scene;
  const Wrapped = useMemo(
    () => withErrorBoundary(withPrefetch(withSecurity(Scene, route), route)),
    [Scene, route],
  );
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Wrapped />
    </Suspense>
  );
}

export function Router() {
  const { status } = useAuthState();
  const isAuthLoading = status === 'loading' || status === 'idle';

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <RouteWithStatus route={route} status={status} isAuthLoading={isAuthLoading} />
          }
        />
      ))}
      <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
}

function RouteWithStatus({ route, status, isAuthLoading }) {
  // Show a spinner while auth is loading, but only for non-public routes —
  // public routes should render immediately even during initial auth check.
  if (isAuthLoading && !route.public) {
    return <LoadingFallback />;
  }
  return <SceneWrapper route={route} />;
}