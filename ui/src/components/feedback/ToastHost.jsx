/**
 * Renders the toast stack. Consumes ToastContext. Each toast auto-dismisses
 * after 5 seconds unless it's an error (8 seconds for errors).
 */
import { useEffect } from 'react';
import styled from 'styled-components';

import { useToastState, useToastUpdate } from '../../contexts/ToastContext.jsx';
import { Toast } from './Toast.jsx';

const AUTO_DISMISS_MS = 5000;
const AUTO_DISMISS_ERROR_MS = 8000;

export function ToastHost() {
  const { toasts } = useToastState();
  const { set } = useToastUpdate();

  useEffect(() => {
    const timers = toasts.map((t) => {
      const ttl = t.type === 'error' ? AUTO_DISMISS_ERROR_MS : AUTO_DISMISS_MS;
      return setTimeout(() => {
        set((prev) => ({ toasts: prev.toasts.filter((x) => x.id !== t.id) }));
      }, ttl);
    });
    return () => timers.forEach(clearTimeout);
  }, [toasts, set]);

  if (!toasts || toasts.length === 0) return null;

  const dismiss = (id) => {
    set((prev) => ({ toasts: prev.toasts.filter((t) => t.id !== id) }));
  };

  return (
    <Stack aria-live="polite">
      {toasts.map((t) => (
        <Toast key={t.id} type={t.type} message={t.message} onClose={() => dismiss(t.id)} />
      ))}
    </Stack>
  );
}

const Stack = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 200;
`;