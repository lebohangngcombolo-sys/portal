/**
 * Admin — users list.
 *
 * Searchable, filterable by role and status. Provides per-user actions:
 * suspend / reactivate / unlock / assign roles. Each action opens a
 * confirmation modal.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROLES } from '../../common/constants/userRoles.js';
import { formatDate } from '../../common/utils/date.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { usePagination } from '../../hooks/usePagination.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { TextInput } from '../../components/primitives/TextInput.jsx';
import { Pagination } from '../../components/primitives/Pagination.jsx';
import { StatusBadge } from '../../components/domain/StatusBadge.jsx';
import { RoleBadge } from '../../components/domain/RoleBadge.jsx';
import { UserActionsDialog } from '../../components/domain/UserActionsDialog.jsx';

export default function UsersScene() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const pagination = usePagination({ page: 0, size: 20 });
  const [action, setAction] = useState(null);

  const { data, loading, refetch } = useProviderFetch(
    () =>
      IdentityProvider.adminSearchUsers({
        query: debounced || undefined,
        page: pagination.page,
        size: pagination.size,
      }),
    { deps: [debounced, pagination.page, pagination.size] },
  );

  const content = data?.content || [];
  const page = data?.page || { number: 0, size: pagination.size, totalElements: 0, totalPages: 0 };

  useEffect(() => {
  pagination.setPage(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [debounced]);

  const handleActionComplete = () => {
    setAction(null);
    toast.success(t('common.save'));
    refetch();
  };

  return (
    <PageLayout title={t('admin.users.title')}>
      <Card>
        <TextInput
          label={t('admin.users.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.users.columns.name')}</th>
              <th>{t('admin.users.columns.email')}</th>
              <th>{t('admin.users.columns.roles')}</th>
              <th>{t('admin.users.columns.status')}</th>
              <th>{t('admin.users.columns.created')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {content.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>
                  {(u.roles || []).map((r) => (
                    <RoleBadge key={r} role={r} />
                  ))}
                </td>
                <td>
                  <StatusBadge status={u.status} />
                </td>
                <td>
                  {formatDate(u.createdAt, 'd MMM yyyy', i18n.language)}
                </td>
                <td>
                  <Button variant="ghost" onClick={() => setAction(u)}>
                    {t('admin.users.actions.view')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page.number}
          size={page.size}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          onPageChange={(n) => pagination.setPage(n)}
          onSizeChange={(s) => pagination.setSize(s)}
        />
      </Card>

      {action && (
        <UserActionsDialog
          user={action}
          onClose={() => setAction(null)}
          onComplete={handleActionComplete}
        />
      )}
    </PageLayout>
  );
}