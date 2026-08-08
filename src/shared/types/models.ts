export type CurrencyCode = 'USD' | 'EUR' | 'ARS';
export type TransactionType = 'BUY' | 'SELL' | 'EXCHANGE' | 'DEPOSIT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  phone?: string | null;
  documentNumber?: string | null;
}

export interface Wallet {
  id: string;
  userId: string;
}

export interface Balance {
  id: string;
  walletId: string;
  currencyCode: CurrencyCode;
  amount: number;
}

export interface Transaction {
  id: string;
  walletId: string;
  transactionType: TransactionType;
  // El backend manda null en el lado que no aplica (ej. sourceCurrency/sourceAmount
  // en un DEPOSIT) — reflejado acá tal cual, no como el `CurrencyCode`/`number`
  // no-nulos que tenía antes este tipo.
  sourceCurrency: CurrencyCode | null;
  targetCurrency: CurrencyCode | null;
  sourceAmount: number | null;
  targetAmount: number | null;
  exchangeRate: number | null;
  resultingBalance: number;
  createdAt: string;
}
