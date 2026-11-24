import { useState } from 'react';
import styled from 'styled-components';

export function Tooltip({ content, children, position = 'top', className }) {
  const [visible, setVisible] = useState(false);
  return (
    <Wrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      className={className}
    >
      {children}
      {visible && content && <Bubble position={position}>{content}</Bubble>}
    </Wrapper>
  );
}

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
`;

const Bubble = styled.span`
  position: absolute;
  ${({ position }) => {
    switch (position) {
      case 'bottom':
        return 'top: 100%; left: 50%; transform: translateX(-50%);';
      case 'left':
        return 'right: 100%; top: 50%; transform: translateY(-50%);';
      case 'right':
        return 'left: 100%; top: 50%; transform: translateY(-50%);';
      default:
        return 'bottom: 100%; left: 50%; transform: translateX(-50%);';
    }
  }}
  margin: 6px;
  background: #0b1220;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 50;
`;