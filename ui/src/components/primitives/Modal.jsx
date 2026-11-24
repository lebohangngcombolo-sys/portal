import { useEffect } from 'react';
import styled from 'styled-components';

export function Modal({ open, onClose, children, size = 'md', className }) {
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
      <Dialog
        role="dialog"
        aria-modal="true"
        size={size}
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {children}
      </Dialog>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(11, 18, 32, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const sizeMap = {
  sm: '360px',
  md: '520px',
  lg: '720px',
  xl: '960px',
};

const Dialog = styled.div`
  background: #ffffff;
  border-radius: 8px;
  max-width: ${({ size }) => sizeMap[size] || sizeMap.md};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;