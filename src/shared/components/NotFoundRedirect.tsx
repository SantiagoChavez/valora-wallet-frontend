import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

// Redirige directo al destino final según sesión, en vez de mandar siempre a "/"
// y dejar que ProtectedRoute reboté a "/login" si no hay sesión (doble salto).
export function NotFoundRedirect() {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
}
