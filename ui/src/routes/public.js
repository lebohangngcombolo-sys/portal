/**
 * Public routes — helper for non-Router consumers.
 *
 * Exposes the set of paths that are accessible without authentication.
 */
import { routes } from './index.js';

export const publicRoutes = routes.filter((r) => r.public);
export const publicPaths = publicRoutes.map((r) => r.path);

export function isPublicPath(pathname) {
  return publicPaths.some((p) => {
    if (p === '*') return false;
    if (p.includes(':')) {
      // Convert /path/:id to a simple prefix check
      const prefix = p.split(':')[0];
      return pathname.startsWith(prefix);
    }
    return pathname === p;
  });
}