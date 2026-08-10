import { useEffect, useState, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "./authService";
import type { User, Wallet } from "../types/models";
import { CHATBOT_HISTORY_KEY_PREFIX } from "../constants";

const STORAGE_KEY = "valora_auth";

interface StoredAuth {
  token: string;
  user: User;
  wallet: Wallet;
}

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    // sessionStorage puede tirar (modo privado, storage bloqueado) además de que
    // el JSON puede estar corrupto — cualquiera de los dos, se ignora la sesión guardada.
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => readStoredAuth());

  useEffect(() => {
    try {
      if (auth) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage bloqueado o sin cuota: la sesión sigue andando en memoria para
      // esta pestaña, solo no va a persistir si se recarga la página.
    }
  }, [auth]);

  async function login(email: string, password: string) {
    const response = await authService.login(email, password);
    setAuth(response);
  }

  // auth no puede ser null acá en la práctica (solo se llama desde la vista
  // Usuario, montada detrás de ProtectedRoute) — igual se chequea explícito
  // en vez de asumir, mismo criterio que el resto de este archivo.
  function updateWallet(wallet: Wallet) {
    setAuth((prev) => (prev ? { ...prev, wallet } : prev));
  }

  function logout() {
    // El historial del chatbot vive en localStorage, scopeado por userId
    // (ver CHATBOT_HISTORY_KEY_PREFIX en shared/constants.ts) — no se borra
    // solo, hay que limpiarlo acá a mano. Mismo criterio que el resto de esta
    // función: si falla (storage bloqueado/sin cuota), no bloquea el logout en sí.
    if (auth) {
      try {
        localStorage.removeItem(`${CHATBOT_HISTORY_KEY_PREFIX}${auth.user.id}`);
      } catch {
        // Storage bloqueado o sin cuota — no bloquea el logout.
      }
    }
    setAuth(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        wallet: auth?.wallet ?? null,
        token: auth?.token ?? null,
        isAuthenticated: Boolean(auth?.token),
        login,
        logout,
        updateWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
