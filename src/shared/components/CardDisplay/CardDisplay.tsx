import { useMemo, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import type { Card } from "../../types/models";
import styles from "./CardDisplay.module.css";

const EXPIRY_MIN_YEARS = 2;
const EXPIRY_MAX_YEARS = 4;

export const CARD_NUMBER_COPIED_MESSAGE = "Copiaste el número de tarjeta.";

interface CardDisplayProps {
  card?: Card;
  brand?: string;
  showManageActions?: boolean;
  onCopy?: () => void;
  onFreezeToggle?: (card: Card) => void;
  onDelete?: (card: Card) => void;
  onReveal?: (card: Card) => Promise<string | undefined>;
}

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
    (EXPIRY_MIN_YEARS + random() * (EXPIRY_MAX_YEARS - EXPIRY_MIN_YEARS)) * 12
  );
  const now = new Date();
  const expiry = new Date(now.getFullYear(), now.getMonth() + monthsAhead, 1);
  const mm = String(expiry.getMonth() + 1).padStart(2, "0");
  const yy = String(expiry.getFullYear() % 100).padStart(2, "0");
  return `${mm}/${yy}`;
}

function generateCvv(random: () => number): string {
  let cvv = "";
  for (let i = 0; i < 3; i++) {
    cvv += Math.floor(random() * 10);
  }
  return cvv;
}

function formatCardDigits(digits: string): string {
  const clean = digits.replace(/\s+/g, "");
  return clean.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function maskCardDigits(digits: string): string {
  const clean = digits.replace(/\s+/g, "");
  if (clean.length === 16) {
    return `•••• •••• •••• ${clean.slice(12, 16)}`;
  }
  return digits;
}

export function CardDisplay({
  card,
  brand: customBrand,
  showManageActions = false,
  onCopy,
  onFreezeToggle,
  onDelete,
  onReveal,
}: CardDisplayProps) {
  const { user } = useAuth();
  const defaultHolderName = user
    ? `${user.firstName} ${user.lastName}`.toUpperCase()
    : "USUARIO VALORA";

  // Fallback determinístico para cuando no se pase una tarjeta de base de datos
  const mockValues = useMemo(() => {
    const random = seededRandom(user?.id ?? "guest");
    return {
      cardDigits: generateCardDigits(random),
      expiry: generateExpiry(random),
      cvv: generateCvv(random),
    };
  }, [user?.id]);

  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedDigits, setRevealedDigits] = useState<string | null>(null);

  const { isCopied, copy, reset: resetCopied } = useCopyToClipboard(onCopy);

  const activeBrand = card?.brand || customBrand || "VALORA PLATINUM";
  const activeHolderName = card?.holderName || defaultHolderName;
  const isFrozen = card?.isFrozen ?? false;
  const activeLabel = card?.label;

  const rawDigits = revealedDigits || card?.cardNumber || mockValues.cardDigits;
  const activeExpiry = card?.expiry || mockValues.expiry;
  const activeCvv = card && card.cvv !== "•••" ? card.cvv : mockValues.cvv;

  async function handleToggleReveal() {
    if (!isRevealed) {
      if (card && onReveal) {
        const fullNumber = await onReveal(card);
        if (fullNumber) {
          setRevealedDigits(fullNumber);
        }
      }
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }
    resetCopied();
  }

  // Selección de clase de tema visual
  const themeClass =
    activeBrand === "VALORA BLACK"
      ? styles.brandBlack
      : activeBrand === "VALORA GOLD"
      ? styles.brandGold
      : styles.brandPlatinum;

  return (
    <div
      className={`${styles.cardView} ${themeClass} ${isFrozen ? styles.frozenCard : ""}`}
    >
      <div className={styles.cardGlow} />

      {isFrozen && (
        <div className={styles.frozenBadge}>
          <span className="msym" style={{ fontSize: 14 }} aria-hidden="true">
            lock
          </span>
          CONGELADA
        </div>
      )}

      <div className={styles.cardTop}>
        <div className={styles.cardTopLeft}>
          <span
            className="msym"
            style={{ fontSize: 22, color: "var(--accent)" }}
            aria-hidden="true"
          >
            contactless
          </span>
          {activeLabel && <span className={styles.cardLabelBadge}>{activeLabel}</span>}
        </div>
        <span className={styles.cardBrand}>{activeBrand}</span>
      </div>

      <div className={styles.cardBottom}>
        <div className={styles.cardNumberRow}>
          <div className={styles.cardNumber}>
            {isRevealed
              ? formatCardDigits(rawDigits)
              : maskCardDigits(card?.maskedNumber || rawDigits)}
          </div>
          <div className={styles.cardActions}>
            {isRevealed && !isFrozen && (
              <button
                type="button"
                className={styles.cardIconButton}
                onClick={() => copy(rawDigits.replace(/\s+/g, ""))}
                aria-label={isCopied ? "Número copiado" : "Copiar número de tarjeta"}
              >
                <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
                  {isCopied ? "check" : "content_copy"}
                </span>
                <span className={styles.copyTooltip} aria-hidden="true">
                  Copiar número
                </span>
              </button>
            )}

            {!isFrozen && (
              <button
                type="button"
                className={styles.cardIconButton}
                onClick={handleToggleReveal}
                aria-label={
                  isRevealed ? "Ocultar datos de la tarjeta" : "Mostrar datos de la tarjeta"
                }
              >
                <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
                  {isRevealed ? "visibility_off" : "visibility"}
                </span>
              </button>
            )}

            {showManageActions && card && onFreezeToggle && (
              <button
                type="button"
                className={styles.cardIconButton}
                onClick={() => onFreezeToggle(card)}
                aria-label={isFrozen ? "Descongelar tarjeta" : "Congelar tarjeta"}
                title={isFrozen ? "Descongelar tarjeta" : "Congelar tarjeta"}
              >
                <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
                  {isFrozen ? "lock_open" : "lock"}
                </span>
              </button>
            )}

            {showManageActions && card && onDelete && (
              <button
                type="button"
                className={`${styles.cardIconButton} ${styles.cardIconButtonDanger}`}
                onClick={() => onDelete(card)}
                aria-label="Dar de baja tarjeta"
                title="Dar de baja tarjeta"
              >
                <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
                  delete
                </span>
              </button>
            )}
          </div>
        </div>

        <div className={styles.cardMeta}>
          <span>{isRevealed && !isFrozen ? activeExpiry : "••/••"}</span>
          <span>{isRevealed && !isFrozen ? activeCvv : "•••"}</span>
        </div>

        <div className={styles.cardHolderRow}>
          <span className={styles.cardHolder}>{activeHolderName}</span>
          <div className={styles.cardNetwork}>
            <div className={styles.networkDotRed} />
            <div className={styles.networkDotGold} />
          </div>
        </div>
      </div>
    </div>
  );
}
