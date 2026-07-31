import { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../../shared/assets/valora-logo.png";
import styles from "./DashboardLayout.module.css";

interface Notification {
  id: string;
  title: string;
  body: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "1", title: "¡Transacción exitosa!", body: "Has recibido $500 USD en tu cuenta.", unread: true },
  { id: "2", title: "Cambio completado", body: "EUR a USD procesado con éxito.", unread: false },
];

interface DashboardLayoutProps {
  userEmail?: string;
  onLogout?: () => void;
}

export function DashboardLayout({ userEmail, onLogout }: DashboardLayoutProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const hasUnread = NOTIFICATIONS.some((note) => note.unread);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <img src={logo} alt="Valora Wallet" className={styles.logoImg} />
          <div className={styles.brandText}>
            <span className={styles.brandPrimary}>Valora</span>
            <span className={styles.brandSecondary}>Wallet</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.ghostIconButton} aria-label="Configuración">
            <span className={`msym ${styles.icon}`}>settings</span>
          </button>

          <div className={styles.menuAnchor}>
            <button
              type="button"
              className={styles.ghostIconButton}
              onClick={() => setIsNotifOpen((open) => !open)}
              aria-label="Notificaciones"
            >
              <span className={`msym ${styles.icon}`}>notifications</span>
              {hasUnread && <span className={styles.unreadDot} />}
            </button>

            {isNotifOpen && (
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <span>Notificaciones</span>
                  <button
                    type="button"
                    className={styles.panelCloseButton}
                    onClick={() => setIsNotifOpen(false)}
                    aria-label="Cerrar notificaciones"
                  >
                    <span className="msym">close</span>
                  </button>
                </div>
                <div className={styles.notifList}>
                  {NOTIFICATIONS.map((note) => (
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
            )}
          </div>

          {userEmail && (
            <>
              <div className={styles.divider} />
              <div className={styles.menuAnchor}>
                <button
                  type="button"
                  className={styles.userTrigger}
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                >
                  <span className={styles.avatar}>{userEmail.charAt(0).toUpperCase()}</span>
                  <span className={styles.email}>{userEmail}</span>
                </button>

                {isUserMenuOpen && (
                  <div className={`${styles.panel} ${styles.userPanel}`}>
                    <button type="button" className={styles.logoutButton} onClick={onLogout}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
