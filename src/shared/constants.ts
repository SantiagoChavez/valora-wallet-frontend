export const SUPPORT_EMAIL = "nexot.solutions@gmail.com";

// Prefijo de la key de localStorage del historial del chatbot — la key final
// es `${CHATBOT_HISTORY_KEY_PREFIX}${userId}`. Compartido entre
// features/chatbot/useChatbot.ts (lee/escribe el historial) y
// shared/auth/AuthProvider.tsx (lo borra en logout), para que los dos
// construyan exactamente la misma key sin duplicar el string a mano — ver
// convención de localStorage scopeado por usuario en CLAUDE.md.
export const CHATBOT_HISTORY_KEY_PREFIX = "chatbot_history_";
