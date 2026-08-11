export type CurrencyCode = 'USD' | 'EUR' | 'ARS';
export type TransactionType = 'BUY' | 'SELL' | 'EXCHANGE' | 'DEPOSIT' | 'TRANSFER_OUT' | 'TRANSFER_IN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  phone?: string | null;
  // "du" = Documento Único — nombre real del campo en el backend (varía de
  // formato según country: DNI en AR, etc). Null para altas por Google sin
  // documento cargado.
  country: string;
  du: string | null;
}

export interface Wallet {
  id: string;
  cvu: string;
  alias: string;
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
