import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/Button/Button";
import { GoogleButton } from "../../shared/components/GoogleButton/GoogleButton";
import { Input } from "../../shared/components/Input/Input";
import { AuthMobileGlow, AuthBrandGlow } from "../../shared/components/AuthBlobs/AuthBlobs";
import { AuthBrandHeader } from "../../shared/components/AuthBrandHeader/AuthBrandHeader";
import { AuthMobileHeader } from "../../shared/components/AuthMobileHeader/AuthMobileHeader";
import { AuthBrandCopy } from "../../shared/components/AuthBrandCopy/AuthBrandCopy";
import { AuthFormIntro } from "../../shared/components/AuthFormIntro/AuthFormIntro";
import { useAuth } from "../../shared/auth/useAuth";
import { ApiError } from "../../shared/services/apiClient";
import styles from "./Login.module.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "No se pudo conectar con el servidor. Intentá de nuevo.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <AuthMobileGlow />

      <section className={styles.brandPanel}>
        <AuthBrandGlow />
        <AuthBrandHeader />

        <AuthBrandCopy
          headline="Tu dinero, sin fronteras."
          subtext="Recibe, convierte y gestioná múltiples monedas desde una sola cuenta hecha para freelancers de LATAM."
        >
          <div className={styles.brandPills}>
            <span className={styles.pill}>
              <span className={styles.pillDot} aria-hidden="true" />
              USD · EUR · ARS
            </span>
            <span className={styles.pill}>
              <span className="msym" style={{ fontSize: 16 }} aria-hidden="true">bolt</span>
              Transferencias instantáneas
            </span>
          </div>
        </AuthBrandCopy>
      </section>

      <div className={styles.formPanel}>
        <div className={styles.formPanelInner}>
          <AuthMobileHeader />

          <AuthFormIntro title="Bienvenido de nuevo" subtitle="Accedé de forma segura a tus activos" />

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              id="email"
              label="Correo electrónico"
              type="email"
              size="lg"
              placeholder="Introducí tu correo"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              icon="mail"
              required
            />

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label htmlFor="password" className={styles.fieldLabel}>Contraseña</label>
                <Link to="/recuperar-contrasena" className={styles.inlineLink}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                icon={showPassword ? "visibility_off" : "visibility"}
                onIconClick={() => setShowPassword((value) => !value)}
                iconLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                iconPressed={showPassword}
                required
              />
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className={styles.actionButton}>
              {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <Button type="button" variant="secondary" className={styles.actionButton} onClick={() => navigate("/registro")}>
              Crear cuenta
            </Button>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>o continuá con</span>
              <span className={styles.dividerLine} />
            </div>

            <GoogleButton />
          </form>

          <p className={styles.signupHint}>
            ¿No tenés cuenta? <Link to="/registro" className={styles.inlineLink}>Registrate</Link>
          </p>

          <p className={styles.footerNote}>© 2026 Valora Digital Limited. Conexión cifrada activa.</p>
        </div>
      </div>
    </div>
  );
}
