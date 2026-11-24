/**
 * Modal dialog for disabling MFA. Requires a valid TOTP code or recovery
 * code (server-side verifies).
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { Modal } from '../primitives/Modal.jsx';
import { Button } from '../primitives/Button.jsx';
import { OtpInput } from '../primitives/OtpInput.jsx';
import { Alert } from '../primitives/Alert.jsx';

export function MfaDisableDialog({ open, onClose, onDisabled }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleDisable = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await IdentityProvider.mfaDisable({ code });
      if (!res.ok) {
        setError(res.messages?.[0] || 'Invalid code');
        return;
      }
      toast.success(t('account.security.mfa.disabledSuccess', { defaultValue: 'MFA disabled' }));
      setCode('');
      onDisabled?.();
      onClose?.();
    } finally {
      setBusy(false);
    }
  };

  const handleClose = () => {
    if (busy) return;
    setCode('');
    setError(null);
    onClose?.();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Title>{t('account.security.mfa.disable')}</Title>
      <Alert variant="warning">{t('account.security.mfa.disableConfirm')}</Alert>
      {error && <Alert variant="error">{error}</Alert>}
      <OtpInput
        label={t('auth.mfa.codeLabel')}
        length={6}
        value={code}
        onChange={setCode}
        allowRecoveryCode
      />
      <Actions>
        <Button variant="ghost" onClick={handleClose} disabled={busy}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="danger"
          onClick={handleDisable}
          disabled={busy || code.length < 6}
        >
          {busy ? t('common.submitting') : t('account.security.mfa.disable')}
        </Button>
      </Actions>
    </Modal>
  );
}

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