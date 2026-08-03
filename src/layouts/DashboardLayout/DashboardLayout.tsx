import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../shared/assets/valora-logo.png";
import { useAuth } from "../../shared/auth/useAuth";
import { NotificationPanel, NOTIFICATIONS } from "../../shared/components/NotificationPanel/NotificationPanel";
import styles from "./DashboardLayout.module.css";

export function DashboardLayout() {
  const [openPanel, setOpenPanel] = useState<"notif" | "user" | null>(null);
  const hasUnread = NOTIFICATIONS.some((note) => note.unread);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userEmail = user?.email;
  // DashboardLayout solo se renderiza dentro de ProtectedRoute (hay sesión activa
  // siempre), pero user.email puede faltar si el storage quedó con datos parciales
  // — no por eso hay que esconder el logout, si no queda sin forma de salir.
  const avatarInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";
  const displayEmail = userEmail ?? "Mi cuenta";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

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
              <span className={`msym ${styles.icon}`} aria-hidden="true">notifications</span>
              {hasUnread && <span className={styles.unreadDot} />}
            </button>

            {openPanel === "notif" && (
              <NotificationPanel notifications={NOTIFICATIONS} onClose={() => setOpenPanel(null)} />
            )}
          </div>

          <div className={styles.divider} />
          <div className={styles.menuAnchor}>
            <button
              type="button"
              className={styles.userTrigger}
              onClick={() => setOpenPanel((current) => (current === "user" ? null : "user"))}
            >
              <span className={styles.avatar}>{avatarInitial}</span>
              <span className={styles.email}>{displayEmail}</span>
            </button>

            {openPanel === "user" && (
              <div className={`${styles.userPanelBox} ${styles.userPanel}`}>
                <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
