/**
 * Landing scene — the marketing home page.
 *
 * Public. Renders for unauthenticated users with CTAs for sign-in and
 * sign-up. Authenticated users are redirected to the dashboard.
 */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { useAuthState } from '../../contexts/AuthContext.jsx';
import { useSessionUser } from '../../hooks/useSessionUser.js';
import { Button } from '../../components/primitives/Button.jsx';
import { logoUrl } from '../../common/utils/assets.js';

export default function LandingScene() {
  const { t } = useTranslation();
  const { status } = useAuthState();
  const { user } = useSessionUser();
  const navigate = useNavigate();

  // Authenticated visitors are redirected to the dashboard
  useEffect(() => {
    if (status === 'authenticated' && user) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [status, user, navigate]);

  return (
    <main className="landing">
      <section className="landing__hero">
        <img src={logoUrl('logo-white')} alt="" width="240" height="48" />
        <h1>{t('app.tagline')}</h1>
        <p>{t('landing.heroSubtitle', {
          defaultValue:
            'Fast, compliant onboarding for businesses across Africa. Complete KYC once. Trade with confidence.',
        })}</p>
        <div className="landing__cta">
          <Link to={ROUTES.REGISTER}>
            <Button className="landing__primary" variant="primary" size="lg">
              {t('common.signUp')}
            </Button>
          </Link>
          <Link to={ROUTES.LOGIN}>
            <Button className="landing__secondary" variant="ghost" size="lg">
              {t('common.signIn')}
            </Button>
          </Link>
        </div>
      </section>

      <section className="landing__features">
        {['kyc', 'security', 'scale'].map((key) => (
          <article key={key} className="landing__feature">
            <h2>{t(`landing.features.${key}.title`, { defaultValue: key })}</h2>
            <p>{t(`landing.features.${key}.body`, { defaultValue: '' })}</p>
          </article>
        ))}
      </section>
    </main>
  );
}