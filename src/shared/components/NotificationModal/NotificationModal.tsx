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

const VARIANT_ICON: Record<NotificationVariant, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

export function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
}: NotificationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <span className={`msym ${styles.icon} ${styles[variant]}`} aria-hidden="true">{VARIANT_ICON[variant]}</span>
        <span className={styles.title}>{title}</span>
        <p className={styles.message}>{message}</p>
        <Button onClick={onClose}>Cerrar</Button>
      </div>
    </Modal>
  );
}
