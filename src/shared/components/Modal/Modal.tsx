import type { PropsWithChildren } from "react";
import styles from "./Modal.module.css";

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
