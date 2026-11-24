/**
 * Toast notifications (transient, in-app).
 *
 * Wraps react-hot-toast to give the app a single, typed API for showing
 * success/error/info messages. Scenes call `useToast()` and never import
 * react-hot-toast directly.
 */
import { createDomainContext } from './Context.jsx';

const { Provider, useState, useUpdate } = createDomainContext('Toast', {
  toasts: [],
});

export const ToastProvider = Provider;
export const useToastState = useState;
export const useToastUpdate = useUpdate;

/**
 * Imperative API — hook to push toasts.
 */
export function useToast() {
  const { set } = useToastUpdate();

  const push = (toast) => {
    set((prev) => ({
      toasts: [...prev.toasts, { id: crypto.randomUUID(), ...toast }],
    }));
  };

  const dismiss = (id) => {
    set((prev) => ({ toasts: prev.toasts.filter((t) => t.id !== id) }));
  };

  return {
    success: (message, opts = {}) => push({ type: 'success', message, ...opts }),
    error: (message, opts = {}) => push({ type: 'error', message, ...opts }),
    info: (message, opts = {}) => push({ type: 'info', message, ...opts }),
    warning: (message, opts = {}) => push({ type: 'warning', message, ...opts }),
    dismiss,
  };
}