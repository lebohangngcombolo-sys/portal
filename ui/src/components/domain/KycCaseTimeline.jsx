/**
 * Timeline view of KYC events (reviews, decisions, status changes).
 *
 * Accepts either cases (from the analytics widget) or review records
 * (from the case detail scene). Renders a vertical timeline.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { formatDateTime } from '../../common/utils/date.js';
import { StatusBadge } from './StatusBadge.jsx';
import { EmptyState } from '../primitives/EmptyState.jsx';

export function KycCaseTimeline({ cases = [] }) {
  const { t, i18n } = useTranslation();

  if (!cases || cases.length === 0) {
    return <EmptyState title={t('kyc.timeline.empty', { defaultValue: 'No activity yet.' })} />;
  }

  return (
    <Timeline>
      {cases.map((entry) => (
        <Event key={entry.id}>
          <Dot />
          <Content>
            <EventHeader>
              <Title>
                {entry.caseNumber ||
                  entry.reviewStage ||
                  entry.decision ||
                  entry.action ||
                  t('kyc.timeline.event', { defaultValue: 'Event' })}
              </Title>
              {entry.status && <StatusBadge status={entry.status} />}
            </EventHeader>
            <EventMeta>
              {formatDateTime(
                entry.createdAt || entry.decidedAt || entry.updatedAt,
                i18n.language,
              )}
            </EventMeta>
            {entry.notes && <EventBody>{entry.notes}</EventBody>}
          </Content>
        </Event>
      ))}
    </Timeline>
  );
}

const Timeline = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

const Event = styled.li`
  display: flex;
  gap: 12px;
  position: relative;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0b5fff;
  margin-top: 6px;
  flex-shrink: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const EventHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.strong`
  font-size: 14px;
  color: #0b1220;
`;

const EventMeta = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const EventBody = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #374151;
`;