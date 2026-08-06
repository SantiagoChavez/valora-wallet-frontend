import type { AppNotification } from "./NotificationPanel";

export const NOTIFICATIONS: AppNotification[] = [
  { id: "1", title: "¡Transacción exitosa!", body: "Has recibido $500 USD en tu cuenta.", unread: true },
  { id: "2", title: "Cambio completado", body: "EUR a USD procesado con éxito.", unread: false },
];
