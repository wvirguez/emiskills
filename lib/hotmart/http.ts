import {
  HotmartApiError,
  HotmartAuthError,
  HotmartNetworkError,
  HotmartRateLimitError,
  HotmartResponseError,
} from "./errors";

export const MAX_ATTEMPTS = 3;
export const REQUEST_TIMEOUT_MS = 10_000;
const BASE_DELAY_MS = 500;

export type FetchOptions = {
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  /** Pausa inyectable (tests). */
  sleep?: (ms: number) => Promise<void>;
};

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function parseRetryAfter(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Petición con timeout y reintentos acotados (429, 5xx y errores de red).
 * Devuelve el JSON de una respuesta 2xx. Nunca registra la URL ni las cabeceras.
 */
export async function hotmartFetch(url: string, options: FetchOptions = {}): Promise<unknown> {
  const sleep = options.sleep ?? defaultSleep;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method ?? "GET",
        headers: { "Content-Type": "application/json", ...options.headers },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch {
      lastError = new HotmartNetworkError("No se pudo conectar con la API de Hotmart (red o tiempo de espera agotado)");
      if (attempt < MAX_ATTEMPTS) await sleep(BASE_DELAY_MS * 2 ** (attempt - 1));
      continue;
    }

    if (response.ok) {
      try {
        return await response.json();
      } catch {
        throw new HotmartResponseError("La API de Hotmart devolvió una respuesta que no es JSON válido");
      }
    }

    const { status } = response;
    if (status === 401) throw new HotmartAuthError("Hotmart rechazó las credenciales o el token (401)", 401);
    if (status === 429) {
      const retryAfter = parseRetryAfter(response.headers.get("Retry-After"));
      lastError = new HotmartRateLimitError("Hotmart aplicó límite de peticiones (429)", retryAfter);
      if (attempt < MAX_ATTEMPTS) {
        await sleep(retryAfter != null ? retryAfter * 1000 : BASE_DELAY_MS * 2 ** (attempt - 1));
      }
      continue;
    }
    if (status >= 500) {
      lastError = new HotmartApiError(`Hotmart respondió con error del servidor (${status})`, status);
      if (attempt < MAX_ATTEMPTS) await sleep(BASE_DELAY_MS * 2 ** (attempt - 1));
      continue;
    }
    if (status === 403) throw new HotmartAuthError("Hotmart denegó el acceso (403): revisa los permisos de la credencial", 403);
    throw new HotmartApiError(`Hotmart respondió con error (${status})`, status);
  }

  throw lastError ?? new HotmartNetworkError("Error desconocido al llamar a Hotmart");
}
