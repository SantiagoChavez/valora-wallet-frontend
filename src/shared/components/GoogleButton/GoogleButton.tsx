import { useEffect, useRef, useState } from "react";
import { Button } from "../Button/Button";
import styles from "./GoogleButton.module.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

interface GoogleButtonProps {
  onSuccess: (idToken: string) => void;
  onError: (message: string) => void;
}

const GENERIC_ERROR = "No se pudo iniciar sesión con Google. Intentá de nuevo.";

// google.accounts.id.initialize() es un singleton global: la última llamada
// pisa la configuración de cualquier llamada anterior en la misma carga de
// página (documentado por Google — cada llamada extra emite el warning
// "initialize() is called multiple times"). /login y /registro son rutas
// hermanas bajo GuestRoute (App.tsx) — React Router navega entre ellas sin
// recargar la página (Login.tsx/Registro.tsx se linkean con <Link>, no
// <a href>), así que window.google persiste entre esa navegación y cada una
// monta su propia instancia de GoogleButton. Sin esta guarda a nivel módulo,
// ir de /login a /registro (o viceversa) sin refrescar dispara una segunda
// llamada real a initialize() — no simulada por StrictMode, confirmado en
// producción (reporte de Analía, 12/08). Nunca hay dos instancias de
// GoogleButton montadas a la vez (son rutas hermanas mutuamente excluyentes,
// sin Suspense/lazy en App.tsx que pueda solaparlas), así que "una sola vez
// por carga de página" es seguro acá.
let hasInitializedGoogleClient = false;

// El callback que registra initialize() también es global y solo se registra
// una vez (con la guarda de arriba) — si cerrara sobre los props de la
// instancia que llamó initialize() primero, un login exitoso en /registro
// después de haber pasado por /login ejecutaría el onSuccess/onError de
// Login, no el de Registro. Esta indirección hace que el callback lea
// siempre el handler de la instancia actualmente montada, sin importar cuál
// llamó initialize() en su momento.
const activeHandlers: { onSuccess: (idToken: string) => void; onError: (message: string) => void } = {
  onSuccess: () => {},
  onError: () => {},
};

// El Identity Services de Google (index.html) no expone una forma soportada
// de disparar el flujo de ID token desde un botón propio — solo desde su
// propio botón renderizado. Se renderiza ese botón real pero invisible
// (GoogleButton.module.css) y se le hace click por código al tocar el
// nuestro, así conservamos el diseño del resto de la app.
export function GoogleButton({ onSuccess, onError }: GoogleButtonProps) {
  const hiddenButtonRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // activeHandlers (módulo) se actualiza en cada render de la instancia
  // actualmente montada, no solo al inicializar — así el callback global
  // de initialize() siempre ejecuta la lógica de la página en pantalla.
  useEffect(() => {
    activeHandlers.onSuccess = onSuccess;
    activeHandlers.onError = onError;
  }, [onSuccess, onError]);

  // StrictMode (main.tsx) monta cada componente dos veces en desarrollo
  // (monta → limpia → vuelve a montar) para detectar efectos no idempotentes
  // — sin esta guarda, la segunda invocación repetía renderButton() sobre el
  // mismo hiddenButtonRef.current, dejando dos botones apilados en el mismo
  // div. Es por instancia (no a nivel módulo, a diferencia de
  // hasInitializedGoogleClient) porque renderButton() sí necesita correr una
  // vez por cada instancia real de GoogleButton (cada una tiene su propio
  // hiddenButtonRef) — solo initialize() debe correr una sola vez por
  // página.
  const hasSetupRef = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;
    let pollId: ReturnType<typeof setInterval> | undefined;

    function setup() {
      if (cancelled || hasSetupRef.current || !window.google || !hiddenButtonRef.current || !CLIENT_ID) return;
      hasSetupRef.current = true;
      if (!hasInitializedGoogleClient) {
        hasInitializedGoogleClient = true;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              activeHandlers.onSuccess(response.credential);
            } else {
              activeHandlers.onError(GENERIC_ERROR);
            }
          },
        });
      }
      window.google.accounts.id.renderButton(hiddenButtonRef.current, { type: "standard" });
      setIsReady(true);
    }

    if (window.google) {
      setup();
    } else {
      // El script en index.html carga con "async" — puede no estar listo
      // todavía cuando este componente monta. Si nunca llega a cargar (CSP,
      // adblock, red caída), no tiene sentido seguir sondeando para siempre
      // mientras la persona esté parada en Login/Registro — se corta a los
      // 10s y el botón queda deshabilitado (mismo estado que "no configurado").
      let attempts = 0;
      const MAX_ATTEMPTS = 100;
      pollId = setInterval(() => {
        attempts += 1;
        if (window.google) {
          if (pollId) clearInterval(pollId);
          setup();
        } else if (attempts >= MAX_ATTEMPTS) {
          if (pollId) clearInterval(pollId);
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
    };
  }, []);

  function handleClick() {
    const realButton = hiddenButtonRef.current?.querySelector<HTMLElement>("div[role=button]");
    if (realButton) {
      realButton.click();
    } else {
      onError(GENERIC_ERROR);
    }
  }

  if (!CLIENT_ID) {
    return (
      <Button
        type="button"
        variant="secondary"
        className={styles.googleButton}
        aria-disabled="true"
        title="Todavía no disponible"
      >
        <GoogleLogo />
        Continuar con Google
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className={styles.googleButton}
        onClick={handleClick}
        disabled={!isReady}
      >
        <GoogleLogo />
        Continuar con Google
      </Button>
      <div ref={hiddenButtonRef} className={styles.hiddenGoogleButton} aria-hidden="true" />
    </>
  );
}

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.8 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.3C29.4 35.4 26.8 36 24 36c-5.2 0-9.6-3.4-11.2-8.1l-6.5 5C9.6 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.3-2.3 4.2-4.2 5.6l6.2 5.3C39.9 37 44 31 44 24c0-1.2-.1-2.4-.4-3.5z" />
    </svg>
  );
}
