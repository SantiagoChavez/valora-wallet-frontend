import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SUPPORT_EMAIL } from "../../constants";
import type { NavEntry } from "../BottomNav/BottomNav";
import { LegalModal, type LegalVariant } from "../LegalModal/LegalModal";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  items: NavEntry[];
  onLogout: () => void;
}

export function Sidebar({ items, onLogout }: SidebarProps) {
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalVariant, setLegalVariant] = useState<LegalVariant>("terms");

  function openLegal(variant: LegalVariant) {
    setLegalVariant(variant);
    setLegalOpen(true);
  }

  return (
    <>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <NavLink
            to="/usuario"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
          >
            <span className={`msym ${styles.navIcon}`} aria-hidden="true">person</span>
            <span className={styles.navLabel}>Usuario</span>
          </NavLink>

          <div className={styles.navDivider} />

          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            >
              <span className={`msym ${styles.navIcon}`} aria-hidden="true">{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}

          <button type="button" className={styles.navItem} onClick={onLogout}>
            <span className={`msym ${styles.navIcon}`} aria-hidden="true">logout</span>
            <span className={styles.navLabel}>Cerrar sesión</span>
          </button>
        </nav>

        <div className={styles.footer}>
          <a href={`mailto:${SUPPORT_EMAIL}`} className={styles.footerLink}>
            Contacta a Soporte
          </a>
          <button type="button" className={styles.footerLink} onClick={() => openLegal("terms")}>
            Términos y condiciones
          </button>
          <button type="button" className={styles.footerLink} onClick={() => openLegal("privacy")}>
            Políticas de privacidad
          </button>
        </div>
      </aside>

      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} variant={legalVariant} />
    </>
  );
}
