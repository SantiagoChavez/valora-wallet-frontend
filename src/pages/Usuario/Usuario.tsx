import { useAuth } from "../../shared/auth/useAuth";
import { Button } from "../../shared/components/Button/Button";
import { Card } from "../../shared/components/Card/Card";
import { Input } from "../../shared/components/Input/Input";
import { updateDu, updatePhone } from "../../shared/services/userService";
import { updateAlias } from "../../shared/services/walletService";
import { useEditableField } from "./useEditableField";
import styles from "./Usuario.module.css";

// Sin concepto de "estado de cuenta" en el backend (no hay suspensión,
// verificación pendiente, etc. en el modelo real) — no es un dato mockeado
// esperando conectarse, es una etiqueta fija: cualquier cuenta que llegue a
// ver esta página, por definición, ya está activa.
const ACCOUNT_STATUS_LABEL = "Activa";

export function Usuario() {
  const { user, wallet, token, updateWallet } = useAuth();
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
  );

  const {
    value: du,
    isEditing: isEditingDu,
    draft: duDraft,
    setDraft: setDuDraft,
    isSubmitting: isSubmittingDu,
    error: duError,
    startEditing: startEditingDu,
    cancelEditing: cancelEditingDu,
    save: saveDu,
  } = useEditableField(
    user?.du ?? "",
    (draft) => updateDu(draft).then((result) => result.du),
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
    wallet?.alias ?? "",
    (draft) => updateAlias(token as string, draft).then((updated) => {
      // Sin esto, el alias nuevo solo se ve en el estado local de este hook —
      // el resto de la app (y un refresh, que relee sessionStorage) seguiría
      // mostrando el viejo hasta el próximo login.
      updateWallet(updated);
      return updated.alias;
    }),
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
          <label className={styles.label} htmlFor="du">Documento</label>
          {isEditingDu ? (
            <div className={styles.editForm}>
              <Input
                id="du"
                type="text"
                value={duDraft}
                onChange={(event) => setDuDraft(event.target.value)}
                autoComplete="off"
              />
              <div className={styles.editActions}>
                <Button type="button" onClick={saveDu} disabled={isSubmittingDu}>
                  {isSubmittingDu ? "Guardando..." : "Guardar"}
                </Button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={cancelEditingDu}
                  disabled={isSubmittingDu}
                >
                  Cancelar
                </button>
              </div>
              {duError && (
                <p className={styles.error} role="alert">
                  {duError}
                </p>
              )}
            </div>
          ) : (
            <div className={styles.valueRow}>
              <span className={styles.value}>{du || "Sin registrar"}</span>
              <button type="button" className={styles.editButton} onClick={startEditingDu}>
                Editar
              </button>
            </div>
          )}
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
          <span className={styles.value}>{wallet?.cvu ?? "Sin datos"}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Estado</span>
          <span className={styles.value}>{ACCOUNT_STATUS_LABEL}</span>
        </div>
      </Card>
    </div>
  );
}
