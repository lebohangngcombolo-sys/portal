/**
 * Beneficial owners scene — list/add/edit/remove beneficial owners and
 * view the aggregate ownership summary.
 */
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useSelectedOrganization } from '../../contexts/OrganizationContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { BeneficialOwnerProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';
import { BeneficialOwnerList } from '../../components/domain/BeneficialOwnerList.jsx';
import { BeneficialOwnerForm } from '../../components/domain/BeneficialOwnerForm.jsx';
import { OwnershipSummary } from '../../components/domain/OwnershipSummary.jsx';
import { ConfirmationDialog } from '../../components/feedback/ConfirmationDialog.jsx';

export default function BeneficialOwnersScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const { organization, load } = useSelectedOrganization();
  const [modalMode, setModalMode] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data: owners, loading, refetch } = useProviderFetch(
    () => BeneficialOwnerProvider.list(id),
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
        dateOfBirth: values.dateOfBirth || null,
        nationalityCountryCode: values.nationalityCountryCode || null,
        residenceCountryCode: values.residenceCountryCode || null,
        ownershipPercentage: values.ownershipPercentage ?? null,
        controlType: values.controlType,
        identityReference: values.identityReference || null,
      };
      const res =
        modalMode === 'add'
          ? await BeneficialOwnerProvider.add(id, body)
          : await BeneficialOwnerProvider.update(id, editing.id, body);
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
    const res = await BeneficialOwnerProvider.remove(id, deleting.id);
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Failed');
      return;
    }
    toast.success(t('common.remove'));
    setDeleting(null);
    refetch();
  }, [id, deleting, refetch, t, toast]);

  return (
    <PageLayout
      title={t('organization.beneficialOwners.title')}
      subtitle={organization?.legalName}
      actions={
        <>
          <Link to={routeBuilders.organizationOwnership(id)}>
            <Button variant="ghost">{t('organization.beneficialOwners.declaration.title')}</Button>
          </Link>
          <Button variant="primary" onClick={() => setModalMode('add')}>
            {t('organization.beneficialOwners.add')}
          </Button>
        </>
      }
    >
      <Card>
        {loading && <Spinner />}
        <BeneficialOwnerList
          owners={owners || []}
          onEdit={(owner) => {
            setEditing(owner);
            setModalMode('edit');
          }}
          onDelete={(owner) => setDeleting(owner)}
        />
        <OwnershipSummary owners={owners || []} />
      </Card>

      <Modal
        open={modalMode != null}
        onClose={() => {
          setModalMode(null);
          setEditing(null);
        }}
      >
        <BeneficialOwnerForm
          initial={editing || { controlType: 'DIRECT' }}
          onSubmit={handleSave}
          onCancel={() => {
            setModalMode(null);
            setEditing(null);
          }}
        />
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        title={t('organization.beneficialOwners.removeTitle', {
          defaultValue: 'Remove beneficial owner?',
        })}
        body={t('organization.beneficialOwners.removeBody', {
          defaultValue: 'This cannot be undone.',
        })}
        confirmLabel={t('common.remove')}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}