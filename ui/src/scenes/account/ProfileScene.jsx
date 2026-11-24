/**
 * Profile scene — read-only view of the current user's identity and
 * customer profile.
 */
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { CustomerProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';

export default function ProfileScene() {
  const { t } = useTranslation();
  const { user, isLoading } = useSessionUser();

  const { data: profile, loading } = useProviderFetch(
    () => CustomerProvider.getOwnProfile(),
    { enabled: Boolean(user), deps: [user?.id] },
  );

  return (
    <PageLayout title={t('account.profile.title')} subtitle={t('account.profile.subtitle')}>
      {isLoading && <Spinner />}
      {user && (
        <Card>
          <h3>{t('account.profile.fields.firstName', { defaultValue: 'First name' })}</h3>
          <p>{user.firstName}</p>

          <h3>{t('account.profile.fields.lastName', { defaultValue: 'Last name' })}</h3>
          <p>{user.lastName}</p>

          <h3>{t('account.profile.fields.email')}</h3>
          <p>
            {user.email}{' '}
            <Badge variant={user.emailVerified ? 'success' : 'warning'}>
              {user.emailVerified ? t('common.verified', { defaultValue: 'Verified' }) : t('common.unverified', { defaultValue: 'Unverified' })}
            </Badge>
          </p>

          <h3>{t('account.profile.fields.phoneNumber')}</h3>
          <p>{user.phoneNumber || '—'}</p>

          <h3>{t('account.profile.fields.countryCode')}</h3>
          <p>{user.countryCode || '—'}</p>

          <h3>{t('account.profile.fields.preferredLanguage')}</h3>
          <p>{user.preferredLanguage || '—'}</p>
        </Card>
      )}

      {loading && <Spinner />}
      {profile && (
        <Card>
          <h3>{t('account.profile.customerProfile', { defaultValue: 'Customer profile' })}</h3>
          <p>
            {t('account.profile.customerNumber', { defaultValue: 'Customer number' })}:{' '}
            {profile.customerNumber || '—'}
          </p>
          <p>
            {t('account.profile.status', { defaultValue: 'Status' })}:{' '}
            <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'neutral'}>
              {profile.status}
            </Badge>
          </p>
        </Card>
      )}
    </PageLayout>
  );
}