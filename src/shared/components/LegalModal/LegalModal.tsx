import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { PrivacyContent, TermsContent } from "./legalContent";
import styles from "./LegalModal.module.css";

type LegalVariant = "terms" | "privacy";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: LegalVariant;
}

const TITLES: Record<LegalVariant, string> = {
  terms: "Términos y Condiciones de Uso",
  privacy: "Política de Privacidad",
};

export function LegalModal({ isOpen, onClose, variant }: LegalModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={TITLES[variant]}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>{TITLES[variant]}</h2>
        <div className={styles.body}>{variant === "terms" ? <TermsContent /> : <PrivacyContent />}</div>
        <Button type="button" onClick={onClose} className={styles.closeButton}>
          Cerrar
        </Button>
      </div>
    </Modal>
  );
}
