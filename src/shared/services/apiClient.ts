const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiFetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  // new Headers(headers) normaliza los 3 tipos válidos de HeadersInit (Headers,
  // string[][], Record<string,string>), a diferencia de un object-spread que solo
  // funciona bien con el último. `token` siempre gana sobre un Authorization manual.
  const mergedHeaders = new Headers(headers);
  // Solo forzar JSON si de verdad hay un body y no es FormData: si no, un GET sin
  // body dispara un preflight CORS de más, y con FormData rompemos el boundary
  // que el navegador tiene que setear solo.
  const hasJsonBody = rest.body !== undefined && !(rest.body instanceof FormData);
  if (hasJsonBody && !mergedHeaders.has("Content-Type")) {
    mergedHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    mergedHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: mergedHeaders,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error ?? "Ocurrió un error inesperado. Intentá de nuevo.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}
