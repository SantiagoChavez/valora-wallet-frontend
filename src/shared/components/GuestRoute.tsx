import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
