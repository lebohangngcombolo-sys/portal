/**
 * Full delivery detail view — shown inside a Modal from DeliveriesScene.
 *
 * Shows the delivery record with failure code, error, and a retry action
 * if the delivery is eligible.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatDateTime } from '../../common/utils/date.js';
import { Badge } from '../primitives/Badge.jsx';
import { Button } from '../primitives/Button.jsx';

export function DeliveryDetail({ delivery, onRetry, onClose }) {
  const { t, i18n } = useTranslation();
  if (!delivery) return null;

  const retryable =
    delivery.status === 'FAILED' || delivery.status === 'BOUNCED';

  return (
    <Wrapper>
      <h2>{t('admin.deliveries.detail', { defaultValue: 'Delivery detail' })}</h2>
      <dl>
        <dt>{t('admin.deliveries.provider', { defaultValue: 'Provider' })}</dt>
        <dd>{delivery.provider}</dd>

        <dt>{t('admin.deliveries.statusLabel', { defaultValue: 'Status' })}</dt>
        <dd>
          <Badge
            variant={
              delivery.status === 'DELIVERED'
                ? 'success'
                : delivery.status === 'FAILED' || delivery.status === 'BOUNCED'
                  ? 'error'
                  : 'neutral'
            }
          >
            {delivery.status}
          </Badge>
        </dd>

        <dt>{t('admin.deliveries.attempts', { defaultValue: 'Attempts' })}</dt>
        <dd>{delivery.attemptNumber}</dd>

        {delivery.failureCode && (
          <>
            <dt>{t('admin.deliveries.failureCode', { defaultValue: 'Failure code' })}</dt>
            <dd><code>{delivery.failureCode}</code></dd>
          </>
        )}
        {delivery.failureReason && (
          <>
            <dt>{t('admin.deliveries.failureReason', { defaultValue: 'Failure reason' })}</dt>
            <dd>{delivery.failureReason}</dd>
          </>
        )}
        <dt>{t('admin.deliveries.created', { defaultValue: 'Created' })}</dt>
        <dd>{delivery.createdAt ? formatDateTime(delivery.createdAt, i18n.language) : '—'}</dd>
        {delivery.submittedAt && (
          <>
            <dt>{t('admin.deliveries.submitted', { defaultValue: 'Submitted' })}</dt>
            <dd>{formatDateTime(delivery.submittedAt, i18n.language)}</dd>
          </>
        )}
        {delivery.deliveredAt && (
          <>
            <dt>{t('admin.deliveries.delivered', { defaultValue: 'Delivered' })}</dt>
            <dd>{formatDateTime(delivery.deliveredAt, i18n.language)}</dd>
          </>
        )}
      </dl>
      <Actions>
        <Button variant="ghost" onClick={onClose}>
          {t('common.close')}
        </Button>
        {retryable && (
          <Button variant="primary" onClick={onRetry}>
            {t('admin.deliveries.retry', { defaultValue: 'Retry' })}
          </Button>
        )}
      </Actions>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    margin: 0;
    font-size: 18px;
  }

  dl {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 8px 16px;
    margin: 0;
  }

  dt {
    font-size: 13px;
    color: #6b7280;
  }

  dd {
    margin: 0;
    font-size: 14px;
    color: #0b1220;
  }

  code {
    font-family: monospace;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 3px;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;