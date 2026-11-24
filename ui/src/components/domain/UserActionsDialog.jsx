/**
 * Composite dialog for user administration actions:
 * suspend, reactivate, unlock, and assign roles.
 *
 * Each action is a separate tab. The dialog auto-detects which actions
 * make sense for the current user's status and only shows those.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useToast } from '../../contexts/ToastContext.jsx';
import { IdentityProvider } from '../../providers/index.js';
import { ROLES } from '../../common/constants/userRoles.js';
import { Modal } from '../primitives/Modal.jsx';
import { Button } from '../primitives/Button.jsx';
import { Tabs } from '../primitives/Tabs.jsx';
import { Textarea } from '../primitives/Textarea.jsx';
import { Checkbox } from '../primitives/Checkbox.jsx';
import { Alert } from '../primitives/Alert.jsx';

const ROLE_OPTIONS = [
  ROLES.CUSTOMER,
  ROLES.SUPPORT,
  ROLES.KYC_ANALYST,
  ROLES.KYC_SUPERVISOR,
  ROLES.COMPLIANCE_OFFICER,
  ROLES.ADMIN,
  ROLES.SUPER_ADMIN,
];

export function UserActionsDialog({ user, onClose, onComplete }) {
  const { t } = useTranslation();
  const toast = useToast();

  const initialTab = (() => {
    if (user.status === 'LOCKED') return 'unlock';
    if (user.status === 'ACTIVE') return 'suspend';
    return 'roles';
  })();

  const [tab, setTab] = useState(initialTab);
  const [reason, setReason] = useState('');
  const [selectedRoles, setSelectedRoles] = useState(user.roles || []);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const tabs = [
    { value: 'roles', label: t('admin.users.actions.assignRoles', { defaultValue: 'Roles' }) },
    user.status === 'ACTIVE' && {
      value: 'suspend',
      label: t('admin.users.actions.suspend'),
    },
    user.status === 'SUSPENDED' && {
      value: 'reactivate',
      label: t('admin.users.actions.reactivate'),
    },
    user.status === 'LOCKED' && {
      value: 'unlock',
      label: t('admin.users.actions.unlock'),
    },
  ].filter(Boolean);

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSubmit = async () => {
    setError(null);
    setBusy(true);
    try {
      let res;
      if (tab === 'suspend') {
        res = await IdentityProvider.adminUpdateStatus(user.id, {
          status: 'SUSPENDED',
          reason,
        });
      } else if (tab === 'reactivate') {
        res = await IdentityProvider.adminUpdateStatus(user.id, {
          status: 'ACTIVE',
          reason,
        });
      } else if (tab === 'unlock') {
        res = await IdentityProvider.adminUnlock(user.id);
      } else if (tab === 'roles') {
        res = await IdentityProvider.adminAssignRoles(user.id, {
          roleCodes: selectedRoles,
        });
      }
      if (!res?.ok) {
        setError(res?.messages?.[0] || 'Action failed');
        return;
      }
      toast.success(t('common.save'));
      onComplete?.();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} size="md">
      <Title>
        {user.firstName} {user.lastName}
      </Title>
      <Subtitle>{user.email}</Subtitle>
      {error && <Alert variant="error">{error}</Alert>}
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'roles' && (
        <Roles>
          {ROLE_OPTIONS.map((role) => (
            <Checkbox
              key={role}
              label={t(`admin.users.roles.${role}`, { defaultValue: role })}
              checked={selectedRoles.includes(role)}
              onChange={() => toggleRole(role)}
            />
          ))}
        </Roles>
      )}

      {(tab === 'suspend' || tab === 'reactivate') && (
        <Textarea
          label={t('admin.users.reason', { defaultValue: 'Reason (optional)' })}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={500}
        />
      )}

      {tab === 'unlock' && (
        <Alert variant="info">
          {t('admin.users.unlockHint', {
            defaultValue: 'Unlocking will reset the failed login counter. The user will be able to sign in again.',
          })}
        </Alert>
      )}

      <Actions>
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          {t('common.cancel')}
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={busy}>
          {busy ? t('common.submitting') : t('common.confirm')}
        </Button>
      </Actions>
    </Modal>
  );
}

const Title = styled.h2`
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: #0b1220;
`;

const Subtitle = styled.p`
  margin: 0 0 16px;
  font-size: 13px;
  color: #6b7280;
`;

const Roles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;