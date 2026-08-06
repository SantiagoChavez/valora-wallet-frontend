import styles from "./CardDisplay.module.css";

interface CardDisplayProps {
  brand?: string;
  cardNumber?: string;
  holderName?: string;
}

export function CardDisplay({
  brand = "VALORA PLATINUM",
  cardNumber = "•••• •••• •••• 8829",
  holderName = "USUARIO VALORA",
}: CardDisplayProps) {
  return (
    <div className={styles.cardView}>
      <div className={styles.cardGlow} />
      <div className={styles.cardTop}>
        <span className="msym" style={{ fontSize: 22, color: "var(--accent)" }} aria-hidden="true">contactless</span>
        <span className={styles.cardBrand}>{brand}</span>
      </div>
      <div className={styles.cardBottom}>
        <div className={styles.cardNumber}>{cardNumber}</div>
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
