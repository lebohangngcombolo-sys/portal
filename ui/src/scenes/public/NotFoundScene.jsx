import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { Button } from '../../components/primitives/Button.jsx';

export default function NotFoundScene() {
  const { t } = useTranslation();
  return (
    <main className="error-scene">
      <h1>404</h1>
      <p>{t('errors.notFound')}</p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="primary">{t('navigation.dashboard')}</Button>
      </Link>
    </main>
  );
}