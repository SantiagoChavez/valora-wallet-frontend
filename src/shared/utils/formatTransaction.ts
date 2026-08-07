import type { CurrencyCode, Transaction } from "../types/models";

export type TransactionTone = "pos" | "neg" | "gold";

export interface TransactionDisplay {
  title: string;
  date: string;
  amount: string;
  currency: CurrencyCode;
  glyph: string;
  tone: TransactionTone;
}

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = { USD: "US$", EUR: "€", ARS: "$" };

function formatAmount(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOL[currency];
  return `${symbol}${amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

// Mapea la forma "cruda" que devuelve el backend (con source/target nulleables
// según el tipo de movimiento) a lo que necesita la fila de UI. Un solo lugar
// para esto — lo consumen Dashboard e Historial, para no duplicar el mapeo.
export function formatTransaction(tx: Transaction): TransactionDisplay {
  const date = formatDate(tx.createdAt);

  switch (tx.transactionType) {
    case "DEPOSIT": {
      const currency = tx.targetCurrency ?? "USD";
      return {
        title: "Depósito recibido",
        date,
        amount: `+${formatAmount(tx.targetAmount ?? 0, currency)}`,
        currency,
        glyph: "arrow_downward",
        tone: "pos",
      };
    }
    case "EXCHANGE": {
      const currency = tx.targetCurrency ?? tx.sourceCurrency ?? "USD";
      return {
        title: `Intercambio ${tx.sourceCurrency ?? "?"} → ${tx.targetCurrency ?? "?"}`,
        date,
        amount: formatAmount(tx.targetAmount ?? 0, currency),
        currency,
        glyph: "sync_alt",
        tone: "gold",
      };
    }
    case "BUY": {
      const currency = tx.sourceCurrency ?? "USD";
      return {
        title: `Compra de ${tx.targetCurrency ?? ""}`,
        date,
        amount: `-${formatAmount(tx.sourceAmount ?? 0, currency)}`,
        currency,
        glyph: "arrow_upward",
        tone: "neg",
      };
    }
    case "SELL": {
      const currency = tx.targetCurrency ?? "USD";
      return {
        title: `Venta de ${tx.sourceCurrency ?? ""}`,
        date,
        amount: `+${formatAmount(tx.targetAmount ?? 0, currency)}`,
        currency,
        glyph: "arrow_downward",
        tone: "pos",
      };
    }
  }
}
