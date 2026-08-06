import logo from "../../assets/valora-logo.png";
import styles from "./AuthMobileHeader.module.css";

export function AuthMobileHeader() {
  return (
    <div className={styles.mobileHeader}>
      <img src={logo} alt="Valora Wallet" className={styles.mobileLogo} />
      <h1 className={styles.mobileWordmark}>
        Valora<span className={styles.wordmarkMuted}> Wallet</span>
      </h1>
    </div>
  );
}
