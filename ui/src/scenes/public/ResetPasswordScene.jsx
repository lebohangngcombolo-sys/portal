/**
 * Reset password scene — redeem a reset code and set a new password.
 */
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { passwordResetSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { Button } from '../../components/primitives/Button.jsx';
import { TextInput } from '../../components/primitives/TextInput.jsx';
import { PasswordInput } from '../../components/primitives/PasswordInput.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { PasswordStrengthMeter } from '../../components/domain/PasswordStrengthMeter.jsx';

export default function ResetPasswordScene() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [search] = useSearchParams();
  const initialToken = search.get('token') || '';

  const form = useForm({
    initialValues: {
      token: initialToken,
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordResetSchema,
    onSubmit: async (values) => {
      const res = await IdentityProvider.resetPassword({
        token: values.token,
        newPassword: values.newPassword,
      });
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Reset failed');
        return { ok: false };
      }
      toast.success(t('auth.resetPassword.success'));
      navigate(ROUTES.LOGIN, { replace: true });
      return { ok: true };
    },
  });

  return (
    <main className="reset-password">
      <Card>
        <h1>{t('auth.resetPassword.title')}</h1>
        <form onSubmit={form.handleSubmit} noValidate>
          <TextInput
            label={t('auth.resetPassword.codeLabel')}
            required
            error={form.touched.token && form.errors.token}
            {...form.getFieldProps('token')}
          />
          <PasswordInput
            label={t('auth.resetPassword.newPassword')}
            required
            autoComplete="new-password"
            error={form.touched.newPassword && form.errors.newPassword}
            {...form.getFieldProps('newPassword')}
          />
          <PasswordStrengthMeter password={form.values.newPassword} />
          <PasswordInput
            label={t('auth.resetPassword.confirmPassword')}
            required
            autoComplete="new-password"
            error={form.touched.confirmPassword && form.errors.confirmPassword}
            {...form.getFieldProps('confirmPassword')}
          />
          <Button type="submit" variant="primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? t('common.submitting') : t('auth.resetPassword.submit')}
          </Button>
        </form>
      </Card>
    </main>
  );
}