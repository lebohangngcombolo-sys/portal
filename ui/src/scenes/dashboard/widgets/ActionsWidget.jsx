/**
 * Actions widget — quick links based on the user's role.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../common/constants/routes.js';
import { usePermissions } from '../../../hooks/usePermissions.js';
import { Card } from '../../../components/primitives/Card.jsx';
import { Button } from '../../../components/primitives/Button.jsx';

export function ActionsWidget() {
  const { t } = useTranslation();
  const { isAdmin, isSuperAdmin, isKycAnalyst } = usePermissions();

  const actions = [];

  // Customer
  actions.push({ to: ROUTES.ORGANIZATIONS, label: t('navigation.organizations') });

  // KYC
  if (isKycAnalyst) actions.push({ to: ROUTES.KYC_CASES, label: t('navigation.kycCases') });

  // Admin
  if (isAdmin) {
    actions.push({ to: ROUTES.ADMIN_USERS, label: t('navigation.users') });
    actions.push({ to: ROUTES.ADMIN_TEMPLATES, label: t('navigation.templates') });
  }
  if (isSuperAdmin) {
    actions.push({ to: ROUTES.ADMIN_COUNTRIES, label: t('navigation.countries') });
  }

  return (
    <Card>
      <h3>{t('dashboard.quickActions')}</h3>
      <div className="actions-widget__grid">
        {actions.map((a) => (
          <Link key={a.to} to={a.to}>
            <Button variant="ghost">{a.label}</Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}