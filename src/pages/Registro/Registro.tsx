import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/Button/Button";
import { Card } from "../../shared/components/Card/Card";
import { Input } from "../../shared/components/Input/Input";
import { Toast } from "../../shared/components/Toast/Toast";
import { useToast, TOAST_DURATION_MS } from "../../shared/components/Toast/useToast";
import * as authService from "../../shared/auth/authService";
import { ApiError } from "../../shared/services/apiClient";
import styles from "./Registro.module.css";

export function Registro() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message: toast, showToast } = useToast();
  const navigate = useNavigate();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register(email, password, firstName, lastName);
      showToast("Cuenta creada, iniciá sesión.");
      redirectTimer.current = setTimeout(() => {
        navigate("/login", { replace: true });
      }, TOAST_DURATION_MS);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "No se pudo conectar con el servidor. Intentá de nuevo.";
      setError(message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1 className={styles.title}>Valora Wallet</h1>
          <Input
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="given-name"
            required
          />
          <Input
            label="Apellido"
            type="text"
            placeholder="Tu apellido"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="family-name"
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </Card>
      <Toast message={toast} />
    </div>
  );
}
