/**
 * Admin — organization requirements for a country.
 */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { CountryProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';
import { OrganizationRequirementForm } from '../../components/domain/OrganizationRequirementForm.jsx';

export default function OrganizationRequirementsScene() {
  const { code } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const [modal, setModal] = useState({ open: false, editing: null });

  const { data, loading, refetch } = useProviderFetch(
    () => CountryProvider.getOrganizationRequirements(code),
    { deps: [code] },
  );

  const handleSave = async (values) => {
    const body = {
      organizationType: values.organizationType,
      requirementCode: values.requirementCode,
      description: values.description,
      required: values.required,
      validationRule: values.validationRule,
      effectiveFrom: values.effectiveFrom,
      effectiveUntil: values.effectiveUntil,
      enabled: values.enabled,
    };
    const res = modal.editing
      ? await CountryProvider.updateOrganizationRequirement(modal.editing.id, body)
      : await CountryProvider.createOrganizationRequirement(code, body);
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Failed');
      return res;
    }
    toast.success(t('common.save'));
    setModal({ open: false, editing: null });
    refetch();
    return res;
  };

  const handleToggle = async (req) => {
    const res = await CountryProvider.toggleOrganizationRequirement(req.id, { enabled: !req.enabled });
    if (res.ok) {
      toast.success(t('common.save'));
      refetch();
    }
  };

  return (
    <PageLayout
      title={t('admin.orgRequirements.title', { defaultValue: 'Organization Requirements' })}
      subtitle={code}
      actions={
        <Button
          variant="primary"
          onClick={() => setModal({ open: true, editing: null })}
        >
          {t('common.add')}
        </Button>
      }
    >
      <Card>
        {loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.orgRequirements.code', { defaultValue: 'Code' })}</th>
              <th>{t('admin.orgRequirements.organizationType', { defaultValue: 'Org type' })}</th>
              <th>{t('admin.orgRequirements.required', { defaultValue: 'Required' })}</th>
              <th>{t('admin.orgRequirements.enabled', { defaultValue: 'Enabled' })}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(data || []).map((req) => (
              <tr key={req.id}>
                <td><code>{req.requirementCode}</code></td>
                <td>{req.organizationType}</td>
                <td>{req.required ? t('common.yes') : t('common.no')}</td>
                <td>
                  <Badge variant={req.enabled ? 'success' : 'neutral'}>
                    {req.enabled ? t('common.yes') : t('common.no')}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="ghost"
                    onClick={() => setModal({ open: true, editing: req })}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button variant="ghost" onClick={() => handleToggle(req)}>
                    {req.enabled
                      ? t('common.disable', { defaultValue: 'Disable' })
                      : t('common.enable', { defaultValue: 'Enable' })}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={modal.open} onClose={() => setModal({ open: false, editing: null })}>
        <OrganizationRequirementForm
          initial={modal.editing || {
            organizationType: 'COMPANY',
            required: true,
            enabled: true,
          }}
          onSubmit={handleSave}
          onCancel={() => setModal({ open: false, editing: null })}
        />
      </Modal>
    </PageLayout>
  );
}