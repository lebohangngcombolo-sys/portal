/**
 * Login scene.
 *
 * Accepts an email or E.164 phone plus password. If the account has MFA
 * enabled, the backend returns `mfaRequired: true` and the scene
 * navigates to the MFA challenge with the issued challengeId.
 */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '../../common/constants/routes.js';
import { loginSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { TextInput } from '../../components/primitives/TextInput.jsx';
import { PasswordInput } from '../../components/primitives/PasswordInput.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { Alert } from '../../components/primitives/Alert.jsx';

export default function LoginScene() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const toast = useToast();
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = useState(null);

  const form = useForm({
    initialValues: { identifier: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setSubmitError(null);
      const result = await signIn(values);
      if (!result.ok) {
        setSubmitError(result.messages?.[0] || 'Login failed');
        return result;
      }
      if (result.mfaRequired) {
        navigate(`${ROUTES.MFA_CHALLENGE}?challenge=${result.mfaChallengeId}`, { replace: true });
        return result;
      }
      toast.success(t('auth.login.success', { defaultValue: 'Signed in' }));
      const redirect = search.get('redirect') || ROUTES.DASHBOARD;
      navigate(redirect, { replace: true });
      return result;
    },
  });

  return (
    <main className="login">
      <Card>
        <h1>{t('auth.login.title')}</h1>
        {submitError && <Alert variant="error">{submitError}</Alert>}
        <form onSubmit={form.handleSubmit} noValidate>
          <TextInput
            label={t('auth.login.emailLabel')}
            autoComplete="username"
            autoFocus
            error={form.touched.identifier && form.errors.identifier}
            {...form.getFieldProps('identifier')}
          />
          <PasswordInput
            label={t('auth.login.passwordLabel')}
            autoComplete="current-password"
            error={form.touched.password && form.errors.password}
            {...form.getFieldProps('password')}
          />
          <Button type="submit" variant="primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? t('common.loading') : t('auth.login.submit')}
          </Button>
        </form>
        <div className="login__links">
          <Link to={ROUTES.FORGOT_PASSWORD}>{t('auth.login.forgotPassword')}</Link>
          <span>
            {t('auth.login.noAccount')}{' '}
            <Link to={ROUTES.REGISTER}>{t('auth.login.createOne')}</Link>
          </span>
        </div>
      </Card>
    </main>
  );
}