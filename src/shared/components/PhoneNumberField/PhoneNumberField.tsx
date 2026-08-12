import { Input } from "../Input/Input";
import { PHONE_COUNTRY_CODES } from "../../constants";
import styles from "./PhoneNumberField.module.css";

interface PhoneNumberFieldProps {
  dialCodeSelectId: string;
  localInputId: string;
  // El `code` elegido (ej. "AR"), no el dialCode con "+" — mismo criterio que
  // ya usaba CompleteProfileModal: el dialCode real se busca recién al armar
  // el submit (ver CompleteProfileModal.tsx / EditPhoneModal.tsx), porque
  // DO/US comparten dialCode ("+1") y `code` es lo único único por país.
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  local: string;
  onLocalChange: (value: string) => void;
  dialCodeLabel?: string;
  localLabel?: string;
  placeholder?: string;
  required?: boolean;
  // Ícono del Input de número local (ver Input.tsx `icon`) — CompleteProfileModal
  // no le pone ninguno, Registro.tsx sí usaba "call" antes de esta extracción;
  // sin esta prop ese ícono se perdía al migrar Registro al componente compartido.
  icon?: string;
  // Clase para el <label> del select de prefijo — sin esto, los dos
  // consumidores quedaban con el label del select en el estilo mudo/chico
  // (.label acá abajo) que traía CompleteProfileModal, pisando el label bold
  // (labelLg) que Registro.tsx ya usaba para sus dos selects antes de esta
  // extracción. Default: el propio .label del componente (comportamiento
  // idéntico al que ya tenía CompleteProfileModal).
  labelClassName?: string;
}

// Selector de prefijo de celular + input de número local — extraído de
// CompleteProfileModal (su único origen hasta ahora) para reusarlo en
// EditPhoneModal (Usuario.tsx) sin duplicar el bloque. La sanitización
// (\D) y el armado del string final (dialCode + local) quedan en cada
// consumidor, no acá — este componente solo maneja la UI controlada.
export function PhoneNumberField({
  dialCodeSelectId,
  localInputId,
  countryCode,
  onCountryCodeChange,
  local,
  onLocalChange,
  dialCodeLabel = "País del celular",
  localLabel = "Celular",
  placeholder = "11 96123-4567",
  required,
  icon,
  labelClassName,
}: PhoneNumberFieldProps) {
  return (
    <div className={styles.phoneRow}>
      <div className={styles.phoneField}>
        <label className={labelClassName ?? styles.label} htmlFor={dialCodeSelectId}>
          {dialCodeLabel}
        </label>
        <div className={styles.selectWrap}>
          <select
            id={dialCodeSelectId}
            className={styles.select}
            value={countryCode}
            onChange={(event) => onCountryCodeChange(event.target.value)}
          >
            {PHONE_COUNTRY_CODES.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.code} ({entry.dialCode})
              </option>
            ))}
          </select>
          <span className={`msym ${styles.selectIcon}`} aria-hidden="true">expand_more</span>
        </div>
      </div>

      <div className={styles.phoneInputField}>
        <Input
          id={localInputId}
          label={localLabel}
          type="tel"
          size="lg"
          placeholder={placeholder}
          value={local}
          onChange={(event) => onLocalChange(event.target.value)}
          autoComplete="tel-national"
          icon={icon}
          required={required}
        />
      </div>
    </div>
  );
}
