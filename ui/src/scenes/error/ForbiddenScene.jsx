/**
 * 403 scene — reached when a user is authenticated but lacks the required
 * role for a route.
 *
 * Exports both a default and a named export because it's used both from
 * the router registry and from `withSecurity` (which imports it eagerly).
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { Button } from '../../components/primitives/Button.jsx';

export function ForbiddenScene() {
  const { t } = useTranslation();
  return (
    <main className="error-scene">
      <h1>403</h1>
      <p>{t('errors.forbidden')}</p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="primary">{t('navigation.dashboard')}</Button>
      </Link>
    </main>
  );
}

export default ForbiddenScene;