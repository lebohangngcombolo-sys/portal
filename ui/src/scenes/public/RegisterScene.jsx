/**
 * Registration scene.
 *
 * Collects identity fields, country, language, and password, and
 * accepts the terms. On success, navigates to email verification with
 * the submitted email prefilled.
 */
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../common/constants/routes.js';
import { registrationSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { useConfig } from '../../contexts/ConfigContext.jsx';
import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { Button } from '../../components/primitives/Button.jsx';
import { TextInput } from '../../components/primitives/TextInput.jsx';
import { PhoneInput } from '../../components/primitives/PhoneInput.jsx';
import { PasswordInput } from '../../components/primitives/PasswordInput.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { Checkbox } from '../../components/primitives/Checkbox.jsx';
import { Card } from '../../components/primitives/Card.jsx';
import { PasswordStrengthMeter } from '../../components/domain/PasswordStrengthMeter.jsx';

export default function RegisterScene() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const config = useConfig();

  const countryOptions = config.countries.map((c) => ({ value: c.iso2Code, label: c.name }));
  const languageOptions = config.languages.map((l) => ({ value: l.code, label: l.nativeName || l.name }));

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      countryCode: '',
      preferredLanguage: 'en',
      termsAccepted: false,
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      const res = await IdentityProvider.register(values);
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Registration failed');
        return { ok: false, errors: {}, messages: res.messages };
      }
      toast.success(t('auth.register.success', { defaultValue: 'Account created' }));
      navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(values.email)}`, { replace: true });
      return { ok: true };
    },
  });

  return (
    <main className="register">
      <Card>
        <h1>{t('auth.register.title')}</h1>
        <p className="register__intro">{t('auth.register.subtitle')}</p>
        <form onSubmit={form.handleSubmit} noValidate>
          <div className="grid-2">
            <TextInput
              label={t('auth.register.firstName')}
              required
              autoComplete="given-name"
              error={form.touched.firstName && form.errors.firstName}
              {...form.getFieldProps('firstName')}
            />
            <TextInput
              label={t('auth.register.lastName')}
              required
              autoComplete="family-name"
              error={form.touched.lastName && form.errors.lastName}
              {...form.getFieldProps('lastName')}
            />
          </div>
          <TextInput
            label={t('auth.register.email')}
            type="email"
            required
            autoComplete="email"
            error={form.touched.email && form.errors.email}
            {...form.getFieldProps('email')}
          />
          <PhoneInput
            label={t('auth.register.phoneNumber')}
            required
            error={form.touched.phoneNumber && form.errors.phoneNumber}
            {...form.getFieldProps('phoneNumber')}
          />
          <PasswordInput
            label={t('auth.register.password')}
            required
            autoComplete="new-password"
            hint={t('auth.register.passwordHint')}
            error={form.touched.password && form.errors.password}
            {...form.getFieldProps('password')}
          />
          <PasswordStrengthMeter password={form.values.password} />
          <Select
            label={t('auth.register.country')}
            required
            placeholder={t('common.selectCountry', { defaultValue: 'Select country' })}
            options={countryOptions}
            error={form.touched.countryCode && form.errors.countryCode}
            {...form.getFieldProps('countryCode')}
          />
          <Select
            label={t('auth.register.language')}
            required
            placeholder={t('common.selectLanguage', { defaultValue: 'Select language' })}
            options={languageOptions}
            error={form.touched.preferredLanguage && form.errors.preferredLanguage}
            {...form.getFieldProps('preferredLanguage')}
          />
          <Checkbox
            label={t('auth.register.acceptTerms')}
            checked={form.values.termsAccepted}
            onChange={(v) => form.setFieldValue('termsAccepted', v)}
            error={form.touched.termsAccepted && form.errors.termsAccepted}
          />
          <Button type="submit" variant="primary" disabled={form.isSubmitting}>
            {form.isSubmitting ? t('common.submitting') : t('auth.register.submit')}
          </Button>
        </form>
        <p className="register__footnote">
          {t('auth.register.hasAccount')}{' '}
          <Link to={ROUTES.LOGIN}>{t('auth.register.signIn')}</Link>
        </p>
      </Card>
    </main>
  );
}