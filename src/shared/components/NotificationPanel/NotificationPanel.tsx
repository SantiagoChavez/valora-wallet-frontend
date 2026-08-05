import styles from "./NotificationPanel.module.css";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  unread: boolean;
}

interface NotificationPanelProps {
  notifications: AppNotification[];
  onClose: () => void;
  hidden: boolean;
}

export function NotificationPanel({ notifications, onClose, hidden }: NotificationPanelProps) {
  return (
    <div id="notification-panel" className={styles.panel} hidden={hidden}>
      <div className={styles.panelHeader}>
        <span>Notificaciones</span>
        <button
          type="button"
          className={styles.panelCloseButton}
          onClick={onClose}
          aria-label="Cerrar notificaciones"
        >
          <span className="msym" aria-hidden="true">close</span>
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
