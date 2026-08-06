import { useAuth } from "../../shared/auth/useAuth";
import { Button } from "../../shared/components/Button/Button";
import { Card } from "../../shared/components/Card/Card";
import { Input } from "../../shared/components/Input/Input";
import { updateAlias, updatePhone } from "../../shared/services/userService";
import { useEditableField } from "./useEditableField";
import styles from "./Usuario.module.css";

const MOCK_ALIAS = "valora.usuario.123";
const MOCK_CVU = "0000003100094817143312";
const MOCK_DOCUMENT_NUMBER = "30.123.456";
const MOCK_STATUS = "Activa";

export function Usuario() {
  const { user } = useAuth();
  const {
    value: phone,
    isEditing: isEditingPhone,
    draft: phoneDraft,
    setDraft: setPhoneDraft,
    isSubmitting: isSubmittingPhone,
    error: phoneError,
    startEditing: startEditingPhone,
    cancelEditing: cancelEditingPhone,
    save: savePhone,
  } = useEditableField(
    user?.phone ?? "",
    (draft) => updatePhone(draft).then((result) => result.phone),
    "No se pudo actualizar el celular. Intentá de nuevo.",
  );

  const {
    value: alias,
    isEditing: isEditingAlias,
    draft: aliasDraft,
    setDraft: setAliasDraft,
    isSubmitting: isSubmittingAlias,
    error: aliasError,
    startEditing: startEditingAlias,
    cancelEditing: cancelEditingAlias,
    save: saveAlias,
  } = useEditableField(
    MOCK_ALIAS,
    (draft) => updateAlias(draft).then((result) => result.alias),
    "No se pudo actualizar el alias. Intentá de nuevo.",
  );

  const avatarInitial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.avatar}>{avatarInitial}</div>

        <div className={styles.field}>
          <span className={styles.label}>Correo electrónico</span>
          <span className={styles.value}>{user?.email || "Sin datos"}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Nombre</span>
          <span className={styles.value}>{user?.firstName || "Sin datos"}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Apellido</span>
          <span className={styles.value}>{user?.lastName || "Sin datos"}</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">Nro. de celular</label>
          {isEditingPhone ? (
            <div className={styles.editForm}>
              <Input
                id="phone"
                type="tel"
                value={phoneDraft}
                onChange={(event) => setPhoneDraft(event.target.value)}
                autoComplete="tel"
              />
              <div className={styles.editActions}>
                <Button type="button" onClick={savePhone} disabled={isSubmittingPhone}>
                  {isSubmittingPhone ? "Guardando..." : "Guardar"}
                </Button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={cancelEditingPhone}
                  disabled={isSubmittingPhone}
                >
                  Cancelar
                </button>
              </div>
              {phoneError && (
                <p className={styles.error} role="alert">
                  {phoneError}
                </p>
              )}
            </div>
          ) : (
            <div className={styles.valueRow}>
              <span className={styles.value}>{phone || "Sin registrar"}</span>
              <button type="button" className={styles.editButton} onClick={startEditingPhone}>
                Editar
              </button>
            </div>
          )}
        </div>
      </Card>

      <Card className={styles.card}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="alias">Alias</label>
          {isEditingAlias ? (
            <div className={styles.editForm}>
              <Input
                id="alias"
                type="text"
                value={aliasDraft}
                onChange={(event) => setAliasDraft(event.target.value)}
                autoComplete="off"
              />
              <div className={styles.editActions}>
                <Button type="button" onClick={saveAlias} disabled={isSubmittingAlias}>
                  {isSubmittingAlias ? "Guardando..." : "Guardar"}
                </Button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={cancelEditingAlias}
                  disabled={isSubmittingAlias}
                >
                  Cancelar
                </button>
              </div>
              {aliasError && (
                <p className={styles.error} role="alert">
                  {aliasError}
                </p>
              )}
            </div>
          ) : (
            <div className={styles.valueRow}>
              <span className={styles.value}>{alias || "Sin registrar"}</span>
              <button type="button" className={styles.editButton} onClick={startEditingAlias}>
                Editar
              </button>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>CVU</span>
          <span className={styles.value}>{MOCK_CVU}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Documento</span>
          <span className={styles.value}>{user?.documentNumber ?? MOCK_DOCUMENT_NUMBER}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Estado</span>
          <span className={styles.value}>{MOCK_STATUS}</span>
        </div>
      </Card>
    </div>
  );
}
