// components/feedback/ModalHost.jsx
import { useModalState } from '../../contexts/ModalContext.jsx';
import { Modal } from '../primitives/Modal.jsx';

export function ModalHost() {
  const { stack } = useModalState();
  if (!stack || stack.length === 0) return null;
  const top = stack[stack.length - 1];
  return (
    <Modal open onClose={() => top.onClose?.()}>
      {top.render ? top.render() : null}
    </Modal>
  );
}