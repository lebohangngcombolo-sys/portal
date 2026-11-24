/**
 * MFA challenge scene.
 *
 * Reached after login when the backend responds with `mfaRequired: true`.
 * Accepts either a 6-digit TOTP code or a XXXXXXXX-XXXXXXXX recovery code.
 */
import { useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { mfaChallengeSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { OtpInput } from '../../components/primitives/OtpInput.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Alert } from '../../components/primitives/Alert.jsx';

export default function MfaChallengeScene() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [search] = useSearchParams();
  const challengeId = search.get('challenge');
  const { verifyMfa } = useAuth();

  const form = useForm({
    initialValues: { code: '' },
    validationSchema: mfaChallengeSchema,
    onSubmit: async (values) => {
      const result = await verifyMfa({ challengeId, code: values.code });
      if (!result.ok) {
        toast.error(result.messages?.[0] || t('auth.mfa.invalid'));
        return { ok: false };
      }
      toast.success(t('auth.mfa.success', { defaultValue: 'Verified' }));
      navigate(ROUTES.DASHBOARD, { replace: true });
      return { ok: true };
    },
  });

  // If there's no challenge ID, the user shouldn't be here
  if (!challengeId) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <main className="mfa-challenge">
      <Card>
        <h1>{t('auth.mfa.challengeTitle')}</h1>
        <p>{t('auth.mfa.challengeSubtitle')}</p>
        <OtpInput
          label={t('auth.mfa.codeLabel')}
          length={6}
          value={form.values.code}
          onChange={(v) => form.setFieldValue('code', v)}
          error={form.touched.code && form.errors.code}
          allowRecoveryCode
        />
        <Button
          variant="primary"
          onClick={form.handleSubmit}
          disabled={form.isSubmitting}
        >
          {form.isSubmitting ? t('common.submitting') : t('auth.mfa.verify')}
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
        >
          {t('common.back')}
        </Button>
      </Card>
    </main>
  );
}