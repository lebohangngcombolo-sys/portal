/**
 * API path constants per service, matching spec §1.2 and the gateway routes.
 *
 * All paths are relative to the gateway base URL (BFF_URL). The gateway
 * proxies /api/v1/identity/** → identity-service, etc.
 */

export const API_BASE = '/api/v1';

// ------------------------------------------------------------------ identity
export const IDENTITY_API = Object.freeze({
  REGISTER: `${API_BASE}/identity/register`,
  VERIFY_EMAIL: `${API_BASE}/identity/verify-email`,
  RESEND_VERIFICATION: `${API_BASE}/identity/resend-verification`,
  VERIFICATION_STATUS: `${API_BASE}/identity/verification-status`,
  LOGIN: `${API_BASE}/identity/login`,
  REFRESH: `${API_BASE}/identity/refresh`,
  LOGOUT: `${API_BASE}/identity/logout`,
  LOGOUT_ALL: `${API_BASE}/identity/logout-all`,
  ME: `${API_BASE}/identity/me`,
  SESSIONS: `${API_BASE}/identity/sessions`,
  SESSION: (sessionId) => `${API_BASE}/identity/sessions/${sessionId}`,
  PASSWORD_FORGOT: `${API_BASE}/identity/password/forgot`,
  PASSWORD_RESET: `${API_BASE}/identity/password/reset`,
  PASSWORD_CHANGE: `${API_BASE}/identity/password/change`,
  PASSWORD_VALIDATE: `${API_BASE}/identity/password/validate`,
  MFA_SETUP_TOTP: `${API_BASE}/identity/mfa/setup/totp`,
  MFA_VERIFY_SETUP: `${API_BASE}/identity/mfa/verify-setup`,
  MFA_DISABLE: `${API_BASE}/identity/mfa/disable`,
  MFA_CHALLENGE: `${API_BASE}/identity/mfa/challenge`,
  MFA_VERIFY: `${API_BASE}/identity/mfa/verify`,
  MFA_STATUS: `${API_BASE}/identity/mfa/status`,
  MFA_RECOVERY_REGENERATE: `${API_BASE}/identity/mfa/recovery-codes/regenerate`,
  ADMIN_USERS: `${API_BASE}/identity/admin/users`,
  ADMIN_USER: (id) => `${API_BASE}/identity/admin/users/${id}`,
  ADMIN_USER_STATUS: (id) => `${API_BASE}/identity/admin/users/${id}/status`,
  ADMIN_USER_UNLOCK: (id) => `${API_BASE}/identity/admin/users/${id}/unlock`,
  ADMIN_USER_ROLES: (id) => `${API_BASE}/identity/admin/users/${id}/roles`,
  ADMIN_ROLES: `${API_BASE}/identity/admin/roles`,
  ADMIN_PERMISSIONS: `${API_BASE}/identity/admin/permissions`,
});

// ------------------------------------------------------------------ country
export const COUNTRY_API = Object.freeze({
  COUNTRIES: `${API_BASE}/countries`,
  COUNTRY: (code) => `${API_BASE}/countries/${code}`,
  COUNTRY_CURRENCIES: (code) => `${API_BASE}/countries/${code}/currencies`,
  COUNTRY_LANGUAGES: (code) => `${API_BASE}/countries/${code}/languages`,
  COUNTRY_REQUIREMENTS: (code) => `${API_BASE}/countries/${code}/requirements`,
  COUNTRY_KYC_REQUIREMENTS: (code) => `${API_BASE}/countries/${code}/kyc-requirements`,
  COUNTRY_ORG_REQUIREMENTS: (code) => `${API_BASE}/countries/${code}/organization-requirements`,
  COUNTRY_CONFIGURATION: (code) => `${API_BASE}/countries/${code}/configuration`,
  COUNTRY_CONFIGURATION_VERSIONS: (code) => `${API_BASE}/countries/${code}/configuration/versions`,
  COUNTRY_CONFIGURATION_VERSION: (code, v) => `${API_BASE}/countries/${code}/configuration/versions/${v}`,
  COUNTRY_CONFIGURATION_PUBLISH: (code) => `${API_BASE}/countries/${code}/configuration/publish`,
  COUNTRY_CONFIGURATION_ROLLBACK: (code) => `${API_BASE}/countries/${code}/configuration/rollback`,
  CURRENCIES: `${API_BASE}/currencies`,
  LANGUAGES: `${API_BASE}/languages`,
  ORG_REQUIREMENT: (id) => `${API_BASE}/organization-requirements/${id}`,
  ORG_REQUIREMENT_STATUS: (id) => `${API_BASE}/organization-requirements/${id}/status`,
  KYC_REQUIREMENT: (id) => `${API_BASE}/kyc-requirements/${id}`,
  KYC_REQUIREMENT_STATUS: (id) => `${API_BASE}/kyc-requirements/${id}/status`,
});

