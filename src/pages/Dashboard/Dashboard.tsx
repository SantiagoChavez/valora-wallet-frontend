import { Card } from "../../shared/components/Card/Card";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  return (
    <div>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.grid}>
        <Card>Resumen de saldos</Card>
        <Card>Últimas transacciones</Card>
        <Card>Asistente</Card>
      </div>
    </div>
  );
}
