/**
 * Admin — permissions catalogue (read-only).
 */
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { IdentityProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';

export default function PermissionsScene() {
  const { t } = useTranslation();
  const { data, loading } = useProviderFetch(() => IdentityProvider.adminListPermissions(), {
    deps: [],
  });

  return (
    <PageLayout title={t('navigation.permissions')}>
      <Card>
        {loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.permissions.columns.code', { defaultValue: 'Code' })}</th>
              <th>{t('admin.permissions.columns.resource', { defaultValue: 'Resource' })}</th>
              <th>{t('admin.permissions.columns.action', { defaultValue: 'Action' })}</th>
              <th>{t('admin.permissions.columns.description', { defaultValue: 'Description' })}</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((perm) => (
              <tr key={perm.id}>
                <td>
                  <code>{perm.code}</code>
                </td>
                <td>{perm.resource}</td>
                <td>{perm.action}</td>
                <td>{perm.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageLayout>
  );
}