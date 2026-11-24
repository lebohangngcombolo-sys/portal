/**
 * Route path constants.
 *
 * Every scene's canonical path is defined here. Routes are registered
 * in `src/routes/index.js` and referenced throughout the app (links,
 * redirects, guards) — never hardcoded strings.
 */
export const ROUTES = Object.freeze({
  // ---------- public
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  MFA_CHALLENGE: '/mfa-challenge',

  // ---------- authenticated
  DASHBOARD: '/dashboard',

  // account
  ACCOUNT_PROFILE: '/account/profile',
  ACCOUNT_SECURITY: '/account/security',
  ACCOUNT_SESSIONS: '/account/sessions',
  ACCOUNT_MFA: '/account/mfa',
  ACCOUNT_NOTIFICATIONS: '/account/notifications',
  ACCOUNT_PREFERENCES: '/account/preferences',

  // organizations
  ORGANIZATIONS: '/organizations',
  ORGANIZATIONS_NEW: '/organizations/new',
  ORGANIZATION_DETAIL: '/organizations/:id',
  ORGANIZATION_EDIT: '/organizations/:id/edit',
  ORGANIZATION_REPRESENTATIVES: '/organizations/:id/representatives',
  ORGANIZATION_BENEFICIAL_OWNERS: '/organizations/:id/beneficial-owners',
  ORGANIZATION_OWNERSHIP: '/organizations/:id/ownership',
  ORGANIZATION_SUBMIT: '/organizations/:id/submit',

  // kyc
  KYC_CASES: '/kyc/cases',
  KYC_CASE_DETAIL: '/kyc/cases/:id',
  KYC_CASE_DOCUMENTS: '/kyc/cases/:id/documents',
  KYC_CASE_REVIEW: '/kyc/cases/:id/review',
  KYC_CASE_DECISION: '/kyc/cases/:id/decision',
  KYC_RESUBMIT: '/kyc/cases/:id/resubmit',

  // admin
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_COUNTRIES: '/admin/countries',
  ADMIN_COUNTRY_DETAIL: '/admin/countries/:code',
  ADMIN_COUNTRY_CONFIG: '/admin/countries/:code/config',
  ADMIN_COUNTRY_KYC_REQUIREMENTS: '/admin/countries/:code/kyc-requirements',
  ADMIN_COUNTRY_ORG_REQUIREMENTS: '/admin/countries/:code/org-requirements',
  ADMIN_TEMPLATES: '/admin/notification-templates',
  ADMIN_DELIVERIES: '/admin/notification-deliveries',

  // errors
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
  MAINTENANCE: '/maintenance',
  NOT_FOUND: '*',
});

/**
 * Route builders for paths with dynamic segments.
 * Use these instead of string-concatenating paths in code.
 */
export const routeBuilders = Object.freeze({
  organizationDetail: (id) => `/organizations/${id}`,
  organizationEdit: (id) => `/organizations/${id}/edit`,
  organizationRepresentatives: (id) => `/organizations/${id}/representatives`,
  organizationBeneficialOwners: (id) => `/organizations/${id}/beneficial-owners`,
  organizationOwnership: (id) => `/organizations/${id}/ownership`,
  organizationSubmit: (id) => `/organizations/${id}/submit`,
  kycCaseDetail: (id) => `/kyc/cases/${id}`,
  kycCaseDocuments: (id) => `/kyc/cases/${id}/documents`,
  kycCaseReview: (id) => `/kyc/cases/${id}/review`,
  kycCaseDecision: (id) => `/kyc/cases/${id}/decision`,
  kycResubmit: (id) => `/kyc/cases/${id}/resubmit`,
  adminCountryDetail: (code) => `/admin/countries/${code}`,
  adminCountryConfig: (code) => `/admin/countries/${code}/config`,
  adminCountryKycRequirements: (code) => `/admin/countries/${code}/kyc-requirements`,
  adminCountryOrgRequirements: (code) => `/admin/countries/${code}/org-requirements`,
});

/**
 * Paths reachable without authentication.
 */
export const PUBLIC_ROUTES = Object.freeze([
  ROUTES.ROOT,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.VERIFY_EMAIL,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.MFA_CHALLENGE,
  ROUTES.FORBIDDEN,
  ROUTES.SERVER_ERROR,
  ROUTES.MAINTENANCE,
]);