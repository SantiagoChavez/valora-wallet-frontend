import { useEffect, useRef, useState, type AnimationEvent, type PropsWithChildren } from "react";
import styles from "./Modal.module.css";

// Debe cubrir la duración de overlayOut/contentOut en Modal.module.css (0.15s) + margen.
const CLOSE_FALLBACK_MS = 200;

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const wasOpenRef = useRef(isOpen);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      clearTimeout(closeTimerRef.current);
      setShouldRender(true);
      setIsClosing(false);
    } else if (wasOpenRef.current) {
      setIsClosing(true);
      // Respaldo por si onAnimationEnd nunca dispara (tests con jsdom, animaciones
      // deshabilitadas por el usuario/navegador, overrides de CSS futuros, etc.):
      // sin esto el modal puede quedar "pegado" tapando la app.
      closeTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, CLOSE_FALLBACK_MS);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => () => clearTimeout(closeTimerRef.current), []);

  if (!shouldRender) return null;

  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (isClosing && event.currentTarget === event.target) {
      clearTimeout(closeTimerRef.current);
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
