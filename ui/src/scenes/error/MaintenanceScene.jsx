/**
 * Maintenance scene — static page shown when the platform is intentionally
 * offline (e.g. during a major deployment).
 */
import { useTranslation } from 'react-i18next';

export default function MaintenanceScene() {
  const { t } = useTranslation();
  return (
    <main className="error-scene">
      <h1>{t('maintenance.title', { defaultValue: 'Scheduled maintenance' })}</h1>
      <p>
        {t('maintenance.body', {
          defaultValue: 'TradeBridge Africa is currently undergoing planned maintenance. Please try again shortly.',
        })}
      </p>
    </main>
  );
}