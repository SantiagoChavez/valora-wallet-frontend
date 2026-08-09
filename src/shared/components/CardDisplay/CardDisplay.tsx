import { useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import styles from "./CardDisplay.module.css";

const EXPIRY_MIN_YEARS = 2;
const EXPIRY_MAX_YEARS = 4;
const COPY_CONFIRMATION_MS = 1500;

interface CardDisplayProps {
  brand?: string;
}

// PRNG determinístico sembrado por string (mulberry32) — no criptográfico, no
// hace falta: esto es puramente decorativo (ver Estado actual en CLAUDE.md,
// "vista de tarjeta física... vino con el mock del diseño Geist"), nunca es
// dinero ni datos reales de una tarjeta.
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 4294967296;
  };
}

function generateCardDigits(random: () => number): string {
  let digits = "";
  for (let i = 0; i < 16; i++) {
    digits += Math.floor(random() * 10);
  }
  return digits;
}

function generateExpiry(random: () => number): string {
  const monthsAhead = Math.floor(
    (EXPIRY_MIN_YEARS + random() * (EXPIRY_MAX_YEARS - EXPIRY_MIN_YEARS)) * 12,
  );
  const now = new Date();
  const expiry = new Date(now.getFullYear(), now.getMonth() + monthsAhead, 1);
  const mm = String(expiry.getMonth() + 1).padStart(2, "0");
  const yy = String(expiry.getFullYear() % 100).padStart(2, "0");
  return `${mm}/${yy}`;
}

function generateCvv(random: () => number): string {
  let digits = "";
  for (let i = 0; i < 3; i++) {
    digits += Math.floor(random() * 10);
  }
  return digits;
}

function formatCardDigits(digits: string): string {
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

function maskCardDigits(digits: string): string {
  return `•••• •••• •••• ${digits.slice(12, 16)}`;
}

export function CardDisplay({ brand = "VALORA PLATINUM" }: CardDisplayProps) {
  const { user } = useAuth();
  const holderName = user ? `${user.firstName} ${user.lastName}`.toUpperCase() : "USUARIO VALORA";

  // Sembrado por el id del usuario: mismo número/vencimiento/CVV mientras dure
  // la sesión (no cambia en cada render ni al abrir/cerrar el ojito), sin
  // persistir nada — no hace falta que sobreviva a un refresh (ver consigna).
  const random = useMemo(() => seededRandom(user?.id ?? "guest"), [user?.id]);
  const cardDigits = useMemo(() => generateCardDigits(random), [random]);
  const expiry = useMemo(() => generateExpiry(random), [random]);
  const cvv = useMemo(() => generateCvv(random), [random]);

  const [isRevealed, setIsRevealed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(cardDigits);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_CONFIRMATION_MS);
    } catch {
      // Portapapeles bloqueado (permisos, contexto no seguro) — no rompe nada,
      // simplemente no hay confirmación visual de que se copió.
    }
  }

  return (
    <div className={styles.cardView}>
      <div className={styles.cardGlow} />
      <div className={styles.cardTop}>
        <span className="msym" style={{ fontSize: 22, color: "var(--accent)" }} aria-hidden="true">contactless</span>
        <span className={styles.cardBrand}>{brand}</span>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.cardNumberRow}>
          <div className={styles.cardNumber}>
            {isRevealed ? formatCardDigits(cardDigits) : maskCardDigits(cardDigits)}
          </div>
          <div className={styles.cardActions}>
            {isRevealed && (
              <button
                type="button"
                className={styles.cardIconButton}
                onClick={handleCopy}
                aria-label={isCopied ? "Número copiado" : "Copiar número de tarjeta"}
              >
                <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
                  {isCopied ? "check" : "content_copy"}
                </span>
              </button>
            )}
            <button
              type="button"
              className={styles.cardIconButton}
              onClick={() => setIsRevealed((v) => !v)}
              aria-label={isRevealed ? "Ocultar datos de la tarjeta" : "Mostrar datos de la tarjeta"}
            >
              <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
                {isRevealed ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>
        <div className={styles.cardMeta}>
          <span>{isRevealed ? expiry : "••/••"}</span>
          <span>{isRevealed ? cvv : "•••"}</span>
        </div>
        <div className={styles.cardHolderRow}>
          <span className={styles.cardHolder}>{holderName}</span>
          <div className={styles.cardNetwork}>
            <div className={styles.networkDotRed} />
            <div className={styles.networkDotGold} />
          </div>
        </div>
      </div>
    </div>
  );
}
