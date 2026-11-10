// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ dispatch: vi.fn(), revalidate: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("./webhook-events", () => ({ dispatchHotmartEvent: mocks.dispatch }));

import { handleHotmartWebhook, verifyHottok } from "./webhook";
import { POST } from "@/app/api/webhooks/hotmart/route";

const TOKEN = "secreto-hottok";

const req = (body: string, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/webhooks/hotmart", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
const ok = { "X-HOTMART-HOTTOK": TOKEN };

describe("verifyHottok", () => {
  it("acepta el token igual", () => expect(verifyHottok(TOKEN, TOKEN)).toBe(true));
  it("rechaza distinto, nulo, vacío o de otra longitud", () => {
    expect(verifyHottok("otro-token-xx", TOKEN)).toBe(false);
    expect(verifyHottok(null, TOKEN)).toBe(false);
    expect(verifyHottok("", TOKEN)).toBe(false);
    expect(verifyHottok("a", TOKEN)).toBe(false);
  });
});

describe("handleHotmartWebhook", () => {
  let info: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.stubEnv("HOTMART_HOTTOK", TOKEN);
    mocks.dispatch.mockReset().mockResolvedValue("ignored:evento_no_soportado");
    mocks.revalidate.mockReset();
    info = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("503 sin HOTMART_HOTTOK", async () => {
    vi.stubEnv("HOTMART_HOTTOK", "");
    const res = await handleHotmartWebhook(req("{}", ok));
    expect(res.status).toBe(503);
  });

  it("401 sin cabecera o con token incorrecto, sin consumir el cuerpo", async () => {
    const r1 = req('{"event":"X"}');
    expect((await handleHotmartWebhook(r1)).status).toBe(401);
    expect(r1.bodyUsed).toBe(false);
    const r2 = req('{"event":"X"}', { "X-HOTMART-HOTTOK": "mal" });
    expect((await handleHotmartWebhook(r2)).status).toBe(401);
    expect(r2.bodyUsed).toBe(false);
  });

  it("400 con JSON malformado o sin event", async () => {
    expect((await handleHotmartWebhook(req("no es json", ok))).status).toBe(400);
    expect((await handleHotmartWebhook(req('{"id":"1"}', ok))).status).toBe(400);
  });

  it("200 con evento conocido y desconocido", async () => {
    for (const event of ["PURCHASE_APPROVED", "ALGO_NUEVO"]) {
      const res = await handleHotmartWebhook(req(JSON.stringify({ event }), ok));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ received: true });
    }
  });

  it("no registra token ni datos del comprador", async () => {
    const body = JSON.stringify({
      id: "e1",
      event: "PURCHASE_APPROVED",
      data: { buyer: { email: "ana@example.com", name: "Ana" } },
    });
    await handleHotmartWebhook(req(body, ok));
    const logged = info.mock.calls.flat().join(" ");
    expect(logged).toContain("PURCHASE_APPROVED");
    expect(logged).not.toContain(TOKEN);
    expect(logged).not.toContain("ana@example.com");
    expect(logged).not.toContain("Ana");
  });

  it("500 si falla el procesamiento, sin filtrar el error", async () => {
    mocks.dispatch.mockRejectedValue(new Error("secreto-interno"));
    const res = await handleHotmartWebhook(req('{"event":"PRODUCT_UPDATE"}', ok));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "processing_failed" });
  });

  it("revalida solo cuando hubo cambios", async () => {
    mocks.dispatch.mockResolvedValue("updated");
    await handleHotmartWebhook(req('{"event":"PRODUCT_UPDATE"}', ok));
    expect(mocks.revalidate.mock.calls.map((c) => c[0])).toEqual(["/", "/productos", "/admin/productos"]);
    mocks.revalidate.mockClear();
    for (const r of ["unchanged", "ignored:producto_no_vinculado"]) {
      mocks.dispatch.mockResolvedValue(r);
      await handleHotmartWebhook(req('{"event":"PRODUCT_UPDATE"}', ok));
    }
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });

  it("pasa el evento y los datos al despachador", async () => {
    await handleHotmartWebhook(req('{"event":"PRODUCT_UPDATE","data":{"product":{"id":1}}}', ok));
    expect(mocks.dispatch).toHaveBeenCalledWith("PRODUCT_UPDATE", { product: { id: 1 } });
  });

  it("la ruta POST delega en el handler", async () => {
    const res = await POST(req('{"event":"X"}', ok));
    expect(res.status).toBe(200);
  });
});
