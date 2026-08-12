import { useEffect, useRef, useState } from "react";
import styles from "./CopyIconButton.module.css";

const COPY_CONFIRMATION_MS = 1500;

interface CopyIconButtonProps {
  value: string;
  /** Texto del tooltip y del aria-label en estado normal (ej. "Copiar alias"). */
  label: string;
}

// Mismo patrón que el botón de copiar de CardDisplay.tsx (ícono + tooltip en
// hover + check temporal al copiar) — extraído acá porque Usuario.tsx lo
// necesita dos veces (alias y CVU) sobre un valor de texto simple, sin la
// lógica de tarjeta (revelado, dígitos generados) que trae CardDisplay.
export function CopyIconButton({ value, label }: CopyIconButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsCopied(false), COPY_CONFIRMATION_MS);
    } catch {
      // Portapapeles bloqueado (permisos, contexto no seguro) — no rompe nada,
      // simplemente no hay confirmación visual de que se copió.
    }
  }

  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={handleCopy}
      aria-label={isCopied ? "Copiado" : label}
    >
      <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
        {isCopied ? "check" : "content_copy"}
      </span>
      <span className={styles.tooltip} aria-hidden="true">{label}</span>
    </button>
  );
}
