import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import styles from "./NotificationModal.module.css";

type NotificationVariant = "success" | "error" | "info";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: NotificationVariant;
}

export function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
}: NotificationModalProps) {
  const titleClass = variant === "info" ? styles.title : [styles.title, styles[variant]].join(" ");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <span className={titleClass}>{title}</span>
        <p className={styles.message}>{message}</p>
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  );
}
