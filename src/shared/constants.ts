export const SUPPORT_EMAIL = "nexot.solutions@gmail.com";

// Prefijo de la key de localStorage del historial del chatbot — la key final
// es `${CHATBOT_HISTORY_KEY_PREFIX}${userId}`. Compartido entre
// features/chatbot/useChatbot.ts (lee/escribe el historial) y
// shared/auth/AuthProvider.tsx (lo borra en logout), para que los dos
// construyan exactamente la misma key sin duplicar el string a mano.
// Convención para cualquier localStorage por-usuario nuevo: key con el userId
// scopeado así (nunca datos de un usuario visibles/mezclados con los de otro
// en el mismo dispositivo), prefijo como constante acá en vez de hardcodeado
// en cada lugar que lo usa, y limpieza explícita en logout().
export const CHATBOT_HISTORY_KEY_PREFIX = "chatbot_history_";

// Prefijo de la key de localStorage de notificaciones ya vistas — la key final
// es `${NOTIF_SEEN_KEY_PREFIX}${userId}`. Mismo patrón que
// CHATBOT_HISTORY_KEY_PREFIX de arriba: compartido entre
// layouts/DashboardLayout/DashboardLayout.tsx (lee/escribe qué notificaciones
// ya se vieron) y shared/auth/AuthProvider.tsx (lo borra en logout).
export const NOTIF_SEEN_KEY_PREFIX = "notif_seen_";
