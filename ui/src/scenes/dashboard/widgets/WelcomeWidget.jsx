/**
 * Welcome widget — greeting and primary CTAs.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../../common/constants/routes.js';
import { useSessionUser } from '../../../hooks/useSessionUser.js';
import { usePermissions } from '../../../hooks/usePermissions.js';
import { Card } from '../../../components/primitives/Card.jsx';
import { Button } from '../../../components/primitives/Button.jsx';

export function WelcomeWidget() {
  const { t } = useTranslation();
  const { firstName, emailVerified } = useSessionUser();
  const { isStaff } = usePermissions();

  return (
    <Card>
      <h2>{t('dashboard.welcome', { firstName: firstName || t('common.friend', { defaultValue: 'there' }) })}</h2>
      <p>{t('dashboard.subtitle')}</p>
      {!emailVerified && (
        <p className="welcome__hint">
          {t('dashboard.verifyEmailHint', {
            defaultValue: 'Your email is not verified yet. Check your inbox to continue.',
          })}
        </p>
      )}
      <div className="welcome__actions">
        {isStaff ? (
          <Link to={ROUTES.KYC_CASES}>
            <Button variant="primary">{t('dashboard.viewKyc')}</Button>
          </Link>
        ) : (
          <Link to={ROUTES.ORGANIZATIONS}>
            <Button variant="primary">{t('dashboard.startOnboarding')}</Button>
          </Link>
        )}
        <Link to={ROUTES.ACCOUNT_PROFILE}>
          <Button variant="ghost">{t('navigation.profile')}</Button>
        </Link>
      </div>
    </Card>
  );
}