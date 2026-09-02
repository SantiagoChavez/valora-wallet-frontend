import { apiFetch } from "./apiClient";
import type { Card, CardBrand, CardType } from "../types/models";

interface GetCardsResponse {
  success: boolean;
  data: {
    cards: Card[];
  };
}

interface GetCardDetailsResponse {
  success: boolean;
  data: {
    card: Card;
  };
}

interface CreateCardResponse {
  success: boolean;
  message: string;
  data: {
    card: Card;
  };
}

interface ToggleFreezeResponse {
  success: boolean;
  message: string;
  data: {
    card: Card;
  };
}

interface DeleteCardResponse {
  success: boolean;
  message: string;
}

export interface CreateCardParams {
  label?: string;
  brand?: CardBrand;
  cardType?: CardType;
}

/**
 * Obtiene la lista de tarjetas vinculadas a la billetera del usuario.
 */
export async function fetchCards(token: string): Promise<Card[]> {
  const response = await apiFetch<GetCardsResponse>("/cards", {
    method: "GET",
    token,
  });
  return response.data.cards;
}

/**
 * Obtiene los detalles completos (número y CVV desocultos) de una tarjeta puntual.
 */
export async function fetchCardDetails(cardId: string, token: string): Promise<Card> {
  const response = await apiFetch<GetCardDetailsResponse>(`/cards/${cardId}/details`, {
    method: "GET",
    token,
  });
  return response.data.card;
}

/**
 * Emite una nueva tarjeta virtual o física.
 */
export async function createCard(params: CreateCardParams, token: string): Promise<Card> {
  const response = await apiFetch<CreateCardResponse>("/cards", {
    method: "POST",
    token,
    body: JSON.stringify(params),
  });
  return response.data.card;
}

/**
 * Alterna el estado de congelamiento (bloqueo preventivo) de una tarjeta.
 */
export async function toggleFreezeCard(
  cardId: string,
  token: string
): Promise<{ card: Card; message: string }> {
  const response = await apiFetch<ToggleFreezeResponse>(`/cards/${cardId}/freeze`, {
    method: "PATCH",
    token,
  });
  return { card: response.data.card, message: response.message };
}

/**
 * Elimina o da de baja definitivamente una tarjeta.
 */
export async function deleteCard(cardId: string, token: string): Promise<string> {
  const response = await apiFetch<DeleteCardResponse>(`/cards/${cardId}`, {
    method: "DELETE",
    token,
  });
  return response.message;
}
