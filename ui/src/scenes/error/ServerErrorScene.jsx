/**
 * 500 scene — rendered when a request fails catastrophically or a route
 * throws an uncaught error.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { Button } from '../../components/primitives/Button.jsx';

export default function ServerErrorScene() {
  const { t } = useTranslation();
  return (
    <main className="error-scene">
      <h1>500</h1>
      <p>{t('errors.serverError')}</p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="primary">{t('navigation.dashboard')}</Button>
      </Link>
    </main>
  );
}