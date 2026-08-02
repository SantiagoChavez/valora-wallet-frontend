import { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../../shared/assets/valora-logo.png";
import { NotificationPanel, NOTIFICATIONS } from "../../shared/components/NotificationPanel/NotificationPanel";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  userEmail?: string;
  onLogout?: () => void;
}

export function DashboardLayout({ userEmail, onLogout }: DashboardLayoutProps) {
  const [openPanel, setOpenPanel] = useState<"notif" | "user" | null>(null);
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
          <div className={styles.menuAnchor}>
            <button
              type="button"
              className={styles.ghostIconButton}
              onClick={() => setOpenPanel((current) => (current === "notif" ? null : "notif"))}
              aria-label="Notificaciones"
            >
              <span className={`msym ${styles.icon}`}>notifications</span>
              {hasUnread && <span className={styles.unreadDot} />}
            </button>

            {openPanel === "notif" && (
              <NotificationPanel notifications={NOTIFICATIONS} onClose={() => setOpenPanel(null)} />
            )}
          </div>

          {userEmail && (
            <>
              <div className={styles.divider} />
              <div className={styles.menuAnchor}>
                <button
                  type="button"
                  className={styles.userTrigger}
                  onClick={() => setOpenPanel((current) => (current === "user" ? null : "user"))}
                >
                  <span className={styles.avatar}>{userEmail.charAt(0).toUpperCase()}</span>
                  <span className={styles.email}>{userEmail}</span>
                </button>

                {openPanel === "user" && (
                  <div className={`${styles.userPanelBox} ${styles.userPanel}`}>
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
