import type { MouseEvent } from "react";
import { useLocation } from "react-router-dom";

// Mismo criterio que shouldProcessLinkClick/isModifiedEvent de react-router
// (ver node_modules/react-router/dist/development/chunk-62JRHF6Z.mjs) — es el
// guard que usa react-router internamente antes de interceptar un click de
// <a> para navegar. Nuestro onClick corre ANTES que el de react-router
// (Link.handleClick llama primero al onClick que le pasamos, y solo sigue con
// su propia navegación si no llamamos preventDefault) — sin este mismo guard,
// un Ctrl/Cmd+click para abrir el ítem activo en una pestaña nueva quedaría
// roto por nuestro propio preventDefault().
function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

// Compartido entre Sidebar (desktop) y BottomNav (mobile): tapear/clickear un
// ítem del nav que ya está activo no navega a ningún lado (ya estás ahí), así
// que en vez de no hacer nada, funciona como un "volver arriba" implícito.
// itemPath === location.pathname en vez de reconstruir el isActive real de
// NavLink: hoy todas las rutas del layout son planas (ver App.tsx), así que
// son equivalentes.
// TODO: si aparecen rutas anidadas, revisar equivalencia con isActive real de NavLink.
export function useScrollToTopOnActiveClick() {
  const location = useLocation();

  return function handleNavItemClick(itemPath: string, event: MouseEvent) {
    if (itemPath !== location.pathname) return;
    if (event.button !== 0 || isModifiedClick(event)) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}
