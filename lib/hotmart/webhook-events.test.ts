// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ findUnique: vi.fn(), update: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({ db: { product: { findUnique: mocks.findUnique, update: mocks.update } } }));

import { dispatchHotmartEvent, sanitizeTitle } from "./webhook-events";

const row = { id: 7, title: "Viejo", externalUcode: "u-old", isActive: true };
const ev = (product: Record<string, unknown>) => ({ product });

beforeEach(() => {
  vi.resetAllMocks();
  mocks.findUnique.mockResolvedValue(row);
  mocks.update.mockResolvedValue({});
});

describe("sanitizeTitle", () => {
  it("recorta, limita a 200 y descarta vacíos", () => {
    expect(sanitizeTitle("  Hola  ")).toBe("Hola");
    expect(sanitizeTitle("a".repeat(300))).toHaveLength(200);
    expect(sanitizeTitle("   ")).toBeUndefined();
    expect(sanitizeTitle(undefined)).toBeUndefined();
  });
});

describe("dispatchHotmartEvent", () => {
  it("PRODUCT_UPDATE ACTIVE actualiza solo título, ucode y syncedAt", async () => {
    const r = await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 123, name: "Nuevo", ucode: "u-new", status: "ACTIVE" }));
    expect(r).toBe("updated");
    expect(mocks.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { externalId: "123" } }));
    const { where, data } = mocks.update.mock.calls[0][0];
    expect(where).toEqual({ id: 7 });
    expect(Object.keys(data).sort()).toEqual(["externalUcode", "syncedAt", "title"]);
    expect(data.title).toBe("Nuevo");
  });

  it("acepta id como texto numérico", async () => {
    await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: "123", name: "X" }));
    expect(mocks.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { externalId: "123" } }));
  });

  it("estado distinto de ACTIVE desactiva", async () => {
    const r = await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 1, status: "INACTIVE" }));
    expect(r).toBe("deactivated");
    expect(mocks.update.mock.calls[0][0].data.isActive).toBe(false);
  });

  it("nunca reactiva: ACTIVE no envía isActive", async () => {
    mocks.findUnique.mockResolvedValue({ ...row, isActive: false });
    await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 1, status: "ACTIVE", name: "Otro" }));
    expect(mocks.update.mock.calls[0][0].data).not.toHaveProperty("isActive");
  });

  it("producto ya inactivo con estado no ACTIVE no cambia isActive", async () => {
    mocks.findUnique.mockResolvedValue({ ...row, isActive: false });
    const r = await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 1, status: "INACTIVE" }));
    expect(r).toBe("unchanged");
    expect(mocks.update.mock.calls[0][0].data).not.toHaveProperty("isActive");
  });

  it("mismos valores → unchanged (idempotente)", async () => {
    const r = await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 1, name: "Viejo", ucode: "u-old", status: "ACTIVE" }));
    expect(r).toBe("unchanged");
  });

  it("no toca affiliateUrl, descripción, categoría, needsReview, precio ni moneda", async () => {
    await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 1, name: "N", status: "INACTIVE", price: 5, affiliateUrl: "x" }));
    const data = mocks.update.mock.calls[0][0].data;
    for (const k of ["affiliateUrl", "description", "categoryId", "needsReview", "price", "currency"]) {
      expect(data).not.toHaveProperty(k);
    }
  });

  it("producto sin vínculo o manual → ignora sin escribir", async () => {
    mocks.findUnique.mockResolvedValue(null);
    const r = await dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 999 }));
    expect(r).toBe("ignored:producto_no_vinculado");
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it.each([{}, ev({}), ev({ id: "abc" }), ev({ id: -1 }), undefined])("payload inválido %#", async (d) => {
    expect(await dispatchHotmartEvent("PRODUCT_UPDATE", d)).toBe("ignored:payload_invalido");
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });

  it.each(["PURCHASE_APPROVED", "PURCHASE_REFUNDED", "SUBSCRIPTION_CANCELLATION", "ALGO_NUEVO"])(
    "%s no escribe",
    async (event) => {
      expect(await dispatchHotmartEvent(event, ev({ id: 1 }))).toBe("ignored:evento_no_soportado");
      expect(mocks.findUnique).not.toHaveBeenCalled();
      expect(mocks.update).not.toHaveBeenCalled();
    }
  );

  it("propaga errores de la BD", async () => {
    mocks.findUnique.mockRejectedValue(new Error("db down"));
    await expect(dispatchHotmartEvent("PRODUCT_UPDATE", ev({ id: 1 }))).rejects.toThrow("db down");
  });
});
