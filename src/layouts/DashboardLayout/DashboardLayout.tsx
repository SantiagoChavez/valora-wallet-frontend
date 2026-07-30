import { useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  userEmail?: string;
  onLogout?: () => void;
}

export function DashboardLayout({ userEmail, onLogout }: DashboardLayoutProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.brand}>Valora Wallet</span>
        {userEmail && (
          <div className={styles.user}>
            <span className={styles.email}>{userEmail}</span>
            <button
              type="button"
              className={styles.avatar}
              onClick={() => setIsDropdownOpen((open) => !open)}
              aria-label="Menú de usuario"
            >
              {userEmail.charAt(0).toUpperCase()}
            </button>
            {isDropdownOpen && (
              <button type="button" onClick={onLogout}>
                Cerrar sesión
              </button>
            )}
          </div>
        )}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
