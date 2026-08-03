import { useEffect, useState, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "./authService";
import type { User } from "../types/models";

const STORAGE_KEY = "valora_auth";

interface StoredAuth {
  token: string;
  user: User;
  walletId: string;
}

function readStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<StoredAuth | null>(() => readStoredAuth());

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  async function login(email: string, password: string) {
    const response = await authService.login(email, password);
    setAuth(response);
  }

  function logout() {
    setAuth(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        token: auth?.token ?? null,
        isAuthenticated: auth !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
