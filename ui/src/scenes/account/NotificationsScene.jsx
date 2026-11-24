/**
 * Notifications scene — full notification center.
 *
 * Uses the NotificationContext for the list; supports per-item read and
 * archive, plus a "mark all read" bulk action.
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useNotifications } from '../../contexts/NotificationContext.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { EmptyState } from '../../components/primitives/EmptyState.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { NotificationItem } from '../../components/domain/NotificationItem.jsx';

export default function NotificationsScene() {
  const { t } = useTranslation();
  const { notifications, loading, error, refresh, markRead, markAllRead, archive } = useNotifications();
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const visible = unreadOnly
    ? notifications.filter((n) => !n.read)
    : notifications;

  return (
    <PageLayout
      title={t('notifications.center.title')}
      actions={
        <>
          <Button variant="ghost" onClick={() => setUnreadOnly((v) => !v)}>
            {unreadOnly ? t('notifications.center.all') : t('notifications.center.unreadOnly')}
          </Button>
          <Button variant="ghost" onClick={markAllRead}>
            {t('notifications.center.markAllRead')}
          </Button>
        </>
      }
    >
      <Card>
        {loading && <Spinner />}
        {error && <p className="error">{error}</p>}
        {!loading && visible.length === 0 && (
          <EmptyState title={t('notifications.center.empty')} />
        )}
        <ul className="notifications">
          {visible.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={() => markRead(n.id)}
              onArchive={() => archive(n.id)}
            />
          ))}
        </ul>
      </Card>
    </PageLayout>
  );
}