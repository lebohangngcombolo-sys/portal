/**
 * Admin — roles list (read-only view for now).
 *
 * Creation and update of custom roles is a super-admin function that
 * requires an extended editor. This scene focuses on the list and shows
 * the permissions per role.
 */
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { IdentityProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { RoleBadge } from '../../components/domain/RoleBadge.jsx';

export default function RolesScene() {
  const { t } = useTranslation();
  const { data, loading } = useProviderFetch(() => IdentityProvider.adminListRoles(), { deps: [] });

  return (
    <PageLayout title={t('navigation.roles')}>
      <Card>
        {loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.roles.columns.code', { defaultValue: 'Code' })}</th>
              <th>{t('admin.roles.columns.name', { defaultValue: 'Name' })}</th>
              <th>{t('admin.roles.columns.description', { defaultValue: 'Description' })}</th>
              <th>{t('admin.roles.columns.system', { defaultValue: 'System' })}</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((role) => (
              <tr key={role.id}>
                <td>
                  <RoleBadge role={role.code} />
                </td>
                <td>{role.name}</td>
                <td>{role.description || '—'}</td>
                <td>{role.systemRole ? t('common.yes') : t('common.no')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageLayout>
  );
}