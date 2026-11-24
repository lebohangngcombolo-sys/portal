/**
 * KYC document uploader.
 *
 * Flow:
 * 1. Select requirement (from case requirements list).
 * 2. Select file (validated locally for MIME + size).
 * 3. Compute SHA-256 checksum client-side.
 * 4. Submit metadata to KycProvider.registerDocument.
 * 5. (Bytes go through the storage adapter, not this component — a
 *    presigned-URL flow would be plugged in here when implemented.)
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useToast } from '../../contexts/ToastContext.jsx';
import { KycProvider } from '../../providers/index.js';
import { Button } from '../primitives/Button.jsx';
import { Select } from '../primitives/Select.jsx';
import { FileUpload } from '../primitives/FileUpload.jsx';
import { Alert } from '../primitives/Alert.jsx';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function sha256Hex(file) {
  const arrayBuffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', arrayBuffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function KycDocumentUpload({ caseId, requirements = [], onUploaded, onCancel }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [requirement, setRequirement] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const requirementOptions = requirements.map((r) => ({
    value: r.requirementCode,
    label: `${t(`kyc.requirements.${r.requirementCode}`, { defaultValue: r.requirementCode })}${r.required ? ' *' : ''}`,
  }));

  const handleUpload = async () => {
    setError(null);
    if (!requirement || !file) {
      setError(t('kyc.documents.selectRequired', { defaultValue: 'Select a requirement and a file.' }));
      return;
    }

    setBusy(true);
    try {
      const checksum = await sha256Hex(file);
      const res = await KycProvider.registerDocument(caseId, {
        documentType: requirement,
        requirementCode: requirement,
        originalFilename: file.name,
        mimeType: file.type,
        fileSizeBytes: file.size,
        checksum,
      });
      if (!res.ok) {
        setError(res.messages?.[0] || 'Upload failed');
        return;
      }
      toast.success(t('kyc.documents.uploaded', { defaultValue: 'Document uploaded' }));
      onUploaded?.(res.result);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrapper>
      <Title>{t('kyc.documents.upload', { defaultValue: 'Upload document' })}</Title>
      {error && <Alert variant="error">{error}</Alert>}
      <Select
        label={t('kyc.documents.requirementCode', { defaultValue: 'Requirement' })}
        options={requirementOptions}
        value={requirement}
        onChange={(e) => setRequirement(e.target.value)}
        required
      />
      <FileUpload
        label={t('kyc.documents.file', { defaultValue: 'File' })}
        accept="application/pdf,image/jpeg,image/png"
        maxSizeBytes={MAX_FILE_SIZE}
        onChange={setFile}
        required
      />
      <Actions>
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={busy || !file || !requirement}>
          {busy ? t('common.submitting') : t('kyc.documents.upload')}
        </Button>
      </Actions>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #0b1220;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;