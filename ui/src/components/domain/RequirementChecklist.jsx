/**
 * KYC requirement checklist — each requirement + satisfaction status.
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { EmptyState } from '../primitives/EmptyState.jsx';

export function RequirementChecklist({ requirements = [] }) {
  const { t } = useTranslation();

  if (!requirements || requirements.length === 0) {
    return <EmptyState title={t('kyc.requirements.empty', { defaultValue: 'No requirements defined.' })} />;
  }

  return (
    <List>
      {requirements.map((r) => (
        <Item key={r.requirementCode} satisfied={r.satisfied}>
          <Check satisfied={r.satisfied}>{r.satisfied ? '✓' : '○'}</Check>
          <Body>
            <Label>
              {t(`kyc.requirements.${r.requirementCode}`, { defaultValue: r.description || r.requirementCode })}
              {r.required && <Required> *</Required>}
            </Label>
            {r.allowedMimeTypes?.length > 0 && (
              <Hint>
                {t('kyc.requirements.fileTypes', {
                  types: r.allowedMimeTypes.join(', '),
                  defaultValue: 'Allowed: {{types}}',
                })}
              </Hint>
            )}
          </Body>
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
  gap: 8px;
`;

const Item = styled.li`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ satisfied }) => (satisfied ? '#f0fdf4' : '#ffffff')};
  border: 1px solid ${({ satisfied }) => (satisfied ? '#bbf7d0' : '#e5e7eb')};
  border-radius: 6px;
`;

const Check = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: ${({ satisfied }) => (satisfied ? '#10b981' : '#e5e7eb')};
  color: ${({ satisfied }) => (satisfied ? '#ffffff' : '#6b7280')};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #0b1220;
`;

const Required = styled.span`
  color: #ef4444;
`;

const Hint = styled.div`
  font-size: 12px;
  color: #6b7280;
`;