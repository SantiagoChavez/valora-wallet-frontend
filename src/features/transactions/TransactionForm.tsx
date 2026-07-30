import { Button } from "../../shared/components/Button/Button";
import { Input } from "../../shared/components/Input/Input";
import styles from "./TransactionForm.module.css";

export function TransactionForm() {
  return (
    <form className={styles.form}>
      <Input label="Monto" type="number" placeholder="0.00" />
      <Button type="submit">Confirmar</Button>
    </form>
  );
}
