import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./apiClient";
import {
  createCard,
  deleteCard,
  fetchCardDetails,
  fetchCards,
  toggleFreezeCard,
} from "./cardService";
import type { Card } from "../types/models";

vi.mock("./apiClient", () => ({
  apiFetch: vi.fn(),
}));

const mockedApiFetch = vi.mocked(apiFetch);

afterEach(() => {
  mockedApiFetch.mockReset();
});

const mockCard: Card = {
  id: "card-123",
  walletId: "wallet-123",
  cardNumber: "•••• •••• •••• 5678",
  maskedNumber: "•••• •••• •••• 5678",
  holderName: "SANTIAGO CHAVEZ",
  expiry: "10/28",
  cvv: "•••",
  brand: "VALORA PLATINUM",
  cardType: "VIRTUAL",
  label: "Tarjeta Principal",
  isFrozen: false,
  createdAt: "2026-09-02T10:00:00.000Z",
};

describe("cardService", () => {
  describe("fetchCards", () => {
    it("llama a GET /cards con el token y devuelve la lista de tarjetas", async () => {
      mockedApiFetch.mockResolvedValue({
        success: true,
        data: { cards: [mockCard] },
      });

      const cards = await fetchCards("mock-token-123");

      expect(mockedApiFetch).toHaveBeenCalledWith("/cards", {
        method: "GET",
        token: "mock-token-123",
      });
      expect(cards).toEqual([mockCard]);
    });
  });

  describe("fetchCardDetails", () => {
    it("llama a GET /cards/:id/details con el token y devuelve los datos completos", async () => {
      const detailedCard: Card = {
        ...mockCard,
        cardNumber: "5412750012345678",
        cvv: "789",
      };

      mockedApiFetch.mockResolvedValue({
        success: true,
        data: { card: detailedCard },
      });

      const card = await fetchCardDetails("card-123", "mock-token-123");

      expect(mockedApiFetch).toHaveBeenCalledWith("/cards/card-123/details", {
        method: "GET",
        token: "mock-token-123",
      });
      expect(card).toEqual(detailedCard);
      expect(card.cardNumber).toBe("5412750012345678");
      expect(card.cvv).toBe("789");
    });
  });

  describe("createCard", () => {
    it("llama a POST /cards con el payload y el token, y devuelve la tarjeta creada", async () => {
      mockedApiFetch.mockResolvedValue({
        success: true,
        message: "Tarjeta emitida correctamente.",
        data: { card: mockCard },
      });

      const newCard = await createCard(
        {
          label: "Compras Online",
          brand: "VALORA BLACK",
          cardType: "VIRTUAL",
        },
        "mock-token-123"
      );

      expect(mockedApiFetch).toHaveBeenCalledWith("/cards", {
        method: "POST",
        token: "mock-token-123",
        body: JSON.stringify({
          label: "Compras Online",
          brand: "VALORA BLACK",
          cardType: "VIRTUAL",
        }),
      });
      expect(newCard).toEqual(mockCard);
    });
  });

  describe("toggleFreezeCard", () => {
    it("llama a PATCH /cards/:id/freeze y devuelve la tarjeta con estado actualizado y mensaje", async () => {
      const frozenCard: Card = { ...mockCard, isFrozen: true };

      mockedApiFetch.mockResolvedValue({
        success: true,
        message: "Tarjeta congelada temporalmente.",
        data: { card: frozenCard },
      });

      const result = await toggleFreezeCard("card-123", "mock-token-123");

      expect(mockedApiFetch).toHaveBeenCalledWith("/cards/card-123/freeze", {
        method: "PATCH",
        token: "mock-token-123",
      });
      expect(result.card.isFrozen).toBe(true);
      expect(result.message).toBe("Tarjeta congelada temporalmente.");
    });
  });

  describe("deleteCard", () => {
    it("llama a DELETE /cards/:id y devuelve el mensaje de confirmación", async () => {
      mockedApiFetch.mockResolvedValue({
        success: true,
        message: "Tarjeta eliminada correctamente.",
      });

      const message = await deleteCard("card-123", "mock-token-123");

      expect(mockedApiFetch).toHaveBeenCalledWith("/cards/card-123", {
        method: "DELETE",
        token: "mock-token-123",
      });
      expect(message).toBe("Tarjeta eliminada correctamente.");
    });
  });
});
