import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../shared/auth/useAuth";
import {
  CARD_NUMBER_COPIED_MESSAGE,
  CardDisplay,
} from "../../shared/components/CardDisplay/CardDisplay";
import { CreateCardModal } from "../../shared/components/CreateCardModal/CreateCardModal";
import { Toast } from "../../shared/components/Toast/Toast";
import { useToast } from "../../shared/components/Toast/useToast";
import {
  fetchCards,
  fetchCardDetails,
  toggleFreezeCard,
  deleteCard,
} from "../../shared/services/cardService";
import { getApiErrorMessage } from "../../shared/services/apiClient";
import type { Card } from "../../shared/types/models";
import styles from "./Tarjetas.module.css";

const MAX_CARDS = 5;

export function Tarjetas() {
  const { token } = useAuth();
  const { message: toast, showToast } = useToast();

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadCards = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCards(token);
      setCards(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  async function handleFreezeToggle(card: Card) {
    if (!token) return;
    try {
      const { card: updatedCard, message } = await toggleFreezeCard(card.id, token);
      setCards((prev) =>
        prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
      );
      showToast(message);
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err));
    }
  }

  async function handleDelete(card: Card) {
    if (!token) return;
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseás dar de baja la tarjeta "${card.label}"?`
    );
    if (!confirmDelete) return;

    try {
      const message = await deleteCard(card.id, token);
      setCards((prev) => prev.filter((c) => c.id !== card.id));
      showToast(message);
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err));
    }
  }

  async function handleReveal(card: Card): Promise<string | undefined> {
    if (!token) return undefined;
    try {
      const fullCard = await fetchCardDetails(card.id, token);
      // Actualizamos los datos en memoria para no requerir llamadas subsiguientes
      setCards((prev) =>
        prev.map((c) => (c.id === fullCard.id ? fullCard : c))
      );
      return fullCard.cardNumber;
    } catch (err: unknown) {
      showToast(getApiErrorMessage(err));
      return undefined;
    }
  }

  function handleCreateSuccess(newCard: Card) {
    setCards((prev) => [...prev, newCard]);
    showToast(`¡Tarjeta "${newCard.label}" emitida con éxito!`);
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Tarjetas</h1>
          <p className={styles.subtitle}>
            Administrá tus tarjetas físicas y virtuales Valora para cobros y gastos internacionales.
          </p>
        </div>
        {!isLoading && (
          <div className={styles.cardCountBadge}>
            {cards.length} / {MAX_CARDS} tarjetas
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <span>{error}</span>
          <button type="button" className={styles.retryButton} onClick={loadCards}>
            Reintentar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <span
            className="msym"
            style={{ fontSize: 36, animation: "spin 1s linear infinite" }}
            aria-hidden="true"
          >
            progress_activity
          </span>
          <p>Cargando tus tarjetas...</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {cards.map((card) => (
            <div key={card.id} className={styles.cardItem}>
              <div className={styles.cardItemHeader}>
                <span className={styles.cardItemLabel}>{card.label}</span>
                <span className={styles.cardItemType}>
                  {card.cardType === "VIRTUAL" ? "Virtual" : "Física"}
                </span>
              </div>
              <CardDisplay
                card={card}
                showManageActions={true}
                onCopy={() => showToast(CARD_NUMBER_COPIED_MESSAGE)}
                onFreezeToggle={handleFreezeToggle}
                onDelete={handleDelete}
                onReveal={handleReveal}
              />
            </div>
          ))}

          {/* Si no tiene tarjetas emitidas aún, mostrar la tarjeta predeterminada para que no quede vacía */}
          {cards.length === 0 && (
            <div className={styles.cardItem}>
              <div className={styles.cardItemHeader}>
                <span className={styles.cardItemLabel}>Tarjeta Principal</span>
                <span className={styles.cardItemType}>Virtual</span>
              </div>
              <CardDisplay onCopy={() => showToast(CARD_NUMBER_COPIED_MESSAGE)} />
            </div>
          )}

          {/* Botón para emitir nueva tarjeta (hasta límite de 5) */}
          {cards.length < MAX_CARDS && (
            <button
              type="button"
              className={styles.addCardSlot}
              onClick={() => setIsCreateModalOpen(true)}
              aria-label="Emitir nueva tarjeta"
            >
              <span className={`msym ${styles.addIcon}`} aria-hidden="true">
                add_card
              </span>
              <span className={styles.addTitle}>Emitir nueva tarjeta</span>
              <span className={styles.addSub}>Virtual o física instantánea</span>
            </button>
          )}
        </div>
      )}

      {token && (
        <CreateCardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          token={token}
          onSuccess={handleCreateSuccess}
          currentCardCount={cards.length}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
