import { useEffect } from 'react';
import styled from 'styled-components';

export function Drawer({ open, onClose, children, side = 'right', width = 400, className }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Panel
        side={side}
        width={width}
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {children}
      </Panel>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(11, 18, 32, 0.5);
  z-index: 100;
`;

const Panel = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  ${({ side }) => (side === 'right' ? 'right: 0;' : 'left: 0;')}
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width)};
  background: #ffffff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 24px;
  overflow-y: auto;
`;