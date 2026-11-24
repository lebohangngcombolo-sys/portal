/**
 * Forgot password scene — request a reset code by email.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { passwordResetRequestSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { Button } from '../../components/primitives/Button.jsx';
import { TextInput } from '../../components/primitives/TextInput.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Alert } from '../../components/primitives/Alert.jsx';

export default function ForgotPasswordScene() {
  const { t } = useTranslation();
  const toast = useToast();
  const [sent, setSent] = useState(false);

  const form = useForm({
    initialValues: { email: '' },
    validationSchema: passwordResetRequestSchema,
    onSubmit: async (values) => {
      await IdentityProvider.requestPasswordReset({ email: values.email });
      setSent(true);
      toast.success(t('auth.forgotPassword.sent'));
      return { ok: true };
    },
  });

  return (
    <main className="forgot-password">
      <Card>
        <h1>{t('auth.forgotPassword.title')}</h1>
        <p>{t('auth.forgotPassword.subtitle')}</p>

        {sent ? (
          <Alert variant="success">{t('auth.forgotPassword.sent')}</Alert>
        ) : (
          <form onSubmit={form.handleSubmit} noValidate>
            <TextInput
              label={t('auth.register.email')}
              type="email"
              required
              autoComplete="email"
              error={form.touched.email && form.errors.email}
              {...form.getFieldProps('email')}
            />
            <Button type="submit" variant="primary" disabled={form.isSubmitting}>
              {form.isSubmitting ? t('common.submitting') : t('auth.forgotPassword.submit')}
            </Button>
          </form>
        )}
        <Link to={ROUTES.LOGIN}>{t('common.back')}</Link>
      </Card>
    </main>
  );
}