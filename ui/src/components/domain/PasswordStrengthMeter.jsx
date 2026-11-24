/**
 * Password strength meter.
 *
 * Live feedback as the user types. Reads the current password, runs it
 * through the client-side password policy, and shows satisfied/unsatisfied
 * rules + a strength bar (0–4).
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { evaluatePassword, passwordStrength } from '../../common/business/passwordPolicy.js';

const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
const STRENGTH_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981'];

export function PasswordStrengthMeter({ password }) {
  const { t } = useTranslation();

  const { rules } = useMemo(() => evaluatePassword(password || ''), [password]);
  const score = useMemo(() => passwordStrength(password || ''), [password]);

  // Don't render until the user starts typing
  if (!password) return null;

  return (
    <Wrapper>
      <Bar>
        {[0, 1, 2, 3].map((i) => (
          <Segment key={i} filled={i < score} color={STRENGTH_COLORS[score]} />
        ))}
      </Bar>
      <StrengthLabel color={STRENGTH_COLORS[score]}>
        {t(`password.strength.${score}`, { defaultValue: STRENGTH_LABELS[score] })}
      </StrengthLabel>

      <Rules>
        {rules.map((rule) => (
          <Rule key={rule.key} satisfied={rule.satisfied}>
            <Bullet satisfied={rule.satisfied}>{rule.satisfied ? '✓' : '○'}</Bullet>
            <RuleLabel satisfied={rule.satisfied}>{rule.label}</RuleLabel>
          </Rule>
        ))}
      </Rules>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: -8px 0 16px;
`;

const Bar = styled.div`
  display: flex;
  gap: 4px;
  height: 6px;
`;

const Segment = styled.div`
  flex: 1;
  background: ${({ filled, color }) => (filled ? color : '#e5e7eb')};
  border-radius: 3px;
  transition: background 0.15s;
`;

const StrengthLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ color }) => color};
`;

const Rules = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Rule = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
`;

const Bullet = styled.span`
  color: ${({ satisfied }) => (satisfied ? '#10b981' : '#9ca3af')};
  font-weight: 700;
  width: 12px;
`;

const RuleLabel = styled.span`
  color: ${({ satisfied }) => (satisfied ? '#065f46' : '#6b7280')};
`;