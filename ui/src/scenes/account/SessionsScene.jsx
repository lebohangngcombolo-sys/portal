/**
 * Sessions scene — full list of active sessions with per-session and
 * "sign out everywhere" actions.
 */
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { IdentityProvider, AuthProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { SessionList } from '../../components/domain/SessionList.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';

export default function SessionsScene() {
  const { t } = useTranslation();
  const { user } = useSessionUser();
  const toast = useToast();

  const { data: sessions, loading, refetch } = useProviderFetch(
    () => IdentityProvider.sessions(),
    { enabled: Boolean(user), deps: [user?.id] },
  );

  const handleRevoke = async (sessionId) => {
    const res = await IdentityProvider.revokeSession(sessionId);
    if (res.ok) {
      toast.success(t('account.security.sessions.revoked', { defaultValue: 'Session revoked' }));
      refetch();
    }
  };

  const handleRevokeAll = async () => {
    await AuthProvider.logoutAll();
    toast.success(t('account.security.sessions.revokedAll', { defaultValue: 'All sessions signed out' }));
  };

  return (
    <PageLayout
      title={t('account.security.sessions.title')}
      subtitle={t('account.security.sessions.subtitle')}
      actions={
        <Button variant="ghost" onClick={handleRevokeAll}>
          {t('account.security.sessions.revokeAll')}
        </Button>
      }
    >
      <Card>
        {loading && <Spinner />}
        {sessions && <SessionList sessions={sessions} onRevoke={handleRevoke} />}
      </Card>
    </PageLayout>
  );
}