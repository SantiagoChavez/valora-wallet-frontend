import type { Transaction } from "../../types/models";
import { formatTransaction } from "../../utils/formatTransaction";
import styles from "./TransactionRow.module.css";

const toneClass: Record<string, string> = {
  pos: styles.tonePos,
  neg: styles.toneNeg,
  gold: styles.toneGold,
};

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const display = formatTransaction(transaction);

  return (
    <div className={styles.txRow}>
      <div className={styles.txRowLeft}>
        <div className={`${styles.txIconWrap} ${toneClass[display.tone]}`}>
          <span className={`msym ${styles.txIcon}`} aria-hidden="true">{display.glyph}</span>
        </div>
        <div className={styles.txTextGroup}>
          <span className={styles.txTitle}>{display.title}</span>
          <span className={styles.txDate}>{display.date}</span>
        </div>
      </div>
      <div className={styles.txRight}>
        <div className={`${styles.txAmount} ${toneClass[display.tone]}`}>{display.amount}</div>
        <div className={styles.txCurrency}>{display.currency}</div>
      </div>
    </div>
  );
}
