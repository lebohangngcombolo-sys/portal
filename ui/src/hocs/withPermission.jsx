/**
 * Render guard for a single role/permission.
 *
 * Usage:
 *   const ApproveButton = withPermission(Button, { role: ROLES.KYC_SUPERVISOR });
 *   // or
 *   const ApproveButton = withPermission(Button, { permission: 'kyc.case.approve' });
 *
 * Renders a fallback (or nothing) when the user does not have access.
 */
import { usePermissions } from '../hooks/usePermissions.js';

export function withPermission(Component, { role, permission, fallback = null } = {}) {
  function GuardedComponent(props) {
    const { hasRole, can } = usePermissions();

    if (role && !hasRole(role)) return fallback;
    if (permission && !can(permission)) return fallback;
    return <Component {...props} />;
  }

  GuardedComponent.displayName = `withPermission(${Component.displayName || Component.name || 'Component'})`;
  return GuardedComponent;
}