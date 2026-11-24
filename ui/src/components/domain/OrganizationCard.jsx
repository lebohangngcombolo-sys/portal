/**
 * Compact organization summary card — legal name, status, and a link to
 * the detail scene.
 */
import { Link } from 'react-router-dom';

import { routeBuilders } from '../../common/constants/routes.js';
import { Card } from '../primitives/Card.jsx';
import { StatusBadge } from './StatusBadge.jsx';

export function OrganizationCard({ organization }) {
  if (!organization) return null;
  return (
    <Card>
      <Link to={routeBuilders.organizationDetail(organization.id)}>
        <strong>{organization.legalName}</strong>
      </Link>
      <div>
        <StatusBadge status={organization.status} />
      </div>
    </Card>
  );
}