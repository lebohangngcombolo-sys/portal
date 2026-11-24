/**
 * Confirmation dialog — a Modal with title, body, cancel, confirm.
 *
 * Usage:
 *   <ConfirmationDialog
 *     open={showConfirm}
 *     title="Delete this item?"
 *     body="This cannot be undone."
 *     confirmLabel="Delete"
 *     variant="danger"
 *     onCancel={() => setShowConfirm(false)}
 *     onConfirm={handleDelete}
 *   />
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Modal } from '../primitives/Modal.jsx';
import { Button } from '../primitives/Button.jsx';

export function ConfirmationDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  variant = 'primary',
  onCancel,
  onConfirm,
  loading = false,
}) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onCancel} size="sm">
      <Title>{title}</Title>
      {body && <Body>{body}</Body>}
      <Actions>
        <Button variant="ghost" onClick={onCancel} disabled={loading}>
          {cancelLabel || t('common.cancel')}
        </Button>
        <Button variant={variant} onClick={onConfirm} disabled={loading}>
          {loading ? t('common.submitting') : confirmLabel || t('common.confirm')}
        </Button>
      </Actions>
    </Modal>
  );
}

const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #0b1220;
`;

const Body = styled.p`
  margin: 0 0 24px;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;