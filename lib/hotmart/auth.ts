import { getHotmartEnv, type HotmartEnv } from "../env";
import { HotmartResponseError } from "./errors";
import { hotmartFetch, type FetchOptions } from "./http";
import { tokenResponseSchema } from "./schemas";

/** Host del token OAuth. TODO(verificación manual): confirmar el host para sandbox. */
export const TOKEN_HOSTS = {
  production: "https://api-sec-vlc.hotmart.com",
  sandbox: "https://api-sec-vlc.hotmart.com",
} as const;

const EXPIRY_MARGIN_MS = 60_000;

let cache: { token: string; expiresAt: number } | undefined;

export function clearTokenCache(): void {
  cache = undefined;
}

export async function getAccessToken(
  env: HotmartEnv = getHotmartEnv(),
  options: Pick<FetchOptions, "sleep"> & { now?: () => number } = {},
): Promise<string> {
  const now = (options.now ?? Date.now)();
  if (cache && cache.expiresAt - EXPIRY_MARGIN_MS > now) return cache.token;

  const query = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.HOTMART_CLIENT_ID,
    client_secret: env.HOTMART_CLIENT_SECRET,
  });
  const json = await hotmartFetch(`${TOKEN_HOSTS[env.HOTMART_ENV]}/security/oauth/token?${query}`, {
    method: "POST",
    headers: { Authorization: `Basic ${env.HOTMART_BASIC_TOKEN}` },
    sleep: options.sleep,
  });
  const parsed = tokenResponseSchema.safeParse(json);
  if (!parsed.success) throw new HotmartResponseError("La respuesta de autenticación de Hotmart no tiene el formato esperado");

  cache = { token: parsed.data.access_token, expiresAt: now + parsed.data.expires_in * 1000 };
  return cache.token;
}
