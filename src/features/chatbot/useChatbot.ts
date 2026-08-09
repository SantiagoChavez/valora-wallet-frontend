import { useEffect, useRef, useState } from "react";
import { CHATBOT_MAX_MESSAGE_LENGTH, sendChatMessage } from "./chatbotService";
import { getApiErrorMessage } from "../../shared/services/apiClient";
import { useAuth } from "../../shared/auth/useAuth";

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
  const { token } = useAuth();
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

  // El setup también lo prende, no solo useRef(true) al declarar — en dev con
  // StrictMode, React monta, corre el efecto, corre el cleanup enseguida
  // (isMountedRef.current = false) y vuelve a correr el efecto una segunda vez
  // sin desmontar de verdad. Con un setup vacío, esa segunda pasada no repone
  // el true — el ref queda apagado para siempre aunque el componente siga
  // montado, y sendMessage frena todos sus setState (incluido el
  // setIsLoading(false) del finally) como si estuviera desmontado. Repetir
  // isMountedRef.current = true acá cancela ese ciclo sin afectar la
  // protección real: en un desmontaje genuino, el último cleanup en correr
  // sigue siendo el que lo deja en false.
  useEffect(() => {
    isMountedRef.current = true;
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

    // A diferencia de Dashboard.tsx (que se desmonta entero vía ProtectedRoute
    // en cuanto token cae a null), este hook puede seguir vivo con el panel
    // todavía abierto en ese momento — un `as string` acá escondería el caso
    // real de sesión vencida en vez de mostrarlo. Guard temprano en vez de
    // cast: angosta token a string para el resto de la función sin asumir nada.
    if (!token) {
      setError("Sesión no válida, iniciá sesión de nuevo.");
      return;
    }

    setError(null);
    setMessages((prev) => [...prev, { id: generateMessageId(), role: "user", text: trimmed }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(trimmed, token);
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
