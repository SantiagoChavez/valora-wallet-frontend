import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../shared/assets/valora-logo.png";
import { Button } from "../../shared/components/Button/Button";
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
      <div className={styles.mobileGlow} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobGold}`} />
        <span className={`${styles.blob} ${styles.blobSuccess}`} />
        <span className={`${styles.blob} ${styles.blobGold}`} />
      </div>

      <section className={styles.brandPanel}>
        <div className={styles.brandGlow} aria-hidden="true">
          <span className={`${styles.blob} ${styles.blobGold}`} />
          <span className={`${styles.blob} ${styles.blobSuccess}`} />
        </div>

        <div className={styles.brandHeader}>
          <img src={logo} alt="Valora Wallet" className={styles.brandLogo} />
          <h1 className={styles.brandWordmark}>
            Valora<span className={styles.wordmarkMuted}> Wallet</span>
          </h1>
        </div>

        <div className={styles.brandCopy}>
          <h2 className={styles.brandHeadline}>Tu dinero, sin fronteras.</h2>
          <p className={styles.brandSubtext}>
            Recibe, convierte y gestioná múltiples monedas desde una sola cuenta hecha para freelancers de LATAM.
          </p>
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
        </div>
      </section>

      <div className={styles.formPanel}>
        <div className={styles.formPanelInner}>
          <div className={styles.mobileHeader}>
            <img src={logo} alt="Valora Wallet" className={styles.mobileLogo} />
            <h1 className={styles.mobileWordmark}>
              Valora<span className={styles.wordmarkMuted}> Wallet</span>
            </h1>
          </div>

          <div className={styles.formIntro}>
            <h2 className={styles.formTitle}>Bienvenido de nuevo</h2>
            <p className={styles.formSubtitle}>Accedé de forma segura a tus activos</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.fieldLabel}>Correo electrónico</label>
              <div className={styles.inputWrap}>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="Introducí tu correo"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
                <span className={`msym ${styles.inputIcon}`} aria-hidden="true">mail</span>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label htmlFor="password" className={styles.fieldLabel}>Contraseña</label>
                {/* Sin recuperación de contraseña todavía (no hay endpoint en el backend) */}
                <button type="button" className={styles.inlineLink} aria-disabled="true" title="Todavía no disponible">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className={styles.inputIconButton}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <span className="msym" aria-hidden="true">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
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

            {/* Sin OAuth de Google todavía */}
            <Button
              type="button"
              variant="secondary"
              className={`${styles.actionButton} ${styles.googleButton}`}
              aria-disabled="true"
              title="Todavía no disponible"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.8 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.3C29.4 35.4 26.8 36 24 36c-5.2 0-9.6-3.4-11.2-8.1l-6.5 5C9.6 39.5 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.3-2.3 4.2-4.2 5.6l6.2 5.3C39.9 37 44 31 44 24c0-1.2-.1-2.4-.4-3.5z" />
              </svg>
              Continuar con Google
            </Button>
          </form>

          <p className={styles.signupHint}>
            ¿No tenés cuenta? <Link to="/registro" className={styles.inlineLink}>Registrate</Link>
          </p>
        </div>

        <p className={styles.footerNote}>© 2026 Valora Digital Limited. Conexión cifrada activa.</p>
      </div>
    </div>
  );
}
