/**
 * Representatives scene — list/add/edit/remove/verify representatives.
 *
 * Customers can add, edit, and remove representatives while the
 * organization is editable. Analysts (via permission) can verify them.
 */
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext.jsx';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { usePermissions } from '../../hooks/usePermissions.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useSelectedOrganization } from '../../contexts/OrganizationContext.jsx';
import { RepresentativeProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';
import { RepresentativeList } from '../../components/domain/RepresentativeList.jsx';
import { RepresentativeForm } from '../../components/domain/RepresentativeForm.jsx';
import { ConfirmationDialog } from '../../components/feedback/ConfirmationDialog.jsx';

export default function RepresentativesScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const { organization, load } = useSelectedOrganization();
  const { can } = usePermissions();
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: reps, loading, refetch } = useProviderFetch(
    () => RepresentativeProvider.list(id),
    { enabled: Boolean(id), deps: [id] },
  );

  useEffect(() => {
    if (id) load(id);
  }, [id, load]);

  const handleSave = useCallback(
    async (values) => {
      const body = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber || null,
        representativeType: values.representativeType,
        authorizedSignatory: Boolean(values.authorizedSignatory),
      };
      const res =
        modalMode === 'add'
          ? await RepresentativeProvider.add(id, body)
          : await RepresentativeProvider.update(id, editing.id, body);
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Failed');
        return res;
      }
      toast.success(t('common.save'));
      setModalMode(null);
      setEditing(null);
      refetch();
      return res;
    },
    [id, modalMode, editing, refetch, t, toast],
  );

  const handleDelete = useCallback(async () => {
    const res = await RepresentativeProvider.remove(id, deleting.id);
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Failed');
      return;
    }
    toast.success(t('common.remove'));
    setDeleting(null);
    refetch();
  }, [id, deleting, refetch, t, toast]);

  const handleVerify = useCallback(
    async (rep, status) => {
      const res = await RepresentativeProvider.verify(id, rep.id, { status });
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Failed');
        return;
      }
      toast.success(t('common.save'));
      refetch();
    },
    [id, refetch, t, toast],
  );

  return (
    <PageLayout
      title={t('organization.representatives.title')}
      subtitle={organization?.legalName}
      actions={
        <Button variant="primary" onClick={() => setModalMode('add')}>
          {t('organization.representatives.add')}
        </Button>
      }
    >
      <Card>
        {loading && <Spinner />}
        <RepresentativeList
          representatives={reps || []}
          onEdit={(rep) => {
            setEditing(rep);
            setModalMode('edit');
          }}
          onDelete={(rep) => setDeleting(rep)}
          onVerify={
            can('kyc.case.review')
              ? (rep, status) => handleVerify(rep, status)
              : undefined
          }
        />
      </Card>

      <Modal
        open={modalMode !== null}
        onClose={() => {
          setModalMode(null);
          setEditing(null);
        }}
      >
        <RepresentativeForm
          initial={editing || { representativeType: 'DIRECTOR' }}
          onSubmit={handleSave}
          onCancel={() => {
            setModalMode(null);
            setEditing(null);
          }}
        />
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        title={t('organization.representatives.removeTitle', { defaultValue: 'Remove representative?' })}
        body={t('organization.representatives.removeBody', {
          defaultValue: 'This cannot be undone.',
        })}
        confirmLabel={t('common.remove')}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}