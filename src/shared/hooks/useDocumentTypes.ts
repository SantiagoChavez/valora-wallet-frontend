import { useEffect, useState } from "react";
import { getDocumentTypes } from "../services/catalogService";
import type { CountryCode } from "../types/models";

// null mientras no resolvió o si falló — cada consumidor cae al label
// genérico "Documento" en cualquiera de los dos casos (ver documentLabel en
// CompleteProfileModal/Registro.tsx/Usuario.tsx), sin bloquear la UI por un
// catálogo que no cargó.
export function useDocumentTypes(): Record<CountryCode, string> | null {
  const [documentTypes, setDocumentTypes] = useState<Record<CountryCode, string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDocumentTypes()
      .then((data) => {
        if (!cancelled) setDocumentTypes(data);
      })
      .catch(() => {
        // Silencioso a propósito: el fallback a "Documento" ya cubre el caso.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return documentTypes;
}
