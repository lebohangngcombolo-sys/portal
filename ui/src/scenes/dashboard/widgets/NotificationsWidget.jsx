/**
 * Notifications widget — recent unread notifications.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../common/constants/routes.js';
import { useNotifications } from '../../../contexts/NotificationContext.jsx';
import { Card } from '../../../components/primitives/Card.jsx';
import { Spinner } from '../../../components/primitives/Spinner.jsx';

export function NotificationsWidget() {
  const { t } = useTranslation();
  const { notifications, unreadCount, loading, refresh } = useNotifications();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Card>
      <h3>
        {t('navigation.notifications')}{' '}
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </h3>
      {loading && <Spinner />}
      {!loading && notifications.length === 0 && (
        <p className="hint">{t('notifications.center.empty')}</p>
      )}
      <ul>
        {notifications.slice(0, 5).map((n) => (
          <li key={n.id}>
            <strong>{n.subject || t('notifications.center.noSubject', { defaultValue: 'Notification' })}</strong>
            <span className="hint">{n.channel}</span>
          </li>
        ))}
      </ul>
      <Link to={ROUTES.ACCOUNT_NOTIFICATIONS}>{t('notifications.center.all')}</Link>
    </Card>
  );
}