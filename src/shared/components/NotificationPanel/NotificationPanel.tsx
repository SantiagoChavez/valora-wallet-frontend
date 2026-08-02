import styles from "./NotificationPanel.module.css";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  unread: boolean;
}

export const NOTIFICATIONS: AppNotification[] = [
  { id: "1", title: "¡Transacción exitosa!", body: "Has recibido $500 USD en tu cuenta.", unread: true },
  { id: "2", title: "Cambio completado", body: "EUR a USD procesado con éxito.", unread: false },
];

interface NotificationPanelProps {
  notifications: AppNotification[];
  onClose: () => void;
}

export function NotificationPanel({ notifications, onClose }: NotificationPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>Notificaciones</span>
        <button
          type="button"
          className={styles.panelCloseButton}
          onClick={onClose}
          aria-label="Cerrar notificaciones"
        >
          <span className="msym">close</span>
        </button>
      </div>
      <div className={styles.notifList}>
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`${styles.notifRow} ${note.unread ? styles.notifRowUnread : ""}`}
          >
            <span className={`${styles.notifDot} ${note.unread ? styles.notifDotUnread : ""}`} />
            <div className={styles.notifTextGroup}>
              <span className={styles.notifTitle}>{note.title}</span>
              <span className={styles.notifBody}>{note.body}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
