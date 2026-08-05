import { useAuth } from "../../shared/auth/useAuth";
import { Button } from "../../shared/components/Button/Button";
import { Card } from "../../shared/components/Card/Card";
import { Input } from "../../shared/components/Input/Input";
import { useUpdatePhone } from "./useUpdatePhone";
import styles from "./Usuario.module.css";

export function Usuario() {
  const { user } = useAuth();
  const {
    phone,
    isEditing,
    draft,
    setDraft,
    isSubmitting,
    error,
    startEditing,
    cancelEditing,
    save,
  } = useUpdatePhone(user?.phone ?? "");

  const avatarInitial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : "?";

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <div className={styles.avatar}>{avatarInitial}</div>

        <div className={styles.field}>
          <span className={styles.label}>Correo electrónico</span>
          <span className={styles.value}>{user?.email}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Nombre</span>
          <span className={styles.value}>{user?.firstName}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Apellido</span>
          <span className={styles.value}>{user?.lastName}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Nro. de celular</span>
          {isEditing ? (
            <div className={styles.editForm}>
              <Input
                type="tel"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                autoComplete="tel"
              />
              <div className={styles.editActions}>
                <Button type="button" onClick={save} disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={cancelEditing}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className={styles.valueRow}>
              <span className={styles.value}>{phone || "Sin registrar"}</span>
              <button type="button" className={styles.editButton} onClick={startEditing}>
                Editar
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
