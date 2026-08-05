import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../shared/assets/valora-logo.png";
import { useAuth } from "../../shared/auth/useAuth";
import { BottomNav, type NavEntry } from "../../shared/components/BottomNav/BottomNav";
import { NotificationPanel } from "../../shared/components/NotificationPanel/NotificationPanel";
import { NOTIFICATIONS } from "../../shared/components/NotificationPanel/mockNotifications";
import styles from "./DashboardLayout.module.css";

const NAV_ITEMS: NavEntry[] = [
  { id: "home", label: "Inicio", icon: "account_balance_wallet", path: "/" },
  { id: "cards", label: "Tarjetas", icon: "credit_card", path: "/tarjetas" },
  { id: "swap", label: "Intercambio", icon: "swap_horiz", path: "/intercambio" },
  { id: "activity", label: "Actividad", icon: "receipt_long", path: "/actividad" },
];

export function DashboardLayout() {
  const [openPanel, setOpenPanel] = useState<"notif" | "user" | null>(null);
  const notifAnchorRef = useRef<HTMLDivElement>(null);
  const userAnchorRef = useRef<HTMLDivElement>(null);
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

  // Cerrar el panel abierto al hacer click/tap afuera o presionar Escape. Se usa
  // pointerdown (no mousedown) para cubrir mouse, touch y pen por igual — este
  // proyecto es mobile-first, mousedown no está garantizado en pantallas táctiles.
  // Solo hay un panel abierto a la vez (openPanel), así que un único listener
  // alcanza para los dos anchors (notificaciones / usuario).
  useEffect(() => {
    if (!openPanel) return;

    function handlePointerDown(event: PointerEvent) {
      const anchor = openPanel === "notif" ? notifAnchorRef.current : userAnchorRef.current;
      if (anchor && !anchor.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenPanel(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openPanel]);

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
          <div className={styles.menuAnchor} ref={notifAnchorRef}>
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
          <div className={styles.menuAnchor} ref={userAnchorRef}>
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
      <BottomNav items={NAV_ITEMS} />
    </div>
  );
}
