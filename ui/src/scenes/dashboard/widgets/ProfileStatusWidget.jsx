/**
 * Profile status widget — shows completion of the customer profile.
 */
import { useTranslation } from 'react-i18next';

import { useSessionUser } from '../../../hooks/useSessionUser.js';
import { useProviderFetch } from '../../../hooks/useProviderFetch.js';
import { CustomerProvider } from '../../../providers/index.js';
import { Card } from '../../../components/primitives/Card.jsx';
import { Spinner } from '../../../components/primitives/Spinner.jsx';
import { Badge } from '../../../components/primitives/Badge.jsx';

export function ProfileStatusWidget() {
  const { t } = useTranslation();
  const { user, isLoading } = useSessionUser();

  const { data, loading } = useProviderFetch(
    () => CustomerProvider.getOwnProfile(),
    { enabled: Boolean(user), deps: [user?.id] },
  );

  if (isLoading || loading) return <Card><Spinner /></Card>;
  if (!user) return null;

  const status = data?.status || 'UNKNOWN';

  return (
    <Card>
      <h3>{t('dashboard.profileStatus')}</h3>
      <Badge variant={status === 'ACTIVE' ? 'success' : 'neutral'}>{status}</Badge>
      {status === 'PENDING' && (
        <p className="hint">{t('dashboard.completeProfileHint', { defaultValue: 'Complete your profile to unlock onboarding.' })}</p>
      )}
    </Card>
  );
}