import styles from "./BottomNav.module.css";

export interface NavEntry {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface BottomNavProps {
  items: NavEntry[];
  activeId: string;
  onItemClick: (id: string) => void;
}

export function BottomNav({ items, activeId, onItemClick }: BottomNavProps) {
  return (
    <nav className={styles.bottomNav}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            onClick={() => onItemClick(item.id)}
          >
            <span className={`msym ${styles.navIcon}`} aria-hidden="true">{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
