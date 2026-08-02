import { useEffect, useState, type AnimationEvent, type PropsWithChildren } from "react";
import styles from "./Modal.module.css";

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (isClosing && event.currentTarget === event.target) {
      setShouldRender(false);
      setIsClosing(false);
    }
  }

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={onClose}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={`${styles.content} ${isClosing ? styles.contentClosing : ""}`}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
