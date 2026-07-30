import { Button } from "../../shared/components/Button/Button";
import { Card } from "../../shared/components/Card/Card";
import { Input } from "../../shared/components/Input/Input";
import styles from "./Login.module.css";

export function Login() {
  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <h1 className={styles.title}>Valora Wallet</h1>
        <Input label="Email" type="email" placeholder="tu@email.com" />
        <Input label="Contraseña" type="password" placeholder="••••••••" />
        <Button type="submit">Ingresar</Button>
      </Card>
    </div>
  );
}
