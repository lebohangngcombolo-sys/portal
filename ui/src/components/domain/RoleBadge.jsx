/**
 * Role badge — maps role codes to friendly labels and colors.
 */
import { Badge } from '../primitives/Badge.jsx';

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  KYC_ANALYST: 'KYC Analyst',
  KYC_SUPERVISOR: 'KYC Supervisor',
  COMPLIANCE_OFFICER: 'Compliance',
  SUPPORT: 'Support',
  CUSTOMER: 'Customer',
};

const ROLE_VARIANTS = {
  SUPER_ADMIN: 'error',
  ADMIN: 'warning',
  KYC_ANALYST: 'info',
  KYC_SUPERVISOR: 'info',
  COMPLIANCE_OFFICER: 'info',
  SUPPORT: 'neutral',
  CUSTOMER: 'neutral',
};

export function RoleBadge({ role, className }) {
  if (!role) return null;
  return (
    <Badge variant={ROLE_VARIANTS[role] || 'neutral'} className={className}>
      {ROLE_LABELS[role] || role}
    </Badge>
  );
}