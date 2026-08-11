import { useState, type SubmitEvent } from "react";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import { PHONE_COUNTRY_CODES } from "../../constants";
import type { CountryCode } from "../../types/models";
import { useCompleteProfile } from "./useCompleteProfile";
import styles from "./CompleteProfileModal.module.css";

// Los 19 países LATAM que acepta country (residencia) son un subconjunto de
// PHONE_COUNTRY_CODES (esa lista suma US/ES, que no son de residencia válida
// acá) — se reusa la misma lista filtrada en vez de duplicar un segundo mapa
// de nombres de país.
const RESIDENCE_COUNTRY_CODES = PHONE_COUNTRY_CODES.filter((entry) => entry.code !== "US" && entry.code !== "ES");

const DEFAULT_PHONE_COUNTRY_CODE = PHONE_COUNTRY_CODES[0].code;
const DEFAULT_RESIDENCE_COUNTRY = RESIDENCE_COUNTRY_CODES[0].code as CountryCode;

export function CompleteProfileModal() {
  const [phoneCountryCode, setPhoneCountryCode] = useState(DEFAULT_PHONE_COUNTRY_CODE);
  const [phoneLocal, setPhoneLocal] = useState("");
  const [country, setCountry] = useState<CountryCode>(DEFAULT_RESIDENCE_COUNTRY);
  const [du, setDu] = useState("");
  const { isSubmitting, error, submit } = useCompleteProfile();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    // DO/US comparten dialCode ("+1") — el <select> value es entry.code
    // (único por país), así que el dialCode real se busca acá recién al
    // enviar, no se guarda directo en el estado del select.
    const dialCode = PHONE_COUNTRY_CODES.find((entry) => entry.code === phoneCountryCode)?.dialCode ?? "";
    // Sin espacios/guiones que el usuario haya tipeado en el número local —
    // el backend espera el string en formato E.164-like, prefijo pegado
    // directo al número (ej. "+5511961234567", no "+55 11961234567").
    const sanitizedLocal = phoneLocal.replace(/[\s-]/g, "");
    submit(`${dialCode}${sanitizedLocal}`, country, du);
  }

  return (
    <Modal isOpen onClose={() => {}} dismissible={false} ariaLabel="Completar perfil">
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Completá tu perfil</h2>
        <p className={styles.subtitle}>
          Necesitamos tu celular y tu documento para que puedas operar con tu billetera.
        </p>

        <div className={styles.phoneRow}>
          <div className={styles.phoneField}>
            <label className={styles.label} htmlFor="profileDialCode">País del celular</label>
            <div className={styles.selectWrap}>
              <select
                id="profileDialCode"
                className={styles.select}
                value={phoneCountryCode}
                onChange={(event) => setPhoneCountryCode(event.target.value)}
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
              id="profilePhoneLocal"
              label="Celular"
              type="tel"
              size="lg"
              placeholder="11 96123-4567"
              value={phoneLocal}
              onChange={(event) => setPhoneLocal(event.target.value)}
              autoComplete="tel-national"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="profileCountry">País de residencia</label>
          <div className={styles.selectWrap}>
            <select
              id="profileCountry"
              className={styles.select}
              value={country}
              onChange={(event) => setCountry(event.target.value as CountryCode)}
            >
              {RESIDENCE_COUNTRY_CODES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.flag} {entry.label}
                </option>
              ))}
            </select>
            <span className={`msym ${styles.selectIcon}`} aria-hidden="true">expand_more</span>
          </div>
        </div>

        <Input
          id="profileDu"
          label="Documento"
          type="text"
          size="lg"
          placeholder="12345678"
          value={du}
          onChange={(event) => setDu(event.target.value)}
          autoComplete="off"
          icon="badge"
          pattern="[A-Za-z0-9]{5,15}"
          minLength={5}
          maxLength={15}
          required
        />

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className={styles.submitButton}>
          {isSubmitting ? "Guardando..." : "Completar perfil"}
        </Button>
      </form>
    </Modal>
  );
}
