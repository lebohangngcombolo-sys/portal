/**
 * Modal dialog for changing the current user's password.
 *
 * Validates that current password is correct (via the backend validate
 * endpoint) before allowing the change. Includes a strength meter.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { changePasswordSchema } from '../../forms/configuration/validation.js';
import { useForm } from '../../hooks/useForm.js';
import { Modal } from '../primitives/Modal.jsx';
import { Button } from '../primitives/Button.jsx';
import { PasswordInput } from '../primitives/PasswordInput.jsx';
import { Alert } from '../primitives/Alert.jsx';
import { PasswordStrengthMeter } from './PasswordStrengthMeter.jsx';

export function ChangePasswordDialog({ open, onClose, onChanged }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {
      setError(null);
      const res = await IdentityProvider.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (!res.ok) {
        setError(res.messages?.[0] || 'Password change failed');
        return res;
      }
      toast.success(t('account.security.password.success'));
      form.resetForm();
      onChanged?.();
      onClose?.();
      return res;
    },
  });

  const handleClose = () => {
    if (form.isSubmitting) return;
    form.resetForm();
    setError(null);
    onClose?.();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Title>{t('account.security.password.change')}</Title>
      {error && <Alert variant="error">{error}</Alert>}
      <form onSubmit={form.handleSubmit} noValidate>
        <PasswordInput
          label={t('account.security.password.currentPassword')}
          autoComplete="current-password"
          required
          error={form.touched.currentPassword && form.errors.currentPassword}
          {...form.getFieldProps('currentPassword')}
        />
        <PasswordInput
          label={t('account.security.password.newPassword')}
          autoComplete="new-password"
          required
          error={form.touched.newPassword && form.errors.newPassword}
          {...form.getFieldProps('newPassword')}
        />
        <PasswordStrengthMeter password={form.values.newPassword} />
        <PasswordInput
          label={t('account.security.password.confirmPassword')}
          autoComplete="new-password"
          required
          error={form.touched.confirmPassword && form.errors.confirmPassword}
          {...form.getFieldProps('confirmPassword')}
        />
        <Actions>
          <Button variant="ghost" type="button" onClick={handleClose} disabled={form.isSubmitting}>
            {t('common.cancel')}
          </Button>
          <Button variant="primary" type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting ? t('common.saving') : t('common.save')}
          </Button>
        </Actions>
      </form>
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