/**
 * Role and permission codes.
 *
 * Mirror of PermissionCode from the backend's security-starter.
 * Keep this file in sync when new roles/permissions are added on the server.
 */

// ------------------------------------------------------------------ roles
export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  KYC_ANALYST: 'KYC_ANALYST',
  KYC_SUPERVISOR: 'KYC_SUPERVISOR',
  COMPLIANCE_OFFICER: 'COMPLIANCE_OFFICER',
  SUPPORT: 'SUPPORT',
  CUSTOMER: 'CUSTOMER',
});

export const STAFF_ROLES = Object.freeze([
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
  ROLES.KYC_ANALYST,
  ROLES.KYC_SUPERVISOR,
  ROLES.COMPLIANCE_OFFICER,
  ROLES.SUPPORT,
]);

export const KYC_ROLES = Object.freeze([
  ROLES.KYC_ANALYST,
  ROLES.KYC_SUPERVISOR,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
]);

// ------------------------------------------------------------------ permissions
export const PERMISSIONS = Object.freeze({
  // identity
  IDENTITY_USER_READ: 'identity.user.read',
  IDENTITY_USER_ADMIN: 'identity.user.admin',
  IDENTITY_ROLE_READ: 'identity.role.read',
  IDENTITY_ROLE_WRITE: 'identity.role.write',
  IDENTITY_PERMISSION_READ: 'identity.permission.read',

  // country
  COUNTRY_READ: 'country.read',
  COUNTRY_ADMIN: 'country.admin',
  COUNTRY_CONFIG_PUBLISH: 'country.config.publish',
  COUNTRY_CONFIG_ROLLBACK: 'country.config.rollback',

  // customer
  CUSTOMER_READ: 'customer.read',
  CUSTOMER_ADMIN: 'customer.admin',
  ORGANIZATION_READ: 'organization.read',
  ORGANIZATION_MANAGE: 'organization.manage',
  ORGANIZATION_SUBMIT: 'organization.submit',

  // kyc
  KYC_CASE_READ: 'kyc.case.read',
  KYC_CASE_REVIEW: 'kyc.case.review',
  KYC_CASE_APPROVE: 'kyc.case.approve',
  KYC_CASE_REJECT: 'kyc.case.reject',
  KYC_DECISION_VIEW: 'kyc.decision.view',

  // notifications
  NOTIFICATION_SUBMIT: 'notification.submit',
  NOTIFICATION_READ: 'notification.read',
  NOTIFICATION_TEMPLATE_ADMIN: 'notification.template.admin',
  NOTIFICATION_DELIVERY_ADMIN: 'notification.delivery.admin',
});

/**
 * Role hierarchy — mirrors the backend's configured hierarchy.
 * A user with SUPER_ADMIN implicitly has every role below.
 */
export const ROLE_HIERARCHY = Object.freeze({
  [ROLES.SUPER_ADMIN]: [ROLES.ADMIN],
  [ROLES.ADMIN]: [
    ROLES.KYC_ANALYST,
    ROLES.KYC_SUPERVISOR,
    ROLES.COMPLIANCE_OFFICER,
    ROLES.SUPPORT,
  ],
  [ROLES.KYC_SUPERVISOR]: [ROLES.KYC_ANALYST],
});

/**
 * Compute the effective role set for a user, expanding the hierarchy.
 */
export function expandRoles(rawRoles) {
  if (!Array.isArray(rawRoles)) return [];
  const result = new Set(rawRoles);
  for (const role of rawRoles) {
    const implied = ROLE_HIERARCHY[role] || [];
    implied.forEach((r) => result.add(r));
  }
  return Array.from(result);
}

/**
 * True if the given user roles include the required role (through hierarchy).
 */
export function hasRole(userRoles, required) {
  if (!Array.isArray(userRoles)) return false;
  return expandRoles(userRoles).includes(required);
}

/**
 * True if the given user roles include any of the required roles.
 */
export function hasAnyRole(userRoles, requiredList) {
  if (!Array.isArray(userRoles) || !Array.isArray(requiredList)) return false;
  const effective = expandRoles(userRoles);
  return requiredList.some((r) => effective.includes(r));
}