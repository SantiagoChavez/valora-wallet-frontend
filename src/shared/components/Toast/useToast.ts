import { useEffect, useRef, useState } from "react";

export const TOAST_DURATION_MS = 2200;

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function showToast(text: string) {
    clearTimeout(timerRef.current);
    setMessage(text);
    timerRef.current = setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }

  return { message, showToast };
}
