import { useState } from "react";
import { updatePhone } from "../../shared/services/userService";

export function useUpdatePhone(initialPhone: string) {
  const [phone, setPhone] = useState(initialPhone);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialPhone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setDraft(phone);
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function save() {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await updatePhone(draft);
      setPhone(result.phone);
      setIsEditing(false);
    } catch {
      setError("No se pudo actualizar el celular. Intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { phone, isEditing, draft, setDraft, isSubmitting, error, startEditing, cancelEditing, save };
}
