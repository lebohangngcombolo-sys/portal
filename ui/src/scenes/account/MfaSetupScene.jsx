/**
 * MFA setup scene.
 *
 * Steps:
 * 1. Re-authenticate with current password.
 * 2. Show QR code + secret.
 * 3. Verify TOTP code.
 * 4. Display recovery codes (one-time view).
 * 5. Acknowledge and exit.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { PasswordInput } from '../../components/primitives/PasswordInput.jsx';
import { OtpInput } from '../../components/primitives/OtpInput.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Stepper } from '../../components/primitives/Stepper.jsx';
import { MfaQrCode } from '../../components/domain/MfaQrCode.jsx';
import { RecoveryCodeList } from '../../components/domain/RecoveryCodeList.jsx';
import { Checkbox } from '../../components/primitives/Checkbox.jsx';

const STEPS = ['reauth', 'scan', 'verify', 'recovery'];

export default function MfaSetupScene() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(0);
  const [password, setPassword] = useState('');
  const [setupData, setSetupData] = useState(null);
  const [code, setCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleReauth = async () => {
    setBusy(true);
    const res = await IdentityProvider.mfaSetupTotp({ currentPassword: password });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Invalid password');
      return;
    }
    setSetupData(res.result);
    setStep(1);
  };

  const handleVerify = async () => {
    setBusy(true);
    const res = await IdentityProvider.mfaVerifySetup({ code });
    setBusy(false);
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Invalid code');
      return;
    }
    setRecoveryCodes(res.result);
    setStep(3);
  };

  const finish = () => {
    toast.success(t('account.security.mfa.setup.complete', { defaultValue: 'MFA enabled' }));
    navigate(ROUTES.ACCOUNT_SECURITY);
  };

  return (
    <PageLayout title={t('account.security.mfa.setup.title')}>
      <Stepper steps={STEPS} current={step} />

      {step === 0 && (
        <Card>
          <h3>{t('account.security.mfa.setup.reauth', { defaultValue: 'Confirm your password' })}</h3>
          <PasswordInput
            label={t('account.security.password.currentPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="primary" onClick={handleReauth} disabled={busy || !password}>
            {t('common.next')}
          </Button>
        </Card>
      )}

      {step === 1 && setupData && (
        <Card>
          <h3>{t('account.security.mfa.setup.title')}</h3>
          <p>{t('account.security.mfa.setup.subtitle')}</p>
          <MfaQrCode uri={setupData.provisioningUri} secret={setupData.secretMasked} />
          <Button variant="primary" onClick={() => setStep(2)}>
            {t('account.security.mfa.setup.next')}
          </Button>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h3>{t('account.security.mfa.setup.verify')}</h3>
          <OtpInput
            label={t('auth.mfa.codeLabel')}
            length={6}
            value={code}
            onChange={setCode}
          />
          <Button variant="primary" onClick={handleVerify} disabled={busy || code.length !== 6}>
            {t('account.security.mfa.setup.verify')}
          </Button>
        </Card>
      )}

      {step === 3 && recoveryCodes && (
        <Card>
          <h3>{t('account.security.mfa.setup.recoveryCodes.title')}</h3>
          <p>{t('account.security.mfa.setup.recoveryCodes.subtitle')}</p>
          <RecoveryCodeList codes={recoveryCodes} />
          <Checkbox
            label={t('account.security.mfa.setup.recoveryCodes.acknowledged')}
            checked={acknowledged}
            onChange={setAcknowledged}
          />
          <Button variant="primary" onClick={finish} disabled={!acknowledged}>
            {t('common.continue')}
          </Button>
        </Card>
      )}
    </PageLayout>
  );
}