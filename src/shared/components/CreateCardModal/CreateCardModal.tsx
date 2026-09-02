import { useState, type SubmitEvent } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { CardDisplay } from "../CardDisplay/CardDisplay";
import { createCard } from "../../services/cardService";
import { getApiErrorMessage } from "../../services/apiClient";
import type { Card, CardBrand, CardType } from "../../types/models";
import styles from "./CreateCardModal.module.css";

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  onSuccess: (card: Card) => void;
  currentCardCount: number;
}

const BRANDS: { id: CardBrand; name: string; icon: string }[] = [
  { id: "VALORA PLATINUM", name: "Platinum", icon: "credit_card" },
  { id: "VALORA BLACK", name: "Black", icon: "stars" },
  { id: "VALORA GOLD", name: "Gold", icon: "workspace_premium" },
];

export function CreateCardModal({
  isOpen,
  onClose,
  token,
  onSuccess,
  currentCardCount,
}: CreateCardModalProps) {
  const [label, setLabel] = useState("");
  const [brand, setBrand] = useState<CardBrand>("VALORA PLATINUM");
  const [cardType, setCardType] = useState<CardType>("VIRTUAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const finalLabel = label.trim() || `Tarjeta ${brand.split(" ")[1] || "Principal"}`;
      const newCard = await createCard(
        {
          label: finalLabel,
          brand,
          cardType,
        },
        token
      );

      onSuccess(newCard);
      onClose();
      setLabel("");
      setBrand("VALORA PLATINUM");
      setCardType("VIRTUAL");
    } catch (err: unknown) {
      setErrorMessage(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Previsualización mock
  const previewCard: Card = {
    id: "preview",
    walletId: "preview",
    cardNumber: "5412750012345678",
    maskedNumber: "•••• •••• •••• 5678",
    holderName: "VISTA PREVIA",
    expiry: "12/29",
    cvv: "•••",
    brand,
    cardType,
    label: label.trim() || "Nueva Tarjeta",
    isFrozen: false,
    createdAt: new Date().toISOString(),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Emitir nueva tarjeta Valora">
      <form className={styles.modalBody} onSubmit={handleSubmit}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Emitir Nueva Tarjeta</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <span className="msym" style={{ fontSize: 20 }} aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Vista previa en tiempo real */}
        <div className={styles.previewContainer}>
          <CardDisplay card={previewCard} />
        </div>

        {/* Selector de Marca / Nivel */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Categoría de Tarjeta</label>
          <div className={styles.tierGrid}>
            {BRANDS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.tierOption} ${
                  brand === item.id ? styles.tierOptionSelected : ""
                }`}
                onClick={() => setBrand(item.id)}
              >
                <span className="msym" style={{ fontSize: 20 }} aria-hidden="true">
                  {item.icon}
                </span>
                <span className={styles.tierName}>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selector de Tipo (Virtual vs Física) */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Modalidad</label>
          <div className={styles.typeGrid}>
            <button
              type="button"
              className={`${styles.typeOption} ${
                cardType === "VIRTUAL" ? styles.typeOptionSelected : ""
              }`}
              onClick={() => setCardType("VIRTUAL")}
            >
              <span className="msym" style={{ fontSize: 22 }} aria-hidden="true">
                bolt
              </span>
              <div className={styles.typeInfo}>
                <span className={styles.typeName}>Virtual</span>
                <span className={styles.typeSub}>Activación instantánea</span>
              </div>
            </button>

            <button
              type="button"
              className={`${styles.typeOption} ${
                cardType === "PHYSICAL" ? styles.typeOptionSelected : ""
              }`}
              onClick={() => setCardType("PHYSICAL")}
            >
              <span className="msym" style={{ fontSize: 22 }} aria-hidden="true">
                local_shipping
              </span>
              <div className={styles.typeInfo}>
                <span className={styles.typeName}>Física</span>
                <span className={styles.typeSub}>Envío a domicilio</span>
              </div>
            </button>
          </div>
        </div>

        {/* Etiqueta / Nombre de tarjeta */}
        <Input
          label="Nombre o Etiqueta (Opcional)"
          placeholder="Ej: Compras Online, Suscripciones, Ahorros"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={50}
        />

        {errorMessage && (
          <div className={styles.errorMessage} role="alert">
            <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">
              error
            </span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting || currentCardCount >= 5}
          >
            {isSubmitting ? "Emitiendo..." : "Confirmar y Emitir"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
