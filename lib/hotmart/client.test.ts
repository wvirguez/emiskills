// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { clearTokenCache, getAccessToken } from "./auth";
import { getBaseUrl, listProductOffers, listProducts, MAX_PAGES } from "./client";
import {
  HotmartApiError,
  HotmartAuthError,
  HotmartNetworkError,
  HotmartRateLimitError,
  HotmartResponseError,
} from "./errors";
import type { HotmartEnv } from "../env";

const SECRET = "super-secreto";
const BASIC = "basic-token-xyz";
const env: HotmartEnv = {
  HOTMART_CLIENT_ID: "cid",
  HOTMART_CLIENT_SECRET: SECRET,
  HOTMART_BASIC_TOKEN: BASIC,
  HOTMART_ENV: "sandbox",
};
const sleep = vi.fn().mockResolvedValue(undefined);
const opts = { env, sleep };

const fetchMock = vi.fn();

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers });
}
const tokenRes = (token = "tok1", expires = 3600) => json({ access_token: token, expires_in: expires, token_type: "bearer" });
const rawProduct = (id: number) => ({
  id, ucode: `uc-${id}`, name: `P${id}`, status: "ACTIVE", format: "EBOOK",
  is_subscription: false, warranty_period: 7, created_at: 1586459699000,
});

beforeEach(() => {
  vi.resetAllMocks();
  sleep.mockResolvedValue(undefined);
  clearTokenCache();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("getAccessToken", () => {
  it("usa POST, client_credentials y Basic; cachea el token", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes());
    expect(await getAccessToken(env, { sleep })).toBe("tok1");
    expect(await getAccessToken(env, { sleep })).toBe("tok1");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/security/oauth/token");
    expect(String(url)).toContain("grant_type=client_credentials");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe(`Basic ${BASIC}`);
  });

  it("renueva al acercarse la expiración (margen 60 s)", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes("a", 100)).mockResolvedValueOnce(tokenRes("b", 100));
    let t = 0;
    const now = () => t;
    expect(await getAccessToken(env, { sleep, now })).toBe("a");
    t = 30_000;
    expect(await getAccessToken(env, { sleep, now })).toBe("a");
    t = 45_000; // quedan 55 s < 60 s
    expect(await getAccessToken(env, { sleep, now })).toBe("b");
  });

  it("respuesta de token inválida → HotmartResponseError", async () => {
    fetchMock.mockResolvedValueOnce(json({ foo: 1 }));
    await expect(getAccessToken(env, { sleep })).rejects.toBeInstanceOf(HotmartResponseError);
  });
});

describe("getBaseUrl", () => {
  it("sandbox y producción", () => {
    expect(getBaseUrl(env)).toBe("https://sandbox.hotmart.com");
    expect(getBaseUrl({ ...env, HOTMART_ENV: "production" })).toBe("https://developers.hotmart.com");
  });
});

describe("listProducts", () => {
  it("recorre 3 páginas siguiendo next_page_token y normaliza", async () => {
    fetchMock
      .mockResolvedValueOnce(tokenRes())
      .mockResolvedValueOnce(json({ items: [rawProduct(1)], page_info: { next_page_token: "t2" } }))
      .mockResolvedValueOnce(json({ items: [rawProduct(2)], page_info: { next_page_token: "t3" } }))
      .mockResolvedValueOnce(json({ items: [rawProduct(3)], page_info: { next_page_token: null } }));
    const products = await listProducts({ status: "ACTIVE" }, opts);
    expect(products.map((p) => p.id)).toEqual([1, 2, 3]);
    expect(products[0].createdAt).toEqual(new Date(1586459699000));
    expect(products[0].ucode).toBe("uc-1");
    const urls = fetchMock.mock.calls.slice(1).map((c) => String(c[0]));
    expect(urls[0]).toContain("https://sandbox.hotmart.com/products/api/v1/products?status=ACTIVE");
    expect(urls[1]).toContain("page_token=t2");
    expect(urls[2]).toContain("page_token=t3");
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer tok1");
  });

  it("status y format desconocidos no rompen", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes()).mockResolvedValueOnce(
      json({ items: [{ ...rawProduct(1), status: "NUEVO_ESTADO", format: "NUEVO_FORMATO" }] }),
    );
    const [p] = await listProducts({}, opts);
    expect(p.status).toBe("NUEVO_ESTADO");
    expect(p.format).toBe("NUEVO_FORMATO");
  });

  it("respeta el tope de páginas", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes());
    fetchMock.mockImplementation(async () => json({ items: [], page_info: { next_page_token: "x" } }));
    await expect(listProducts({}, opts)).rejects.toBeInstanceOf(HotmartResponseError);
    expect(fetchMock).toHaveBeenCalledTimes(1 + MAX_PAGES);
  });

  it("respuesta que no cumple el esquema → HotmartResponseError", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes()).mockResolvedValueOnce(json({ items: [{ id: "no-numero" }] }));
    await expect(listProducts({}, opts)).rejects.toBeInstanceOf(HotmartResponseError);
  });

  it("401 con token cacheado → renueva y reintenta una vez", async () => {
    fetchMock
      .mockResolvedValueOnce(tokenRes("viejo"))
      .mockResolvedValueOnce(new Response("{}", { status: 401 }))
      .mockResolvedValueOnce(tokenRes("nuevo"))
      .mockResolvedValueOnce(json({ items: [rawProduct(1)] }));
    expect(await listProducts({}, opts)).toHaveLength(1);
    expect(fetchMock.mock.calls[3][1].headers.Authorization).toBe("Bearer nuevo");
  });

  it("segundo 401 → HotmartAuthError", async () => {
    fetchMock
      .mockResolvedValueOnce(tokenRes("a"))
      .mockResolvedValueOnce(new Response("{}", { status: 401 }))
      .mockResolvedValueOnce(tokenRes("b"))
      .mockResolvedValueOnce(new Response("{}", { status: 401 }));
    await expect(listProducts({}, opts)).rejects.toBeInstanceOf(HotmartAuthError);
  });
});

