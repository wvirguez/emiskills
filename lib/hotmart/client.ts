import { z } from "zod";
import { getHotmartEnv, type HotmartEnv } from "../env";
import { clearTokenCache, getAccessToken } from "./auth";
import { HotmartAuthError, HotmartResponseError } from "./errors";
import { hotmartFetch, type FetchOptions } from "./http";
import {
  offersPageSchema,
  productsPageSchema,
  toOffer,
  toProduct,
  type HotmartOffer,
  type HotmartProduct,
} from "./schemas";

export const API_BASES = {
  production: "https://developers.hotmart.com",
  sandbox: "https://sandbox.hotmart.com",
} as const;

export const MAX_PAGES = 50;

export type ClientOptions = Pick<FetchOptions, "sleep"> & { env?: HotmartEnv };

export function getBaseUrl(env: HotmartEnv): string {
  return API_BASES[env.HOTMART_ENV];
}

/** GET autenticado; si el token cacheado fue rechazado (401) lo renueva y reintenta una vez. */
async function authedGet(path: string, params: URLSearchParams, options: ClientOptions): Promise<unknown> {
  const env = options.env ?? getHotmartEnv();
  const url = `${getBaseUrl(env)}${path}${params.size ? `?${params}` : ""}`;
  const call = async () =>
    hotmartFetch(url, {
      headers: { Authorization: `Bearer ${await getAccessToken(env, { sleep: options.sleep })}` },
      sleep: options.sleep,
    });
  try {
    return await call();
  } catch (error) {
    if (error instanceof HotmartAuthError && error.status === 401) {
      clearTokenCache();
      return call();
    }
    throw error;
  }
}

async function fetchAllPages<S extends z.ZodType<{ items: unknown[]; page_info?: { next_page_token?: string | null } | null }>>(
  path: string,
  baseParams: Record<string, string | undefined>,
  schema: S,
  options: ClientOptions,
): Promise<z.output<S>["items"]> {
  const all: z.output<S>["items"] = [];
  let pageToken: string | null | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(baseParams)) if (v) params.set(k, v);
    if (pageToken) params.set("page_token", pageToken);
    const parsed = schema.safeParse(await authedGet(path, params, options));
    if (!parsed.success) throw new HotmartResponseError("La respuesta de Hotmart no tiene el formato esperado");
    all.push(...parsed.data.items);
    pageToken = parsed.data.page_info?.next_page_token;
    if (!pageToken) return all;
  }
  throw new HotmartResponseError(`Se superó el máximo de ${MAX_PAGES} páginas al leer Hotmart`);
}

export async function listProducts(
  filters: { status?: string; format?: string } = {},
  options: ClientOptions = {},
): Promise<HotmartProduct[]> {
  const items = await fetchAllPages("/products/api/v1/products", filters, productsPageSchema, options);
  return items.map(toProduct);
}

export async function listProductOffers(ucode: string, options: ClientOptions = {}): Promise<HotmartOffer[]> {
  const items = await fetchAllPages(
    `/products/api/v1/products/${encodeURIComponent(ucode)}/offers`,
    {},
    offersPageSchema,
    options,
  );
  return items.map(toOffer);
}
