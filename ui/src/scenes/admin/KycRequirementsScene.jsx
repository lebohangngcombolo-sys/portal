/**
 * Admin — KYC requirements for a country.
 *
 * Lists existing requirements and provides add / edit / toggle.
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
import { KycRequirementForm } from '../../components/domain/KycRequirementForm.jsx';

export default function KycRequirementsScene() {
  const { code } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const [modal, setModal] = useState({ open: false, editing: null });

  const { data, loading, refetch } = useProviderFetch(
    () => CountryProvider.getKycRequirements(code),
    { deps: [code] },
  );

  const handleSave = async (values) => {
    const body = {
      customerType: values.customerType,
      documentType: values.documentType,
      requirementCode: values.requirementCode,
      description: values.description,
      required: values.required,
      allowedMimeTypes: values.allowedMimeTypes,
      maxFileSizeBytes: values.maxFileSizeBytes,
      validityDays: values.validityDays,
      enabled: values.enabled,
    };
    const res = modal.editing
      ? await CountryProvider.updateKycRequirement(modal.editing.id, body)
      : await CountryProvider.createKycRequirement(code, body);
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
    const res = await CountryProvider.toggleKycRequirement(req.id, { enabled: !req.enabled });
    if (res.ok) {
      toast.success(t('common.save'));
      refetch();
    }
  };

  return (
    <PageLayout
      title={t('admin.kycRequirements.title', { defaultValue: 'KYC Requirements' })}
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
              <th>{t('admin.kycRequirements.code', { defaultValue: 'Code' })}</th>
              <th>{t('admin.kycRequirements.documentType', { defaultValue: 'Document type' })}</th>
              <th>{t('admin.kycRequirements.customerType', { defaultValue: 'Customer type' })}</th>
              <th>{t('admin.kycRequirements.required', { defaultValue: 'Required' })}</th>
              <th>{t('admin.kycRequirements.enabled', { defaultValue: 'Enabled' })}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(data || []).map((req) => (
              <tr key={req.id}>
                <td><code>{req.requirementCode}</code></td>
                <td>{req.documentType}</td>
                <td>{req.customerType}</td>
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
        <KycRequirementForm
          initial={modal.editing || {
            customerType: 'COMPANY',
            required: true,
            enabled: true,
            allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
            maxFileSizeBytes: 5242880,
            validityDays: 365,
          }}
          onSubmit={handleSave}
          onCancel={() => setModal({ open: false, editing: null })}
        />
      </Modal>
    </PageLayout>
  );
}