import { createContext } from "react";
import type { User, Wallet } from "../types/models";

export interface AuthContextValue {
  user: User | null;
  wallet: Wallet | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Actualiza la wallet guardada en sesión tras un cambio real (ej. PUT
  // /wallet/alias) — sin esto, el alias nuevo se vería recién después de un
  // refresh (que vuelve a leer sessionStorage, pero con el valor viejo).
  updateWallet: (wallet: Wallet) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
