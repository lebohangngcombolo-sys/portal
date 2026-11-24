/**
 * Role-based route guards.
 *
 * The `roles` array on a route restricts which roles may view it. An empty
 * array (or absent) means any authenticated user.
 */
import { hasAnyRole } from '../common/constants/userRoles.js';

/**
 * True if the given user roles satisfy the route's role requirements.
 */
export function canAccessRoute(userRoles, route) {
  if (!route?.roles || route.roles.length === 0) return true;
  return hasAnyRole(userRoles, route.roles);
}

/**
 * First accessible route from a list — used to redirect after login when
 * the user does not have access to their last-visited page.
 */
export function firstAccessibleRoute(userRoles, fallback) {
  return fallback;
}