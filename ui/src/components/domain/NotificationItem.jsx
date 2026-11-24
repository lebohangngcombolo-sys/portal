/**
 * A single notification row in the notification center.
 *
 * Shows channel, subject, body preview, and read/unread state. Provides
 * "mark read" and "archive" actions.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatRelative } from '../../common/utils/date.js';
import { Badge } from '../primitives/Badge.jsx';
import { Button } from '../primitives/Button.jsx';

export function NotificationItem({ notification, onMarkRead, onArchive }) {
  const { t, i18n } = useTranslation();
  if (!notification) return null;

  const { read, channel, subject, bodyPreview, createdAt } = notification;

  return (
    <Row read={read}>
      <Main>
        <TopLine>
          <Badge variant="neutral">{channel}</Badge>
          {!read && (
            <Badge variant="info">{t('notifications.center.unread', { defaultValue: 'New' })}</Badge>
          )}
          <Time>
            {createdAt ? formatRelative(createdAt, i18n.language) : ''}
          </Time>
        </TopLine>
        <Subject>{subject || t('notifications.center.noSubject', { defaultValue: '(No subject)' })}</Subject>
        {bodyPreview && <Preview>{bodyPreview}</Preview>}
      </Main>
      <Actions>
        {!read && (
          <Button variant="ghost" size="sm" onClick={onMarkRead}>
            {t('notifications.center.markRead')}
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={onArchive}>
          {t('notifications.center.archive')}
        </Button>
      </Actions>
    </Row>
  );
}

const Row = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: ${({ read }) => (read ? 'transparent' : '#f0f9ff')};
  list-style: none;

  &:last-child {
    border-bottom: none;
  }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TopLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Time = styled.span`
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
`;

const Subject = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0b1220;
`;

const Preview = styled.div`
  font-size: 13px;
  color: #6b7280;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;