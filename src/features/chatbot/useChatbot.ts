import { useState } from "react";
import { CHATBOT_MAX_MESSAGE_LENGTH, sendChatMessage } from "./chatbotService";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

const MESSAGE_TOO_LONG_ERROR = `El mensaje no puede superar los ${CHATBOT_MAX_MESSAGE_LENGTH} caracteres.`;

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Se valida acá, antes de llamar al service — un mensaje que excede el
    // contrato ni siquiera llega a simular el request.
    if (trimmed.length > CHATBOT_MAX_MESSAGE_LENGTH) {
      setError(MESSAGE_TOO_LONG_ERROR);
      return;
    }

    setError(null);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: trimmed }]);
    setIsLoading(true);

    const response = await sendChatMessage(trimmed);

    if (response.success) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", text: response.data.reply }]);
    } else {
      setError(response.message);
    }
    setIsLoading(false);
  }

  return { messages, isLoading, error, sendMessage };
}
