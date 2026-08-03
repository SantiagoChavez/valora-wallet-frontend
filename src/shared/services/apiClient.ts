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

  const mergedHeaders = new Headers({ "Content-Type": "application/json" });
  if (token) {
    mergedHeaders.set("Authorization", `Bearer ${token}`);
  }
  // new Headers(headers) normaliza los 3 tipos válidos de HeadersInit (Headers,
  // string[][], Record<string,string>) antes de mergear, a diferencia de un
  // object-spread que solo funciona bien con el último.
  new Headers(headers).forEach((value, key) => {
    mergedHeaders.set(key, value);
  });

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
