import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../shared/components/Button/Button";
import { GoogleButton } from "../../shared/components/GoogleButton/GoogleButton";
import { Input } from "../../shared/components/Input/Input";
import { AuthMobileGlow, AuthBrandGlow } from "../../shared/components/AuthBlobs/AuthBlobs";
import { AuthBrandHeader } from "../../shared/components/AuthBrandHeader/AuthBrandHeader";
import { AuthMobileHeader } from "../../shared/components/AuthMobileHeader/AuthMobileHeader";
import { AuthBrandCopy } from "../../shared/components/AuthBrandCopy/AuthBrandCopy";
import { AuthFormIntro } from "../../shared/components/AuthFormIntro/AuthFormIntro";
import { PasswordStrengthMeter } from "../../shared/components/PasswordStrengthMeter/PasswordStrengthMeter";
import { LegalModal, type LegalVariant } from "../../shared/components/LegalModal/LegalModal";
import { Toast } from "../../shared/components/Toast/Toast";
import { useToast, TOAST_DURATION_MS } from "../../shared/components/Toast/useToast";
import * as authService from "../../shared/auth/authService";
import { getApiErrorMessage } from "../../shared/services/apiClient";
import styles from "./Registro.module.css";

const MIN_AGE_YEARS = 18;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Fecha límite para el <input type="date"> (18 años atrás de hoy), calculada
// una sola vez al cargar el módulo — no cambia entre renders. Se arma con los
// componentes locales de la fecha en vez de toISOString() (que convierte a
// UTC) para no correr un día la fecha límite en husos horarios donde la
// medianoche local cae del otro lado del corte UTC.
function getMaxBirthdate(): string {
  const today = new Date();
  const year = today.getFullYear() - MIN_AGE_YEARS;
  const month = today.getMonth() + 1;
  let day = today.getDate();

  // Si hoy es 29 de febrero (bisiesto) pero año-18 no es bisiesto, esa fecha
  // no existe — clampear al 28, el último día válido de febrero ese año.
  if (month === 2 && day === 29 && !isLeapYear(year)) {
    day = 28;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MAX_BIRTHDATE = getMaxBirthdate();

// El backend (Zod, ver authSchema.ts) espera la fecha en DD/MM/YYYY, no en el
// formato ISO (YYYY-MM-DD) que devuelve un <input type="date"> nativo.
function toBackendDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function Registro() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [du, setDu] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Separado de "está abierto" a propósito: si legalVariant volviera a un
  // default no nulo al cerrar (ej. `openLegal ?? "terms"`), el Modal seguiría
  // montado durante su animación de salida y se vería un flash del contenido
  // cambiando de variante a mitad del cierre. Cerrar solo debe tocar legalOpen.
  const [legalVariant, setLegalVariant] = useState<LegalVariant>("terms");
  const [legalOpen, setLegalOpen] = useState(false);
  const { message: toast, showToast } = useToast();
  const navigate = useNavigate();
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

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
      await authService.register(email, password, firstName, lastName, toBackendDate(dateOfBirth), phone, du);
      showToast("Cuenta creada, iniciá sesión.");
      redirectTimer.current = setTimeout(() => {
        navigate("/login", { replace: true });
      }, TOAST_DURATION_MS);
    } catch (err) {
      setError(getApiErrorMessage(err));
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
          headline="Empezá en minutos."
          subtext="Creá tu cuenta y gestioná múltiples monedas desde una sola plataforma hecha para freelancers de LATAM."
        >
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
        </AuthBrandCopy>
      </section>

      <div className={styles.formPanel}>
        <div className={styles.formPanelInner}>
          <AuthMobileHeader />

          <AuthFormIntro title="Creá tu cuenta" subtitle="Empezá a gestionar tus finanzas sin fronteras" />

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.nameRow}>
              <Input
                id="firstName"
                label="Nombre"
                type="text"
                size="lg"
                placeholder="Tu nombre"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
                icon="person"
                minLength={2}
                required
              />
              <Input
                id="lastName"
                label="Apellido"
                type="text"
                size="lg"
                placeholder="Tu apellido"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
                minLength={2}
                required
              />
            </div>

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

            <Input
              id="birthdate"
              label="Fecha de nacimiento"
              type="date"
              size="lg"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              autoComplete="bday"
              max={MAX_BIRTHDATE}
              className={styles.dateInput}
              required
            />

            <Input
              id="phone"
              label="Celular"
              type="tel"
              size="lg"
              placeholder="+54 9 11 1234-5678"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
              icon="call"
              required
            />

            {/* country va fijo en "AR" (ver authService.register) — a propósito
                sin selector de país: el enum de authSchema.ts del backend hoy
                solo acepta AR/PE/CO/MX, y un dropdown con esos 4 nada más le
                muestra a cualquiera del resto de LATAM (Chile, Uruguay,
                Ecuador, Centroamérica, etc.) una lista que no lo incluye —
                peor que no mostrar el selector. Vuelve cuando el backend
                soporte el resto de la región. Mientras tanto, el formato
                validado acá es el de DNI argentino (7 u 8 dígitos). */}
            <Input
              id="du"
              label="Documento único"
              type="text"
              inputMode="numeric"
              size="lg"
              placeholder="12345678"
              value={du}
              onChange={(event) => setDu(event.target.value)}
              autoComplete="off"
              icon="badge"
              pattern="[0-9]{7,8}"
              minLength={7}
              maxLength={8}
              required
            />

            <div className={styles.field}>
              <Input
                id="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                icon={showPassword ? "visibility_off" : "visibility"}
                onIconClick={() => setShowPassword((value) => !value)}
                iconLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                iconPressed={showPassword}
                minLength={6}
                required
              />
              <PasswordStrengthMeter password={password} />
            </div>

            <div className={styles.field}>
              <Input
                id="password2"
                label="Confirmar contraseña"
                type={showConfirmPassword ? "text" : "password"}
                size="lg"
                placeholder="Repetí tu contraseña"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                icon={showConfirmPassword ? "visibility_off" : "visibility"}
                onIconClick={() => setShowConfirmPassword((value) => !value)}
                iconLabel={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                iconPressed={showConfirmPassword}
                error={passwordMismatch}
                required
              />
              {passwordMismatch && <p className={styles.fieldHint}>Las contraseñas no coinciden</p>}
            </div>

            <div className={styles.checkboxRow}>
              {/* <p>, no <label>: los dos botones de abajo son "labelable" (spec de
                  HTML) y un <label> no puede tener descendientes labelable aparte
                  del control que labelea. El nombre accesible del checkbox va por
                  aria-label en vez de la asociación implícita de label+texto. */}
              <input
                id="terms"
                type="checkbox"
                className={styles.checkbox}
                aria-label="Acepto los Términos de Servicio y la Política de Privacidad de Valora Wallet"
                required
              />
              <p className={styles.checkboxLabel}>
                Acepto los{" "}
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => {
                    setLegalVariant("terms");
                    setLegalOpen(true);
                  }}
                >
                  Términos de Servicio
                </button>{" "}
                y la{" "}
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => {
                    setLegalVariant("privacy");
                    setLegalOpen(true);
                  }}
                >
                  Política de Privacidad
                </button>{" "}
                de Valora Wallet.
              </p>
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

            <GoogleButton />
          </form>

          <p className={styles.signupHint}>
            ¿Ya tenés cuenta? <Link to="/login" className={styles.inlineLink}>Iniciá sesión</Link>
          </p>

          <p className={styles.footerNote}>© 2026 Valora Digital Limited. Conexión cifrada activa.</p>
        </div>
      </div>

      <Toast message={toast} />
      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} variant={legalVariant} />
    </div>
  );
}
