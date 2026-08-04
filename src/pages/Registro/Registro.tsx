import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../shared/assets/valora-logo.png";
import { Button } from "../../shared/components/Button/Button";
import { LegalModal } from "../../shared/components/LegalModal/LegalModal";
import { Toast } from "../../shared/components/Toast/Toast";
import { useToast, TOAST_DURATION_MS } from "../../shared/components/Toast/useToast";
import * as authService from "../../shared/auth/authService";
import { ApiError } from "../../shared/services/apiClient";
import styles from "./Registro.module.css";

type LegalVariant = "terms" | "privacy";

// Color fijo por posición (no por puntaje total): la barra 1 siempre es roja al
// llenarse, la 2 naranja, la 3 amarilla, la 4 verde — niveles de seguridad
// diferenciados en vez de un único color binario débil/fuerte.
const STRENGTH_LEVEL_CLASSES = [styles.strengthLevel1, styles.strengthLevel2, styles.strengthLevel3, styles.strengthLevel4];

const MIN_AGE_YEARS = 18;

function getMaxBirthdate(): string {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - MIN_AGE_YEARS, today.getMonth(), today.getDate());
  return maxDate.toISOString().split("T")[0];
}

// El backend (Zod, ver authSchema.ts) espera la fecha en DD/MM/YYYY, no en el
// formato ISO (YYYY-MM-DD) que devuelve un <input type="date"> nativo.
function toBackendDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

// Puntaje visual (0-4), no reemplaza la validación real: el backend solo exige
// mínimo 6 caracteres (ver authSchema.ts). Esto es feedback de UX, no un gate.
function getPasswordScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function Registro() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openLegal, setOpenLegal] = useState<LegalVariant | null>(null);
  const { message: toast, showToast } = useToast();
  const navigate = useNavigate();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const passwordScore = getPasswordScore(password);
  const passwordMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register(email, password, firstName, lastName, toBackendDate(dateOfBirth), phone);
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
          <h2 className={styles.brandHeadline}>Empezá en minutos.</h2>
          <p className={styles.brandSubtext}>
            Creá tu cuenta y gestioná múltiples monedas desde una sola plataforma hecha para freelancers de
            LATAM.
          </p>
          <ul className={styles.brandChecklist}>
            <li className={styles.brandChecklistItem}>
              <span className={`msym ${styles.brandCheckIcon}`} aria-hidden="true">check</span>
              Sin comisiones de apertura ni mantenimiento
            </li>
            <li className={styles.brandChecklistItem}>
              <span className={`msym ${styles.brandCheckIcon}`} aria-hidden="true">check</span>
              Recibí en USD, EUR y ARS al instante
            </li>
            <li className={styles.brandChecklistItem}>
              <span className={`msym ${styles.brandCheckIcon}`} aria-hidden="true">check</span>
              Verificación de identidad en menos de 5 minutos
            </li>
          </ul>
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
            <h2 className={styles.formTitle}>Creá tu cuenta</h2>
            <p className={styles.formSubtitle}>Empezá a gestionar tus finanzas sin fronteras</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.nameRow}>
              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.fieldLabel}>Nombre</label>
                <div className={styles.inputWrap}>
                  <input
                    id="firstName"
                    type="text"
                    className={`${styles.input} ${styles.inputWithIcon}`}
                    placeholder="Tu nombre"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    minLength={2}
                    required
                  />
                  <span className={`msym ${styles.inputIcon}`} aria-hidden="true">person</span>
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.fieldLabel}>Apellido</label>
                <div className={styles.inputWrap}>
                  <input
                    id="lastName"
                    type="text"
                    className={styles.input}
                    placeholder="Tu apellido"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                    minLength={2}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email" className={styles.fieldLabel}>Correo electrónico</label>
              <div className={styles.inputWrap}>
                <input
                  id="email"
                  type="email"
                  className={`${styles.input} ${styles.inputWithIcon}`}
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
              <label htmlFor="birthdate" className={styles.fieldLabel}>Fecha de nacimiento</label>
              <div className={styles.inputWrap}>
                <input
                  id="birthdate"
                  type="date"
                  className={styles.input}
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  max={getMaxBirthdate()}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="phone" className={styles.fieldLabel}>Celular</label>
              <div className={styles.inputWrap}>
                <input
                  id="phone"
                  type="tel"
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="+54 9 11 1234-5678"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  required
                />
                <span className={`msym ${styles.inputIcon}`} aria-hidden="true">call</span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password" className={styles.fieldLabel}>Contraseña</label>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={6}
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
              <div className={styles.strengthMeter} aria-hidden="true">
                {STRENGTH_LEVEL_CLASSES.map((levelClass, index) => (
                  <span
                    key={levelClass}
                    className={`${styles.strengthBar} ${index < passwordScore ? levelClass : ""}`}
                  />
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password2" className={styles.fieldLabel}>Confirmar contraseña</label>
              <div className={styles.inputWrap}>
                <input
                  id="password2"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`${styles.input} ${styles.inputWithIcon} ${passwordMismatch ? styles.inputError : ""}`}
                  placeholder="Repetí tu contraseña"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className={styles.inputIconButton}
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <span className="msym" aria-hidden="true">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {passwordMismatch && <p className={styles.fieldHint}>Las contraseñas no coinciden</p>}
            </div>

            <div className={styles.checkboxRow}>
              <input id="terms" type="checkbox" className={styles.checkbox} required />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                Acepto los{" "}
                <button type="button" className={styles.inlineLink} onClick={() => setOpenLegal("terms")}>
                  Términos de Servicio
                </button>{" "}
                y la{" "}
                <button type="button" className={styles.inlineLink} onClick={() => setOpenLegal("privacy")}>
                  Política de Privacidad
                </button>{" "}
                de Valora Wallet.
              </label>
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className={styles.actionButton}>
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>

            <div className={styles.divider}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>o registrate con</span>
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
            ¿Ya tenés cuenta? <Link to="/login" className={styles.inlineLink}>Iniciá sesión</Link>
          </p>

          <p className={styles.footerNote}>© 2026 Valora Digital Limited. Conexión cifrada activa.</p>
        </div>
      </div>

      <Toast message={toast} />
      <LegalModal isOpen={openLegal !== null} onClose={() => setOpenLegal(null)} variant={openLegal ?? "terms"} />
    </div>
  );
}
