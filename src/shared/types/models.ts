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
  sourceCurrency: CurrencyCode;
  targetCurrency: CurrencyCode;
  sourceAmount: number;
  targetAmount: number;
  exchangeRate: number;
  resultingBalance: number;
  createdAt: string;
}
