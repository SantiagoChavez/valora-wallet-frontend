import styles from "./TransactionHistory.module.css";

interface Transaction {
  id: string;
  description: string;
  amount: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <ul className={styles.list}>
      {transactions.map((transaction) => (
        <li key={transaction.id} className={styles.item}>
          <span>{transaction.description}</span>
          <span>{transaction.amount}</span>
        </li>
      ))}
    </ul>
  );
}
