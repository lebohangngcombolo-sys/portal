/**
 * Email verification scene.
 *
 * Accepts a 6-digit OTP; on success, redirects to login (or to the
 * post-login redirect if one exists). Offers resend with a 60s cooldown.
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { emailVerificationSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { Button } from '../../components/primitives/Button.jsx';
import { OtpInput } from '../../components/primitives/OtpInput.jsx';
import { TextInput } from '../../components/primitives/TextInput.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Alert } from '../../components/primitives/Alert.jsx';

const RESEND_COOLDOWN_SECONDS = 60;

export default function EmailVerificationScene() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [search] = useSearchParams();
  const initialEmail = search.get('email') || '';

  const [resendAt, setResendAt] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const form = useForm({
    initialValues: { email: initialEmail, code: '' },
    validationSchema: emailVerificationSchema,
    onSubmit: async (values) => {
      const res = await IdentityProvider.verifyEmail(values);
      if (!res.ok) {
        toast.error(res.messages?.[0] || t('auth.verifyEmail.invalid'));
        return { ok: false };
      }
      toast.success(t('auth.verifyEmail.success', { defaultValue: 'Email verified' }));
      navigate(`${ROUTES.LOGIN}?email=${encodeURIComponent(values.email)}`, { replace: true });
      return { ok: true };
    },
  });

  // Resend cooldown ticker
  useEffect(() => {
    if (!resendAt) return undefined;
    const tick = setInterval(() => {
      const remaining = Math.ceil((resendAt - Date.now()) / 1000);
      setCountdown(Math.max(0, remaining));
    }, 500);
    return () => clearInterval(tick);
  }, [resendAt]);

  const resendDisabled = useMemo(
    () => Date.now() < resendAt || resendLoading || !form.values.email,
    [resendAt, resendLoading, form.values.email],
  );

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await IdentityProvider.resendVerification({ email: form.values.email });
      setResendAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
      toast.success(t('auth.verifyEmail.resent'));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="verify-email">
      <Card>
        <h1>{t('auth.verifyEmail.title')}</h1>
        <p>{t('auth.verifyEmail.subtitle', { email: form.values.email })}</p>

        <TextInput
          label={t('auth.register.email')}
          type="email"
          required
          error={form.touched.email && form.errors.email}
          {...form.getFieldProps('email')}
        />
        <OtpInput
          label={t('auth.verifyEmail.codeLabel')}
          length={6}
          value={form.values.code}
          onChange={(v) => form.setFieldValue('code', v)}
          error={form.touched.code && form.errors.code}
        />
        <Button
          variant="primary"
          onClick={form.handleSubmit}
          disabled={form.isSubmitting}
        >
          {form.isSubmitting ? t('common.submitting') : t('auth.verifyEmail.submit')}
        </Button>
        <Button variant="ghost" onClick={handleResend} disabled={resendDisabled}>
          {countdown > 0
            ? t('auth.verifyEmail.resendIn', { seconds: countdown, defaultValue: 'Resend in {{seconds}}s' })
            : t('auth.verifyEmail.resend')}
        </Button>
      </Card>
    </main>
  );
}