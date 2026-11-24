/**
 * Role and permission helpers built on top of the session user.
 *
 * Usage:
 *   const { can, hasRole, hasAnyRole, isAdmin } = usePermissions();
 *   if (can(PERMISSIONS.KYC_CASE_APPROVE)) { ... }
 */

import { useCallback, useMemo } from 'react';

import { useSessionUser } from './useSessionUser.js';
import {
  ROLES,
  hasRole as hasRoleFn,
  hasAnyRole as hasAnyRoleFn,
  expandRoles,
} from '../common/constants/userRoles.js';

export function usePermissions() {
  const { roles, effectiveRoles, user } = useSessionUser();

  const isStaff = useMemo(
    () =>
      hasAnyRoleFn(effectiveRoles, [
        ROLES.ADMIN,
        ROLES.SUPER_ADMIN,
        ROLES.KYC_ANALYST,
        ROLES.KYC_SUPERVISOR,
        ROLES.COMPLIANCE_OFFICER,
        ROLES.SUPPORT,
      ]),
    [effectiveRoles],
  );

  const isAdmin = useMemo(
    () => hasAnyRoleFn(effectiveRoles, [ROLES.ADMIN, ROLES.SUPER_ADMIN]),
    [effectiveRoles],
  );

  const isSuperAdmin = useMemo(
    () => hasRoleFn(effectiveRoles, ROLES.SUPER_ADMIN),
    [effectiveRoles],
  );

  const isKycAnalyst = useMemo(
    () =>
      hasAnyRoleFn(effectiveRoles, [
        ROLES.KYC_ANALYST,
        ROLES.KYC_SUPERVISOR,
        ROLES.ADMIN,
        ROLES.SUPER_ADMIN,
      ]),
    [effectiveRoles],
  );

  const hasRole = useCallback((role) => hasRoleFn(effectiveRoles, role), [effectiveRoles]);

  const hasAnyRole = useCallback((list) => hasAnyRoleFn(effectiveRoles, list), [effectiveRoles]);

  /**
   * Returns true if the current user has the given permission.
   *
   * The backend enforces permissions via JWTs; this is a mirror for UI
   * affordances. Permissions are encoded in the token claims under `roles`.
   * Until the backend adds explicit permission claims, permission checks
   * fall back to role checks.
   */
  const can = useCallback(
    (permission) => {
      const rolesEff = effectiveRoles;
      // Permission → roles mapping (mirrors backend role-to-permission grants)
      const map = {
        'identity.user.read': [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SUPPORT, ROLES.COMPLIANCE_OFFICER],
        'identity.user.admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'identity.role.read': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'identity.role.write': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'identity.permission.read': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'country.admin': [ROLES.SUPER_ADMIN],
        'country.config.publish': [ROLES.SUPER_ADMIN],
        'country.config.rollback': [ROLES.SUPER_ADMIN],
        'customer.read': [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SUPPORT, ROLES.COMPLIANCE_OFFICER, ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR],
        'customer.admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'organization.read': [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SUPPORT, ROLES.COMPLIANCE_OFFICER, ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR],
        'kyc.case.read': [ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COMPLIANCE_OFFICER],
        'kyc.case.review': [ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'kyc.case.approve': [ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'kyc.case.reject': [ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'kyc.decision.view': [ROLES.KYC_ANALYST, ROLES.KYC_SUPERVISOR, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.COMPLIANCE_OFFICER],
        'notification.read': [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SUPPORT],
        'notification.template.admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
        'notification.delivery.admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
      };
      const allowedRoles = map[permission] || [];
      return allowedRoles.some((r) => rolesEff.includes(r));
    },
    [effectiveRoles],
  );

  return {
    user,
    roles,
    effectiveRoles,
    isStaff,
    isAdmin,
    isSuperAdmin,
    isKycAnalyst,
    hasRole,
    hasAnyRole,
    can,
  };
}