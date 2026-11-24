/**
 * KYC-related status codes (spec §6.2).
 */

// ------------------------------------------------------------------ case
export const KYC_CASE_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  IN_REVIEW: 'IN_REVIEW',
  INFORMATION_REQUESTED: 'INFORMATION_REQUESTED',
  RESUBMITTED: 'RESUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
});

export const KYC_CASE_STATUS_LIST = Object.freeze(Object.values(KYC_CASE_STATUS));

/**
 * Statuses considered terminal — no further edits allowed.
 */
export const KYC_TERMINAL_STATUSES = Object.freeze([
  KYC_CASE_STATUS.APPROVED,
  KYC_CASE_STATUS.REJECTED,
]);

/**
 * Statuses where the case is waiting on the customer.
 */
export const KYC_CUSTOMER_ACTION_STATUSES = Object.freeze([
  KYC_CASE_STATUS.DRAFT,
  KYC_CASE_STATUS.INFORMATION_REQUESTED,
]);

/**
 * Statuses where the case is waiting on an analyst.
 */
export const KYC_ANALYST_ACTION_STATUSES = Object.freeze([
  KYC_CASE_STATUS.SUBMITTED,
  KYC_CASE_STATUS.IN_REVIEW,
  KYC_CASE_STATUS.RESUBMITTED,
]);

// ------------------------------------------------------------------ organization
export const ORGANIZATION_STATUS = Object.freeze({
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
});

export const ORGANIZATION_STATUS_LIST = Object.freeze(Object.values(ORGANIZATION_STATUS));

export const ORGANIZATION_EDITABLE_STATUSES = Object.freeze([
  ORGANIZATION_STATUS.DRAFT,
  ORGANIZATION_STATUS.WITHDRAWN,
]);

// ------------------------------------------------------------------ decision
export const KYC_DECISION = Object.freeze({
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
});

// ------------------------------------------------------------------ risk
export const RISK_LEVEL = Object.freeze({
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
});

export const RISK_LEVEL_LIST = Object.freeze(Object.values(RISK_LEVEL));

/**
 * Risk levels that require a second reviewer (spec §6.4).
 */
export const HIGH_RISK_LEVELS = Object.freeze([RISK_LEVEL.HIGH, RISK_LEVEL.CRITICAL]);

// ------------------------------------------------------------------ case types
export const KYC_CASE_TYPE = Object.freeze({
  ONBOARDING: 'ONBOARDING',
  PERIODIC_REVIEW: 'PERIODIC_REVIEW',
  ENHANCED_DUE_DILIGENCE: 'ENHANCED_DUE_DILIGENCE',
});

export const KYC_CASE_TYPE_LIST = Object.freeze(Object.values(KYC_CASE_TYPE));