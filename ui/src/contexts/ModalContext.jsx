/**
 * Modal manager.
 *
 * Modals are opened by scenes calling `useModal().open({ id, props, onClose })`.
 * The `<ModalHost />` (rendered by AppShell) renders the topmost modal.
 */
import { createDomainContext } from './Context.jsx';

const { Provider, useState, useUpdate } = createDomainContext('Modal', {
  stack: [],
});

export const ModalProvider = Provider;
export const useModalState = useState;
export const useModalUpdate = useUpdate;

export function useModal() {
  const { set, get } = useModalUpdate();

  const open = (entry) => {
    set((prev) => ({ stack: [...prev.stack, entry] }));
  };

  const close = (id) => {
    set((prev) => ({ stack: prev.stack.filter((m) => m.id !== id) }));
  };

  const closeTop = () => {
    const stack = get().stack;
    if (stack.length === 0) return;
    close(stack[stack.length - 1].id);
  };

  return { open, close, closeTop };
}