import { useState } from "react";
import { Button } from "../../shared/components/Button/Button";
import { Input } from "../../shared/components/Input/Input";
import styles from "./ChatbotWidget.module.css";

export function ChatbotWidget() {
  const [message, setMessage] = useState("");

  return (
    <div className={styles.widget}>
      <div className={styles.messages} />
      <div className={styles.inputRow}>
        <Input
          placeholder="Preguntale al asistente..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button type="button">Enviar</Button>
      </div>
    </div>
  );
}
