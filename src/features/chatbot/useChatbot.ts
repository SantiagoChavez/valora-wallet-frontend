import { useEffect, useRef, useState } from "react";
import { CHATBOT_MAX_MESSAGE_LENGTH, sendChatMessage } from "./chatbotService";
import { getApiErrorMessage } from "../../shared/services/apiClient";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

const MESSAGE_TOO_LONG_ERROR = `El mensaje no puede superar los ${CHATBOT_MAX_MESSAGE_LENGTH} caracteres.`;

// crypto.randomUUID() necesita contexto seguro (HTTPS/localhost) y no existe
// en navegadores/webviews viejos — puede tirar en runtime. Fallback simple,
// solo necesita ser único dentro de esta sesión de chat (no persiste).
function generateMessageId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Mensaje estático de UI, no pasa por chatbotService — no simula un request
// real, no tiene sentido gastar el mock en esto. Se reinstancia cada vez que
// se monta el hook (ChatbotWidget se desmonta/monta completo con chatbotOpen,
// no usa hidden) — reaparece en cada apertura del panel, esperado sin
// persistencia entre sesiones de chat.
const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "¡Hola! Soy Botsi, tu asistente virtual de Valora. ¿En qué puedo ayudarte hoy?",
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El hook vive exactamente lo que vive ChatbotWidget — un solo mount/unmount
  // por instancia (a diferencia de loadDashboardData en Dashboard.tsx, que
  // corre varias veces dentro del mismo componente por cambios de token, y por
  // eso necesita resetear su ref en cada corrida). Acá alcanza con apagar el
  // ref una sola vez al desmontar: si el panel se cierra con un
  // sendChatMessage en vuelo, la respuesta no actualiza el estado de una
  // instancia ya desmontada.
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

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
    setMessages((prev) => [...prev, { id: generateMessageId(), role: "user", text: trimmed }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(trimmed);
      if (!isMountedRef.current) return;

      if (response.success) {
        setMessages((prev) => [...prev, { id: generateMessageId(), role: "bot", text: response.data.reply }]);
      } else {
        setError(response.message);
      }
    } catch (err) {
      // El mock nunca rechaza, pero el service real (fetch) sí puede — sin
      // este catch, una promesa rechazada dejaba isLoading en true para
      // siempre y el error nunca llegaba a mostrarse.
      if (!isMountedRef.current) return;
      setError(getApiErrorMessage(err));
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }

  return { messages, isLoading, error, sendMessage };
}
