import { Modal } from "../Modal/Modal";
import { formatTransaction } from "../../utils/formatTransaction";
import type { Transaction, TransactionType } from "../../types/models";
import styles from "./TransactionDetailModal.module.css";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  // No se pone en null al cerrar (ver Dashboard.tsx/HistoryPage.tsx) — así el
  // contenido sigue visible mientras el Modal anima la salida, en vez de
  // vaciarse de golpe antes de que termine la animación.
  transaction: Transaction | null;
}

const TYPE_LABEL: Record<TransactionType, string> = {
  DEPOSIT: "Depósito",
  EXCHANGE: "Conversión",
  BUY: "Compra",
  SELL: "Venta",
  TRANSFER_OUT: "Transferencia",
  TRANSFER_IN: "Transferencia",
};

function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", { hour: "numeric", minute: "2-digit" });
}

// Fecha corta + hora en una sola línea (ej. "12/08/2026 · 21:04") — distinto
// del par Fecha/Hora del detalle genérico, para la vista de transferencia.
function formatShortDateTime(iso: string): string {
  const date = new Date(iso);
  const datePart = date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timePart = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${datePart} · ${timePart}`;
}

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  mono?: boolean;
}

function DetailRow({ icon, label, value, mono }: DetailRowProps) {
  return (
    <div className={styles.transferRow}>
      <span className={`msym ${styles.transferRowIcon}`} aria-hidden="true">{icon}</span>
      <span className={styles.transferRowLabel}>{label}</span>
      <span className={`${styles.transferRowValue} ${mono ? styles.transferRowValueMono : ""}`}>{value}</span>
    </div>
  );
}

export function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  // El Modal en sí sigue montado durante la animación de cierre (ver
  // Modal.tsx) — esto solo cubre el primer render, antes de seleccionar
  // ninguna transacción.
  if (!transaction) return null;

  const display = formatTransaction(transaction);
  const isTransfer = transaction.transactionType === "TRANSFER_OUT" || transaction.transactionType === "TRANSFER_IN";

  if (isTransfer) {
    const counterparty = [transaction.counterpartyName, transaction.counterpartyLastName].filter(Boolean).join(" ");
    const counterpartyLabel = transaction.transactionType === "TRANSFER_OUT" ? "Destinatario" : "Remitente";
    const amountLabel = transaction.transactionType === "TRANSFER_OUT" ? "Monto enviado" : "Monto recibido";

    return (
      <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Detalle de transferencia">
        <div className={styles.wrapper}>
          <button type="button" className={styles.closeButtonFloating} onClick={onClose} aria-label="Cerrar">
            <span className="msym" aria-hidden="true">close</span>
          </button>

          <div className={styles.transferAmountBlock}>
            <span className={styles.eyebrowCentered}>{amountLabel.toUpperCase()}</span>
            <span className={styles.amount}>{display.amount} {display.currency}</span>
          </div>

          <div className={styles.transferList}>
            {counterparty && <DetailRow icon="person" label={counterpartyLabel} value={counterparty} />}
            {transaction.counterpartyAlias && (
              <DetailRow icon="bolt" label="Alias" value={transaction.counterpartyAlias} />
            )}
            <DetailRow icon="schedule" label="Fecha" value={formatShortDateTime(transaction.createdAt)} />
            {transaction.concepto && <DetailRow icon="description" label="Concepto" value={transaction.concepto} />}
            <DetailRow icon="sell" label="ID de operación" value={transaction.id} mono />
          </div>
        </div>
      </Modal>
    );
  }

  const typeLabel = TYPE_LABEL[transaction.transactionType] ?? "Movimiento";

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Detalle de transacción">
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Detalle de transacción</h2>
            <span className={styles.eyebrow}>{typeLabel.toUpperCase()}</span>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            <span className="msym" aria-hidden="true">close</span>
          </button>
        </div>

        <div className={styles.amountRow}>
          <span className={styles.amount}>
            {display.amount.replace(/^[+-]/, "")} {display.currency}
          </span>
          {/* No hay transacciones "pendientes" ni "fallidas" en el modelo real
              — si el backend respondió 200, ya está commiteada. Fijo, no
              depende de ningún dato (mismo criterio que el estado de cuenta
              en Usuario.tsx). */}
          <span className={styles.statusPill}>Completada</span>
        </div>

        <dl className={styles.detailList}>
          <div className={styles.detailRow}>
            <dt className={styles.detailLabel}>Fecha</dt>
            <dd className={styles.detailValue}>{formatLongDate(transaction.createdAt)}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt className={styles.detailLabel}>Hora</dt>
            <dd className={styles.detailValue}>{formatTime(transaction.createdAt)}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt className={styles.detailLabel}>Descripción</dt>
            <dd className={styles.detailValue}>{display.title}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt className={styles.detailLabel}>Moneda</dt>
            <dd className={styles.detailValue}>{display.currency}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt className={styles.detailLabel}>ID</dt>
            <dd className={`${styles.detailValue} ${styles.detailValueMono}`}>{transaction.id}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
}