// ------------------------------------------------------------------ notifications
export const NOTIFICATION_API = Object.freeze({
  BASE: `${API_BASE}/notifications`,
  SUBMIT: `${API_BASE}/notifications`,
  SUBMIT_EMAIL: `${API_BASE}/notifications/email`,
  SUBMIT_SMS: `${API_BASE}/notifications/sms`,
  SUBMIT_IN_APP: `${API_BASE}/notifications/in-app`,
  SUBMIT_BULK: `${API_BASE}/notifications/bulk`,
  BY_ID: (id) => `${API_BASE}/notifications/${id}`,

  MY_LIST: `${API_BASE}/notifications/me`,
  MY_UNREAD_COUNT: `${API_BASE}/notifications/me/unread-count`,
  MY_BY_ID: (id) => `${API_BASE}/notifications/me/${id}`,
  MY_MARK_READ: (id) => `${API_BASE}/notifications/me/${id}/read`,
  MY_MARK_ALL_READ: `${API_BASE}/notifications/me/read-all`,
  MY_ARCHIVE: (id) => `${API_BASE}/notifications/me/${id}`,

  PREFERENCES: `${API_BASE}/notifications/preferences`,
  PREFERENCE_CHANNEL: (channel) => `${API_BASE}/notifications/preferences/${channel}`,

  ADMIN_TEMPLATES: `${API_BASE}/notifications/admin/templates`,
  ADMIN_TEMPLATE: (id) => `${API_BASE}/notifications/admin/templates/${id}`,
  ADMIN_TEMPLATE_STATUS: (id) => `${API_BASE}/notifications/admin/templates/${id}/status`,
  ADMIN_TEMPLATE_PREVIEW: (id) => `${API_BASE}/notifications/admin/templates/${id}/preview`,
  ADMIN_DELIVERIES: `${API_BASE}/notifications/admin/deliveries`,
  ADMIN_DELIVERY: (id) => `${API_BASE}/notifications/admin/deliveries/${id}`,
  ADMIN_DELIVERY_RETRY: (id) => `${API_BASE}/notifications/admin/deliveries/${id}/retry`,
  ADMIN_PROVIDERS: `${API_BASE}/notifications/admin/providers`,
  ADMIN_HEALTH: `${API_BASE}/notifications/admin/health`,
});

// ------------------------------------------------------------------ customers
export const CUSTOMER_API = Object.freeze({
  MY_PROFILE: `${API_BASE}/customers/me/profile`,
  CUSTOMER: (id) => `${API_BASE}/customers/${id}`,
  CUSTOMERS: `${API_BASE}/customers`,
  CUSTOMER_STATUS: (id) => `${API_BASE}/customers/${id}/status`,
});

// ------------------------------------------------------------------ organizations
export const ORGANIZATION_API = Object.freeze({
  BASE: `${API_BASE}/organizations`,
  ORGANIZATION: (id) => `${API_BASE}/organizations/${id}`,
  ORGANIZATION_SUBMIT: (id) => `${API_BASE}/organizations/${id}/submit`,
  ORGANIZATION_WITHDRAW: (id) => `${API_BASE}/organizations/${id}/withdraw`,
  ORGANIZATION_STATUS: (id) => `${API_BASE}/organizations/${id}/status`,

  REPRESENTATIVES: (id) => `${API_BASE}/organizations/${id}/representatives`,
  REPRESENTATIVE: (id, repId) => `${API_BASE}/organizations/${id}/representatives/${repId}`,
  REPRESENTATIVE_VERIFY: (id, repId) =>
    `${API_BASE}/organizations/${id}/representatives/${repId}/verify`,

  BENEFICIAL_OWNERS: (id) => `${API_BASE}/organizations/${id}/beneficial-owners`,
  BENEFICIAL_OWNER: (id, ownerId) =>
    `${API_BASE}/organizations/${id}/beneficial-owners/${ownerId}`,
  OWNERSHIP_SUBMIT: (id) => `${API_BASE}/organizations/${id}/ownership/submit`,

  KYC_CASES: (id) => `${API_BASE}/organizations/${id}/kyc-cases`,
});

// ------------------------------------------------------------------ kyc
export const KYC_API = Object.freeze({
  CASE: (caseId) => `${API_BASE}/kyc/cases/${caseId}`,
  CASE_REQUIREMENTS: (caseId) => `${API_BASE}/kyc/cases/${caseId}/requirements`,
  CASE_DOCUMENTS: (caseId) => `${API_BASE}/kyc/cases/${caseId}/documents`,
  CASE_DOCUMENT: (caseId, documentId) => `${API_BASE}/kyc/cases/${caseId}/documents/${documentId}`,
  CASE_SUBMIT: (caseId) => `${API_BASE}/kyc/cases/${caseId}/submit`,
  CASE_RESUBMIT: (caseId) => `${API_BASE}/kyc/cases/${caseId}/resubmit`,
  CASE_REQUEST_INFO: (caseId) => `${API_BASE}/kyc/cases/${caseId}/request-information`,
  CASE_ASSIGN: (caseId) => `${API_BASE}/kyc/cases/${caseId}/assign`,
  CASE_APPROVE: (caseId) => `${API_BASE}/kyc/cases/${caseId}/approve`,
  CASE_REJECT: (caseId) => `${API_BASE}/kyc/cases/${caseId}/reject`,
  CASE_REVIEWS: (caseId) => `${API_BASE}/kyc/cases/${caseId}/reviews`,
  CASE_REVIEW: (caseId, reviewId) => `${API_BASE}/kyc/cases/${caseId}/reviews/${reviewId}`,
  CASE_REVIEW_COMPLETE: (caseId, reviewId) =>
    `${API_BASE}/kyc/cases/${caseId}/reviews/${reviewId}/complete`,
  CASE_DECISIONS: (caseId) => `${API_BASE}/kyc/cases/${caseId}/decisions`,
  CASES: `${API_BASE}/kyc/cases`,
});