/**
 * Protected routes — helper for non-Router consumers.
 */
import { routes } from './index.js';

export const protectedRoutes = routes.filter((r) => !r.public);
export const protectedPaths = protectedRoutes.map((r) => r.path);