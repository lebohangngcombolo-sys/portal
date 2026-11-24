/**
 * Client-side mirror of KYC rules (spec §6.4).
 *
 * These rules power UI affordances (button enablement, hint messages).
 * The server is the authoritative enforcer.
 */

import {
  KYC_CASE_STATUS,
  KYC_CUSTOMER_ACTION_STATUSES,
  KYC_TERMINAL_STATUSES,
  KYC_ANALYST_ACTION_STATUSES,
  HIGH_RISK_LEVELS,
} from '../constants/kycStatus.js';

/**
 * True if the customer can edit evidence on this case.
 */
export function canCustomerEditCase(caseData) {
  return (
    caseData != null &&
    KYC_CUSTOMER_ACTION_STATUSES.includes(caseData.status)
  );
}

/**
 * True if the customer can submit this case (from DRAFT or after INFO_REQUESTED via resubmit).
 */
export function canCustomerSubmitCase(caseData) {
  return caseData?.status === KYC_CASE_STATUS.DRAFT;
}

/**
 * True if the customer can resubmit this case.
 */
export function canCustomerResubmitCase(caseData) {
  return caseData?.status === KYC_CASE_STATUS.INFORMATION_REQUESTED;
}

/**
 * True if the analyst can review this case.
 */
export function canAnalystReviewCase(caseData) {
  return caseData != null && KYC_ANALYST_ACTION_STATUSES.includes(caseData.status);
}

/**
 * True if the analyst can approve or reject this case.
 */
export function canAnalystDecideCase(caseData) {
  return (
    caseData != null &&
    (caseData.status === KYC_CASE_STATUS.IN_REVIEW ||
      caseData.status === KYC_CASE_STATUS.RESUBMITTED)
  );
}

/**
 * True if the case requires a second reviewer (HIGH or CRITICAL risk).
 */
export function requiresSecondReviewer(caseData) {
  return caseData?.riskLevel && HIGH_RISK_LEVELS.includes(caseData.riskLevel);
}

/**
 * True if separation of duties should prevent this reviewer from acting.
 * The server enforces this; the UI mirrors it to disable the button.
 */
export function violatesSeparationOfDuties(caseData, reviewerUserId, organizationCreatorId) {
  if (!caseData || !reviewerUserId) return false;
  if (reviewerUserId === organizationCreatorId) return true;
  return false;
}

/**
 * True if the case is in a terminal state.
 */
export function isCaseTerminal(caseData) {
  return caseData != null && KYC_TERMINAL_STATUSES.includes(caseData.status);
}

/**
 * Count the required KYC requirements that are not yet satisfied by evidence.
 */
export function countMissingRequirements(requirements) {
  if (!Array.isArray(requirements)) return 0;
  return requirements.filter((r) => r.required && !r.satisfied).length;
}