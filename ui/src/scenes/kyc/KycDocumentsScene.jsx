/**
 * KYC documents scene — full evidence list with upload and remove actions.
 */
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { KycProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';
import { KycDocumentList } from '../../components/domain/KycDocumentList.jsx';
import { KycDocumentUpload } from '../../components/domain/KycDocumentUpload.jsx';
import { ConfirmationDialog } from '../../components/feedback/ConfirmationDialog.jsx';

export default function KycDocumentsScene() {
  const { id } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const { data: documents, loading, refetch } = useProviderFetch(
    () => KycProvider.listDocuments(id),
    { enabled: Boolean(id), deps: [id] },
  );
  const { data: requirements } = useProviderFetch(
    () => KycProvider.getRequirements(id),
    { enabled: Boolean(id), deps: [id] },
  );

  const handleUploaded = useCallback(() => {
    setShowUpload(false);
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(async () => {
    const res = await KycProvider.removeDocument(id, deleting.id);
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
      title={t('kyc.documents.title', { defaultValue: 'Evidence' })}
      actions={
        <Button variant="primary" onClick={() => setShowUpload(true)}>
          {t('kyc.documents.upload', { defaultValue: 'Upload' })}
        </Button>
      }
    >
      <Card>
        {loading && <Spinner />}
        <KycDocumentList
          documents={documents || []}
          onRemove={(doc) => setDeleting(doc)}
        />
      </Card>

      <Modal open={showUpload} onClose={() => setShowUpload(false)}>
        <KycDocumentUpload
          caseId={id}
          requirements={requirements || []}
          onUploaded={handleUploaded}
          onCancel={() => setShowUpload(false)}
        />
      </Modal>

      <ConfirmationDialog
        open={Boolean(deleting)}
        title={t('kyc.documents.removeTitle', { defaultValue: 'Remove document?' })}
        body={t('kyc.documents.removeBody', { defaultValue: 'This cannot be undone.' })}
        confirmLabel={t('common.remove')}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </PageLayout>
  );
}