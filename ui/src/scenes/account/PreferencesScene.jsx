/**
 * Preferences scene — per-channel notification preferences.
 *
 * Renders a table of EMAIL/SMS/IN_APP with toggles. Channels that are
 * security-critical (mandatory) are displayed with a lock icon and a note.
 */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { NotificationProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { PreferenceToggle } from '../../components/domain/PreferenceToggle.jsx';

export default function PreferencesScene() {
  const { t } = useTranslation();
  const toast = useToast();
  const { user } = useSessionUser();

  const { data: preferences, loading, refetch } = useProviderFetch(
    () => NotificationProvider.getPreferences(),
    { enabled: Boolean(user), deps: [user?.id] },
  );

  const handleToggle = async (channel, enabled) => {
    const res = await NotificationProvider.updateChannelPreference(channel, {
      channel,
      enabled,
    });
    if (res.ok) {
      toast.success(t('common.save'));
      refetch();
    }
  };

  return (
    <PageLayout
      title={t('notifications.preferences.title')}
      subtitle={t('notifications.preferences.subtitle')}
    >
      <Card>
        {loading && <Spinner />}
        {preferences && (
          <>
            <p className="hint">{t('notifications.preferences.mandatoryNote')}</p>
            <ul className="preferences">
              {preferences.map((p) => (
                <PreferenceToggle
                  key={p.channel}
                  preference={p}
                  onChange={(enabled) => handleToggle(p.channel, enabled)}
                />
              ))}
            </ul>
          </>
        )}
      </Card>
    </PageLayout>
  );
}