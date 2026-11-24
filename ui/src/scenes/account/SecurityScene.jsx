/**
 * Account security settings: password, two-factor authentication, and sessions.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { ChangePasswordDialog } from '../../components/domain/ChangePasswordDialog.jsx';
import { MfaDisableDialog } from '../../components/domain/MfaDisableDialog.jsx';
import { Alert } from '../../components/primitives/Alert.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { IdentityProvider } from '../../providers/index.js';

export default function SecurityScene() {
  const { t } = useTranslation();
  const { user } = useSessionUser();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [disableMfaOpen, setDisableMfaOpen] = useState(false);
  const {
    data: mfaStatus,
    loading: mfaLoading,
    error: mfaError,
    refetch: refetchMfa,
  } = useProviderFetch(() => IdentityProvider.mfaStatus(), {
    enabled: Boolean(user),
    deps: [user?.id],
  });

  const mfaEnabled = mfaStatus?.enabled ?? mfaStatus?.mfaEnabled ?? user?.mfaEnabled;

  return (
    <PageLayout title={t('account.security.title')} subtitle={t('account.security.subtitle')}>
      <Card
        title={t('account.security.password.title')}
        actions={
          <Button variant="secondary" onClick={() => setChangePasswordOpen(true)}>
            {t('account.security.password.change')}
          </Button>
        }
      >
        <p>{t('account.security.password.description')}</p>
      </Card>

      <Card
        title={t('account.security.mfa.title')}
        actions={
          mfaLoading ? (
            <Spinner size={20} />
          ) : mfaEnabled === true ? (
            <Button variant="danger" onClick={() => setDisableMfaOpen(true)}>
              {t('account.security.mfa.disable')}
            </Button>
          ) : mfaEnabled === false ? (
            <Link to={ROUTES.ACCOUNT_MFA}>
              <Button variant="primary">{t('account.security.mfa.enable')}</Button>
            </Link>
          ) : (
            <Button variant="secondary" onClick={refetchMfa}>
              {t('common.retry')}
            </Button>
          )
        }
      >
        <p>{t('account.security.mfa.description')}</p>
        {!mfaLoading && (
          <p>
            {t('account.security.mfa.status')}:{' '}
            <Badge variant={mfaEnabled === true ? 'success' : 'neutral'}>
              {mfaEnabled == null
                ? t('account.security.mfa.statusUnknown')
                : mfaEnabled
                  ? t('account.security.mfa.enabled')
                  : t('account.security.mfa.disabled')}
            </Badge>
          </p>
        )}
        {mfaError && (
          <Alert variant="warning">{t('account.security.mfa.statusUnavailable')}</Alert>
        )}
      </Card>

      <Card
        title={t('account.security.sessions.title')}
        actions={
          <Link to={ROUTES.ACCOUNT_SESSIONS}>
            <Button variant="secondary">{t('account.security.sessions.manage')}</Button>
          </Link>
        }
      >
        <p>{t('account.security.sessions.subtitle')}</p>
      </Card>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
      <MfaDisableDialog
        open={disableMfaOpen}
        onClose={() => setDisableMfaOpen(false)}
        onDisabled={refetchMfa}
      />
    </PageLayout>
  );
}