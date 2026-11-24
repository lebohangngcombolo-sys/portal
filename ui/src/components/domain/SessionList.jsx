/**
 * Session list — one row per session with device, IP, last activity,
 * and a revoke button. Marks the current session visually.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatRelative } from '../../common/utils/date.js';
import { Button } from '../primitives/Button.jsx';
import { EmptyState } from '../primitives/EmptyState.jsx';

export function SessionList({ sessions = [], currentSessionId, onRevoke }) {
  const { t, i18n } = useTranslation();

  if (!sessions || sessions.length === 0) {
    return <EmptyState title={t('account.security.sessions.empty', { defaultValue: 'No active sessions.' })} />;
  }

  return (
    <List>
      {sessions.map((s) => {
        const isCurrent = s.id === currentSessionId;
        return (
          <Row key={s.id}>
            <Cell>
              <Device>{s.deviceName || t('account.security.sessions.unknownDevice', { defaultValue: 'Unknown device' })}</Device>
              {isCurrent && <Current>{t('account.security.sessions.current')}</Current>}
            </Cell>
            <Cell>{s.ipAddress || '—'}</Cell>
            <Cell>{s.lastActivityAt ? formatRelative(s.lastActivityAt, i18n.language) : '—'}</Cell>
            <CellRight>
              <Button
                variant="ghost"
                size="sm"
                disabled={isCurrent}
                onClick={() => onRevoke?.(s.id)}
                title={isCurrent ? t('account.security.sessions.cannotRevokeCurrent', { defaultValue: 'Cannot revoke the current session' }) : undefined}
              >
                {t('account.security.sessions.revoke')}
              </Button>
            </CellRight>
          </Row>
        );
      })}
    </List>
  );
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
`;

const Cell = styled.div`
  color: #374151;
`;

const CellRight = styled.div`
  text-align: right;
`;

const Device = styled.div`
  font-weight: 500;
  color: #0b1220;
`;

const Current = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
`;