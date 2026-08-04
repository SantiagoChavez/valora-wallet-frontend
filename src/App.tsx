import { Route, Routes } from "react-router-dom";
import { GuestRoute } from "./shared/components/GuestRoute";
import { NotFoundRedirect } from "./shared/components/NotFoundRedirect";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Login } from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        {/* Cualquier ruta privada futura (ej: /transactions) va como hija acá adentro, no afuera */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

export default App;
