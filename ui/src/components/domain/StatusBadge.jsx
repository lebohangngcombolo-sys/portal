/**
 * Status badge — maps domain status codes to Badge variants.
 *
 * Covers: user status, organization status, KYC case status, document
 * status, decision outcome, risk level.
 */
import { Badge } from '../primitives/Badge.jsx';

const STATUS_VARIANTS = {
  // identity
  ACTIVE: 'success',
  PENDING_VERIFICATION: 'warning',
  PENDING: 'warning',
  SUSPENDED: 'error',
  LOCKED: 'error',
  CLOSED: 'neutral',

  // organization
  DRAFT: 'neutral',
  PENDING_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  WITHDRAWN: 'neutral',

  // KYC case
  SUBMITTED: 'info',
  IN_REVIEW: 'info',
  INFORMATION_REQUESTED: 'warning',
  RESUBMITTED: 'info',

  // KYC decisions
  REJECTED_BY_COMPLIANCE: 'error',

  // document status
  SCANNING: 'info',
  ACCEPTED: 'success',
  EXPIRED: 'error',

  // risk level
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error',
  CRITICAL: 'error',
};

export function StatusBadge({ status, prefix = 'kyc.statuses', className }) {
  if (!status) return null;
  const variant = STATUS_VARIANTS[status] || 'neutral';
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}