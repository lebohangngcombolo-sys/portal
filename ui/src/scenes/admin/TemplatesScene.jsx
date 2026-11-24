/**
 * Admin — notification templates.
 *
 * Create, edit, preview, and toggle templates. Template versions are
 * managed server-side: editing creates a new version.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDateTime } from '../../common/utils/date.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { usePagination } from '../../hooks/usePagination.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { NotificationProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Pagination } from '../../components/primitives/Pagination.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';
import { NotificationTemplateForm } from '../../components/domain/NotificationTemplateForm.jsx';
import { NotificationTemplatePreview } from '../../components/domain/NotificationTemplatePreview.jsx';

export default function TemplatesScene() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const pagination = usePagination({ page: 0, size: 20 });
  const [modal, setModal] = useState({ open: false, editing: null });
  const [previewing, setPreviewing] = useState(null);

  const { data, loading, refetch } = useProviderFetch(
    () =>
      NotificationProvider.adminListTemplates({
        page: pagination.page,
        size: pagination.size,
      }),
    { deps: [pagination.page, pagination.size] },
  );

  const content = data?.content || [];
  const page = data?.page || { number: 0, size: pagination.size, totalElements: 0, totalPages: 0 };

  const handleSave = async (values) => {
    const res = modal.editing
      ? await NotificationProvider.adminUpdateTemplate(modal.editing.id, {
          subjectTemplate: values.subjectTemplate,
          bodyTemplate: values.bodyTemplate,
          variablesSchema: values.variablesSchema,
        })
      : await NotificationProvider.adminCreateTemplate(values);
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Failed');
      return res;
    }
    toast.success(t('common.save'));
    setModal({ open: false, editing: null });
    refetch();
    return res;
  };

  const handleToggle = async (tpl) => {
    const res = await NotificationProvider.adminToggleTemplate(tpl.id, {
      enabled: !tpl.enabled,
    });
    if (res.ok) {
      toast.success(t('common.save'));
      refetch();
    }
  };

  return (
    <PageLayout
      title={t('admin.templates.title')}
      actions={
        <Button variant="primary" onClick={() => setModal({ open: true, editing: null })}>
          {t('admin.templates.add')}
        </Button>
      }
    >
      <Card>
        {loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.templates.columns.code')}</th>
              <th>{t('admin.templates.columns.channel')}</th>
              <th>{t('admin.templates.columns.language')}</th>
              <th>{t('admin.templates.columns.version')}</th>
              <th>{t('admin.templates.columns.status')}</th>
              <th>{t('admin.templates.columns.updated')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {content.map((tpl) => (
              <tr key={tpl.id}>
                <td>
                  <code>{tpl.templateCode}</code>
                </td>
                <td>{tpl.channel}</td>
                <td>{tpl.languageCode}</td>
                <td>v{tpl.version}</td>
                <td>
                  <Badge variant={tpl.enabled ? 'success' : 'neutral'}>
                    {tpl.enabled ? t('common.yes') : t('common.no')}
                  </Badge>
                </td>
                <td>
                  {tpl.updatedAt ? formatDateTime(tpl.updatedAt, i18n.language) : '—'}
                </td>
                <td>
                  <Button
                    variant="ghost"
                    onClick={() => setModal({ open: true, editing: tpl })}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button variant="ghost" onClick={() => setPreviewing(tpl)}>
                    {t('admin.templates.preview')}
                  </Button>
                  <Button variant="ghost" onClick={() => handleToggle(tpl)}>
                    {tpl.enabled
                      ? t('common.disable', { defaultValue: 'Disable' })
                      : t('common.enable', { defaultValue: 'Enable' })}
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

      <Modal open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <NotificationTemplateForm
          initial={modal.editing || {
            channel: 'EMAIL',
            languageCode: 'en',
            enabled: true,
          }}
          isEdit={Boolean(modal.editing)}
          onSubmit={handleSave}
          onCancel={() => setModal({ open: false, editing: null })}
        />
      </Modal>

      <Modal open={Boolean(previewing)} onClose={() => setPreviewing(null)}>
        {previewing && (
          <NotificationTemplatePreview
            template={previewing}
            onClose={() => setPreviewing(null)}
          />
        )}
      </Modal>
    </PageLayout>
  );
}