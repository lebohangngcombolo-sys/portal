/**
 * KYC decision history — append-only view of decisions, newest first.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatDateTime } from '../../common/utils/date.js';
import { Badge } from '../primitives/Badge.jsx';
import { EmptyState } from '../primitives/EmptyState.jsx';

export function KycDecisionHistory({ decisions = [] }) {
  const { t, i18n } = useTranslation();

  if (!decisions || decisions.length === 0) {
    return <EmptyState title={t('kyc.decisions.empty', { defaultValue: 'No decisions recorded yet.' })} />;
  }

  return (
    <List>
      {decisions.map((d) => (
        <Item key={d.id}>
          <Header>
            <Badge variant={d.decision === 'APPROVED' ? 'success' : 'error'}>
              {d.decision}
            </Badge>
            <Meta>
              v{d.decisionVersion} · {formatDateTime(d.decidedAt, i18n.language)}
            </Meta>
          </Header>
          {d.decisionReasonCode && <ReasonCode>{d.decisionReasonCode}</ReasonCode>}
          {d.decisionReason && <Reason>{d.decisionReason}</Reason>}
        </Item>
      ))}
    </List>
  );
}

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.li`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Meta = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const ReasonCode = styled.div`
  margin-top: 8px;
  font-family: monospace;
  font-size: 12px;
  color: #6b7280;
`;

const Reason = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #374151;
`;