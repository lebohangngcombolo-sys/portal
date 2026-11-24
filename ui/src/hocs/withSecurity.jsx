/**
 * Security HOC — enforces authentication and role requirements.
 *
 * Behavior:
 * - Public routes: render as-is.
 * - Protected routes when not authenticated: redirect to login with a
 *   `?redirect=` param so the user can be sent back after signing in.
 * - Protected routes when authenticated but lacking the required role:
 *   render the Forbidden scene.
 * - Protected routes when authenticated and authorized: render the scene.
 */
import { Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from '../common/constants/routes.js';
import { useAuthState } from '../contexts/AuthContext.jsx';
import { useSessionUser } from '../hooks/useSessionUser.js';
import { canAccessRoute } from '../routes/roleGuards.js';
import { ForbiddenScene } from '../scenes/error/ForbiddenScene.jsx';

export function withSecurity(Component, route = {}) {
  function ProtectedComponent(props) {
    const { status } = useAuthState();
    const { effectiveRoles, isLoading } = useSessionUser();
    const location = useLocation();

    // Public routes always render
    if (route.public) {
      return <Component {...props} />;
    }

    // Not authenticated → bounce to login with a redirect param
    if (status === 'unauthenticated') {
      const redirectTo = `${location.pathname}${location.search}`;
      const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirectTo)}`;
      return <Navigate to={loginUrl} replace />;
    }

    // Still loading user roles — allow the scene to render; it can use
    // usePermissions() if it needs to wait for specific permissions
    if (isLoading) {
      return <Component {...props} />;
    }

    // Authenticated but lacking the required role
    if (!canAccessRoute(effectiveRoles, route)) {
      return <ForbiddenScene />;
    }

    return <Component {...props} />;
  }

  ProtectedComponent.displayName = `withSecurity(${Component.displayName || Component.name || 'Component'})`;
  return ProtectedComponent;
}