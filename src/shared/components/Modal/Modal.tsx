import { useEffect, useRef, useState, type AnimationEvent, type PropsWithChildren } from "react";
import styles from "./Modal.module.css";

const CLOSE_FALLBACK_BUFFER_MS = 50;

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
}

function getAnimationDurationMs(element: HTMLElement | null): number {
  if (!element) return 150;
  const raw = getComputedStyle(element).animationDuration.split(",")[0]?.trim() ?? "0s";
  const value = parseFloat(raw);
  return raw.endsWith("ms") ? value : value * 1000;
}

export function Modal({ isOpen, onClose, ariaLabel, children }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const wasOpenRef = useRef(isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);
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
      // sin esto el modal puede quedar "pegado" tapando la app. La duración se lee
      // del CSS real en vez de duplicarla acá, para que no se puedan desincronizar.
      const fallbackMs = getAnimationDurationMs(overlayRef.current) + CLOSE_FALLBACK_BUFFER_MS;
      closeTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, fallbackMs);
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

  function handleOverlayClick() {
    // Ignorar clicks mientras cierra: el overlay sigue montado durante la
    // animación de salida, y un doble click ahí no debe repetir el onClose del caller.
    if (!isClosing) onClose();
  }

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={`${styles.content} ${isClosing ? styles.contentClosing : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}
