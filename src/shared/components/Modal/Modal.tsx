import { useEffect, useRef, useState, type AnimationEvent, type PropsWithChildren } from "react";
import styles from "./Modal.module.css";

const CLOSE_FALLBACK_BUFFER_MS = 50;

// Aproximación manual de --modal-anim-duration (Modal.module.css) para cuando no
// hay DOM del cual leer el valor real: sin elemento (dado el único call-site hoy,
// no debería pasar mientras Modal no use portal — prop isOpen controlada, sin
// createPortal; si eso cambia, revisar) o animationDuration vacío (jsdom sin CSS
// inyectado). Si --modal-anim-duration cambia, actualizar también acá — no hay
// forma de derivarlo en runtime sin un elemento conectado.
const FALLBACK_DURATION_MS = 150;

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
}

function getAnimationDurationMs(element: HTMLElement | null): number {
  if (!element) return FALLBACK_DURATION_MS;
  const raw = getComputedStyle(element).animationDuration.split(",")[0]?.trim() ?? "0s";
  const value = parseFloat(raw);
  const ms = raw.endsWith("ms") ? value : value * 1000;
  return Number.isNaN(ms) ? FALLBACK_DURATION_MS : ms;
}

export function Modal({ isOpen, onClose, ariaLabel, children }: ModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const wasOpenRef = useRef(isOpen);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingCloseAnimationsRef = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    if (isOpen) {
      clearTimeout(closeTimerRef.current);
      setShouldRender(true);
      setIsClosing(false);
    } else if (wasOpenRef.current) {
      setIsClosing(true);
      pendingCloseAnimationsRef.current = new Set(
        [overlayRef.current, contentRef.current].filter((el): el is HTMLDivElement => el !== null)
      );
      // Respaldo por si onAnimationEnd nunca dispara (tests con jsdom, animaciones
      // deshabilitadas por el usuario/navegador, overrides de CSS futuros, etc.):
      // sin esto el modal puede quedar "pegado" tapando la app. Se espera a la más
      // lenta entre overlay y content, leídas del CSS real en vez de duplicarlas acá.
      const fallbackMs =
        Math.max(getAnimationDurationMs(overlayRef.current), getAnimationDurationMs(contentRef.current)) +
        CLOSE_FALLBACK_BUFFER_MS;
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
    if (!isClosing) return;
    pendingCloseAnimationsRef.current.delete(event.target as HTMLElement);
    if (pendingCloseAnimationsRef.current.size === 0) {
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
        ref={contentRef}
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
