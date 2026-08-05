import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import logo from "../../shared/assets/valora-logo.png";
import { useAuth } from "../../shared/auth/useAuth";
import { BottomNav, type NavEntry } from "../../shared/components/BottomNav/BottomNav";
import { LegalModal, type LegalVariant } from "../../shared/components/LegalModal/LegalModal";
import { NotificationPanel } from "../../shared/components/NotificationPanel/NotificationPanel";
import { NOTIFICATIONS } from "../../shared/components/NotificationPanel/mockNotifications";
import { Sidebar } from "../../shared/components/Sidebar/Sidebar";
import { SUPPORT_EMAIL } from "../../shared/constants";
import styles from "./DashboardLayout.module.css";

const NAV_ITEMS: NavEntry[] = [
  { id: "home", label: "Inicio", icon: "account_balance_wallet", path: "/" },
  { id: "cards", label: "Tarjetas", icon: "credit_card", path: "/tarjetas" },
  { id: "swap", label: "Intercambio", icon: "swap_horiz", path: "/intercambio" },
  { id: "activity", label: "Actividad", icon: "receipt_long", path: "/actividad" },
];

export function DashboardLayout() {
  const [openPanel, setOpenPanel] = useState<"notif" | "hamburger" | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalVariant, setLegalVariant] = useState<LegalVariant>("terms");
  const notifAnchorRef = useRef<HTMLDivElement>(null);
  const hamburgerAnchorRef = useRef<HTMLDivElement>(null);
  const hasUnread = NOTIFICATIONS.some((note) => note.unread);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleHamburgerUsuario() {
    setOpenPanel(null);
    navigate("/usuario");
  }

  function openHamburgerLegal(variant: LegalVariant) {
    setOpenPanel(null);
    setLegalVariant(variant);
    setLegalOpen(true);
  }

  // Cerrar el panel abierto al hacer click/tap afuera o presionar Escape. Se usa
  // pointerdown (no mousedown) para cubrir mouse, touch y pen por igual — este
  // proyecto es mobile-first, mousedown no está garantizado en pantallas táctiles.
  // Solo hay un panel abierto a la vez (openPanel), así que un único listener
  // alcanza para los dos anchors (notificaciones / hamburguesa).
  useEffect(() => {
    if (!openPanel) return;

    function handlePointerDown(event: PointerEvent) {
      const anchor = openPanel === "notif" ? notifAnchorRef.current : hamburgerAnchorRef.current;
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

          <div className={`${styles.menuAnchor} ${styles.hamburgerAnchor}`} ref={hamburgerAnchorRef}>
            <button
              type="button"
              className={styles.ghostIconButton}
              onClick={() => setOpenPanel((current) => (current === "hamburger" ? null : "hamburger"))}
              aria-label="Menú"
            >
              <span className={`msym ${styles.icon}`} aria-hidden="true">menu</span>
            </button>

            {openPanel === "hamburger" && (
              <div className={`${styles.dropdownBox} ${styles.hamburgerPanel}`}>
                <button type="button" className={styles.hamburgerItem} onClick={handleHamburgerUsuario}>
                  Usuario
                </button>

                <div className={styles.hamburgerDivider} />

                <button type="button" className={styles.hamburgerItem} onClick={() => openHamburgerLegal("terms")}>
                  Términos y condiciones
                </button>
                <button
                  type="button"
                  className={styles.hamburgerItem}
                  onClick={() => openHamburgerLegal("privacy")}
                >
                  Políticas de privacidad
                </button>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className={styles.hamburgerItem}
                  onClick={() => setOpenPanel(null)}
                >
                  Contacta a Soporte
                </a>

                <div className={styles.hamburgerDivider} />

                <button type="button" className={styles.hamburgerItem} onClick={handleLogout}>
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
      <Sidebar items={NAV_ITEMS} onLogout={handleLogout} />
      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} variant={legalVariant} />
    </div>
  );
}
