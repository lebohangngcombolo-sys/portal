/**
 * A single row in the notification preferences list.
 *
 * Renders the channel label, a toggle switch, and a hint for mandatory
 * channels (security-critical notifications).
 */
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Badge } from '../primitives/Badge.jsx';

export function PreferenceToggle({ preference, onChange }) {
  const { t } = useTranslation();
  const { channel, enabled, mandatory } = preference || {};

  return (
    <Row>
      <Left>
        <Channel>
          {t(`notifications.preferences.channels.${channel}`, { defaultValue: channel })}
        </Channel>
        {mandatory && (
          <Badge variant="info">
            {t('notifications.preferences.mandatory', { defaultValue: 'Mandatory' })}
          </Badge>
        )}
      </Left>
      <Toggle>
        <Switch
          type="button"
          role="switch"
          aria-checked={Boolean(enabled)}
          disabled={Boolean(mandatory)}
          checked={Boolean(enabled)}
          onClick={() => !mandatory && onChange?.(!enabled)}
        >
          <Knob checked={Boolean(enabled)} />
        </Switch>
      </Toggle>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Channel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #0b1220;
`;

const Toggle = styled.div``;

const Switch = styled.button`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  border: none;
  background: ${({ checked }) => (checked ? '#0b5fff' : '#d1d5db')};
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  padding: 0;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: background 0.15s;
`;

const Knob = styled.div`
  position: absolute;
  top: 2px;
  left: ${({ checked }) => (checked ? '20px' : '2px')};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  transition: left 0.15s;
`;