describe("reintentos y errores", () => {
  it("429 se reintenta respetando Retry-After y luego lanza HotmartRateLimitError", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes());
    fetchMock.mockImplementation(async () => new Response("{}", { status: 429, headers: { "Retry-After": "2" } }));
    const err = await listProducts({}, opts).catch((e) => e);
    expect(err).toBeInstanceOf(HotmartRateLimitError);
    expect(err.retryAfter).toBe(2);
    expect(fetchMock).toHaveBeenCalledTimes(1 + 3);
    expect(sleep).toHaveBeenCalledWith(2000);
  });

  it("5xx se reintenta 3 veces y lanza HotmartApiError", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes());
    fetchMock.mockImplementation(async () => new Response("{}", { status: 503 }));
    const err = await listProducts({}, opts).catch((e) => e);
    expect(err).toBeInstanceOf(HotmartApiError);
    expect(err.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(1 + 3);
  });

  it("5xx que se recupera devuelve datos", async () => {
    fetchMock
      .mockResolvedValueOnce(tokenRes())
      .mockResolvedValueOnce(new Response("{}", { status: 500 }))
      .mockResolvedValueOnce(json({ items: [rawProduct(1)] }));
    expect(await listProducts({}, opts)).toHaveLength(1);
  });

  it.each([400, 403, 404])("%i no se reintenta", async (status) => {
    fetchMock.mockResolvedValueOnce(tokenRes()).mockResolvedValueOnce(new Response("{}", { status }));
    await expect(listProducts({}, opts)).rejects.toBeInstanceOf(status === 403 ? HotmartAuthError : HotmartApiError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fallo de red / timeout → HotmartNetworkError tras 3 intentos", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes());
    fetchMock.mockImplementation(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(listProducts({}, opts)).rejects.toBeInstanceOf(HotmartNetworkError);
    expect(fetchMock).toHaveBeenCalledTimes(1 + 3);
  });

  it("pasa una señal de timeout a fetch", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes()).mockResolvedValueOnce(json({ items: [] }));
    await listProducts({}, opts);
    expect(fetchMock.mock.calls[1][1].signal).toBeInstanceOf(AbortSignal);
  });

  it("ningún error contiene secretos ni tokens", async () => {
    const errors: Error[] = [];
    for (const status of [401, 403, 404, 429, 500]) {
      clearTokenCache();
      fetchMock.mockReset();
      fetchMock.mockResolvedValueOnce(tokenRes("tok-secreto"));
      fetchMock.mockImplementation(async () => new Response("{}", { status }));
      errors.push(await listProducts({}, opts).catch((e) => e));
    }
    fetchMock.mockReset();
    fetchMock.mockImplementation(async () => {
      throw new TypeError(`fetch failed ${SECRET}`);
    });
    clearTokenCache();
    errors.push(await listProducts({}, opts).catch((e) => e));
    for (const e of errors) {
      for (const s of [SECRET, BASIC, "tok-secreto"]) expect(String(e.message)).not.toContain(s);
    }
  });
});

describe("listProductOffers", () => {
  it("llama a /offers y mapea precio, moneda y enlace", async () => {
    fetchMock.mockResolvedValueOnce(tokenRes()).mockResolvedValueOnce(
      json({
        items: [
          {
            code: "02mhofjd", name: "", description: "", is_main_offer: true,
            price: { value: 10, currency_code: "BRL" }, payment_mode: "PAY_IN_FULL",
            direct_offer_link_for_creator: "https://pay.hotmart.com/A?off=02mhofjd",
          },
        ],
        page_info: { next_page_token: null },
      }),
    );
    const [offer] = await listProductOffers("abc-123", opts);
    expect(String(fetchMock.mock.calls[1][0])).toContain("/products/api/v1/products/abc-123/offers");
    expect(offer).toEqual({
      code: "02mhofjd", name: "", description: "", isMain: true,
      price: { value: 10, currency: "BRL" }, paymentMode: "PAY_IN_FULL",
      directOfferLink: "https://pay.hotmart.com/A?off=02mhofjd",
    });
  });
});
