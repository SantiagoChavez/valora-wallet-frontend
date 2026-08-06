const rawApiBaseUrl = import.meta.env.VITE_API_URL;
const MISSING_URL_MESSAGE = "VITE_API_URL no está configurada — revisá tu .env/.env.local.";

if (!rawApiBaseUrl) {
  // No tirar acá: esto corre al importar el módulo, y sin ErrorBoundary deja la
  // app en blanco antes de que se intente ningún request. Se valida de nuevo,
  // y recién ahí se lanza, dentro de apiFetch.
  console.error(MISSING_URL_MESSAGE);
}
// sin esto, una URL con "/" final + un path que arranca con "/" queda con "//".
const API_BASE_URL = (rawApiBaseUrl ?? "").replace(/\/$/, "");

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

async function parseJsonSafely(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }
  const contentType = response.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined;
  }
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  if (!rawApiBaseUrl) {
    throw new ApiError(MISSING_URL_MESSAGE, 0);
  }

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

  // si el caller pasa el path sin "/" inicial (ej. "auth/login"), la URL queda
  // pegada al dominio sin separador ("...comauth/login") — se normaliza acá.
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...rest,
    headers: mergedHeaders,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const message = (data as { error?: string } | undefined)?.error ?? "Ocurrió un error inesperado. Intentá de nuevo.";
    throw new ApiError(message, response.status);
  }

  return data as T;
}
