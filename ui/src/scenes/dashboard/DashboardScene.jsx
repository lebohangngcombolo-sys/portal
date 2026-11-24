/**
 * Dashboard — the authenticated landing page.
 *
 * Composes five widgets:
 * - WelcomeWidget: greeting + key actions
 * - ProfileStatusWidget: profile completion
 * - KycStatusWidget: current KYC case + organization status
 * - NotificationsWidget: recent notifications
 * - ActionsWidget: quick links based on the user's role
 */
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { WelcomeWidget } from './widgets/WelcomeWidget.jsx';
import { ProfileStatusWidget } from './widgets/ProfileStatusWidget.jsx';
import { KycStatusWidget } from './widgets/KycStatusWidget.jsx';
import { NotificationsWidget } from './widgets/NotificationsWidget.jsx';
import { ActionsWidget } from './widgets/ActionsWidget.jsx';

export default function DashboardScene() {
  const { t } = useTranslation();
  return (
    <PageLayout title={t('navigation.dashboard')}>
      <div className="dashboard-grid">
        <div className="dashboard-grid__hero">
          <WelcomeWidget />
        </div>
        <div className="dashboard-grid__side">
          <ProfileStatusWidget />
          <KycStatusWidget />
        </div>
        <div className="dashboard-grid__bottom">
          <ActionsWidget />
          <NotificationsWidget />
        </div>
      </div>
    </PageLayout>
  );
}