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

export interface PhoneCountryCode {
  code: string;
  dialCode: string;
  flag: string;
  label: string;
}

// Lista estática propia (sin libphonenumber-js del lado del front, ver
// CompleteProfileModal) — los 19 países LATAM que acepta el backend
// (PAISES_LATAM en authSchema.ts, mismo orden) más US/ES, comunes fuera de la
// región. Selector de prefijo de celular, independiente del selector de país
// de residencia (que reusa esta misma lista filtrada a los 19 LATAM) — un
// usuario puede vivir en un país y tener un celular con prefijo de otro.
export const PHONE_COUNTRY_CODES: PhoneCountryCode[] = [
  { code: "AR", dialCode: "+54", flag: "🇦🇷", label: "Argentina" },
  { code: "BO", dialCode: "+591", flag: "🇧🇴", label: "Bolivia" },
  { code: "BR", dialCode: "+55", flag: "🇧🇷", label: "Brasil" },
  { code: "CL", dialCode: "+56", flag: "🇨🇱", label: "Chile" },
  { code: "CO", dialCode: "+57", flag: "🇨🇴", label: "Colombia" },
  { code: "CR", dialCode: "+506", flag: "🇨🇷", label: "Costa Rica" },
  { code: "CU", dialCode: "+53", flag: "🇨🇺", label: "Cuba" },
  { code: "EC", dialCode: "+593", flag: "🇪🇨", label: "Ecuador" },
  { code: "SV", dialCode: "+503", flag: "🇸🇻", label: "El Salvador" },
  { code: "GT", dialCode: "+502", flag: "🇬🇹", label: "Guatemala" },
  { code: "HN", dialCode: "+504", flag: "🇭🇳", label: "Honduras" },
  { code: "MX", dialCode: "+52", flag: "🇲🇽", label: "México" },
  { code: "NI", dialCode: "+505", flag: "🇳🇮", label: "Nicaragua" },
  { code: "PA", dialCode: "+507", flag: "🇵🇦", label: "Panamá" },
  { code: "PY", dialCode: "+595", flag: "🇵🇾", label: "Paraguay" },
  { code: "PE", dialCode: "+51", flag: "🇵🇪", label: "Perú" },
  { code: "DO", dialCode: "+1", flag: "🇩🇴", label: "República Dominicana" },
  { code: "UY", dialCode: "+598", flag: "🇺🇾", label: "Uruguay" },
  { code: "VE", dialCode: "+58", flag: "🇻🇪", label: "Venezuela" },
  { code: "US", dialCode: "+1", flag: "🇺🇸", label: "Estados Unidos" },
  { code: "ES", dialCode: "+34", flag: "🇪🇸", label: "España" },
];
