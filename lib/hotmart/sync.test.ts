// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  platformUpsert: vi.fn(),
  categoryUpsert: vi.fn(),
  categoryFindMany: vi.fn(),
  productFindMany: vi.fn(),
  productCreate: vi.fn(),
  productUpdate: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
  db: {
    platform: { upsert: mocks.platformUpsert },
    category: { upsert: mocks.categoryUpsert, findMany: mocks.categoryFindMany },
    product: { findMany: mocks.productFindMany, create: mocks.productCreate, update: mocks.productUpdate },
  },
}));

import { SyncInProgressError, syncHotmartProducts, type SyncClient } from "./sync";
import type { HotmartOffer, HotmartProduct } from "./schemas";

const hp = (id: number, over: Partial<HotmartProduct> = {}): HotmartProduct => ({
  id, ucode: `uc-${id}`, name: `Producto ${id}`, status: "ACTIVE", format: "ONLINE_COURSE",
  isSubscription: false, warrantyPeriod: 7, createdAt: null, ...over,
});
const ho = (over: Partial<HotmartOffer> = {}): HotmartOffer => ({
  code: "o1", name: "", description: "", isMain: true,
  price: { value: 10, currency: "BRL" }, paymentMode: "PAY_IN_FULL",
  directOfferLink: "https://pay.hotmart.com/X?off=o1", ...over,
});

function client(products: HotmartProduct[], offers: Record<number, HotmartOffer[] | Error> = {}): SyncClient {
  return {
    listProducts: vi.fn().mockResolvedValue(products),
    listProductOffers: vi.fn(async (ucode: string) => {
      const id = Number(ucode.replace("uc-", ""));
      const o = offers[id] ?? [ho()];
      if (o instanceof Error) throw o;
      return o;
    }),
  };
}

const linkedRow = (over: Record<string, unknown> = {}) => ({
  id: 100, externalId: "1", title: "Producto 1", price: "10", currency: "BRL", externalUcode: "uc-1", isActive: true, ...over,
});

beforeEach(() => {
  vi.resetAllMocks();
  mocks.platformUpsert.mockResolvedValue({ id: 1 });
  mocks.categoryUpsert.mockResolvedValue({ id: 99 });
  mocks.categoryFindMany.mockResolvedValue([
    { id: 10, slug: "curso" }, { id: 11, slug: "ebook" }, { id: 99, slug: "sin-categoria" },
  ]);
  // 1.ª llamada: vinculados; 2.ª: slugs
  mocks.productFindMany.mockImplementation(async (args: { where?: unknown }) => (args?.where ? [] : []));
  mocks.productCreate.mockResolvedValue({});
  mocks.productUpdate.mockResolvedValue({});
});

function setLinked(rows: unknown[], slugs: string[] = []) {
  mocks.productFindMany.mockImplementation(async (args: { where?: unknown }) =>
    args?.where ? rows : slugs.map((slug) => ({ slug })),
  );
}

describe("syncHotmartProducts", () => {
  it("crea un producto nuevo inactivo con needsReview", async () => {
    const r = await syncHotmartProducts(client([hp(1)]));
    expect(r).toMatchObject({ created: 1, updated: 0, deactivated: 0 });
    const data = mocks.productCreate.mock.calls[0][0].data;
    expect(data).toMatchObject({
      isActive: false, needsReview: true, platformId: 1, categoryId: 10,
      externalId: "1", externalUcode: "uc-1", affiliateUrl: "https://pay.hotmart.com/X?off=o1",
      price: 10, currency: "BRL", title: "Producto 1", slug: "producto-1", language: "es",
    });
  });

  it("formato desconocido → Sin categoría", async () => {
    await syncHotmartProducts(client([hp(1, { format: "SOFTWARE" })]));
    expect(mocks.productCreate.mock.calls[0][0].data.categoryId).toBe(99);
  });

  it("colisión de slug añade el id", async () => {
    setLinked([], ["producto-1"]);
    await syncHotmartProducts(client([hp(1)]));
    expect(mocks.productCreate.mock.calls[0][0].data.slug).toBe("producto-1-1");
  });

  it("actualiza solo título, precio, moneda, ucode y syncedAt", async () => {
    setLinked([linkedRow({ title: "Viejo", price: "5" })]);
    const r = await syncHotmartProducts(client([hp(1)]));
    expect(r.updated).toBe(1);
    const { where, data } = mocks.productUpdate.mock.calls[0][0];
    expect(where).toEqual({ id: 100 });
    expect(Object.keys(data).sort()).toEqual(["currency", "externalUcode", "price", "syncedAt", "title"]);
    expect(data).toMatchObject({ title: "Producto 1", price: 10, currency: "BRL" });
  });

  it("sin cambios no escribe (idempotente)", async () => {
    setLinked([linkedRow()]);
    const r = await syncHotmartProducts(client([hp(1)]));
    expect(r).toMatchObject({ created: 0, updated: 0, deactivated: 0, unchanged: 1 });
    expect(mocks.productUpdate).not.toHaveBeenCalled();
    expect(mocks.productCreate).not.toHaveBeenCalled();
  });

  it("desactiva vinculados no ACTIVE en Hotmart", async () => {
    setLinked([linkedRow()]);
    const r = await syncHotmartProducts(client([hp(1, { status: "PAUSED" })]));
    expect(r.deactivated).toBe(1);
    expect(mocks.productUpdate.mock.calls[0][0].data.isActive).toBe(false);
  });

  it("desactiva vinculados ausentes de la lista", async () => {
    setLinked([linkedRow({ externalId: "5", id: 105 })]);
    const r = await syncHotmartProducts(client([]));
    expect(r.deactivated).toBe(1);
    expect(mocks.productUpdate.mock.calls[0][0].where).toEqual({ id: 105 });
  });

  it("no reactiva ni cuenta uno ya inactivo que sigue ausente o pausado", async () => {
    setLinked([linkedRow({ isActive: false }), linkedRow({ id: 105, externalId: "5", isActive: false })]);
    const r = await syncHotmartProducts(client([hp(1, { status: "PAUSED" })]));
    expect(r.deactivated).toBe(0);
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });

  it("un producto vinculado inactivo que vuelve a ACTIVE no se reactiva", async () => {
    setLinked([linkedRow({ isActive: false, title: "Viejo" })]);
    await syncHotmartProducts(client([hp(1)]));
    expect(mocks.productUpdate.mock.calls[0][0].data).not.toHaveProperty("isActive");
  });

  it("omite sin ofertas, moneda no soportada y sin enlace", async () => {
    const r = await syncHotmartProducts(
      client([hp(1), hp(2), hp(3)], {
        1: [],
        2: [ho({ price: { value: 5, currency: "JPY" } })],
        3: [ho({ directOfferLink: null })],
      }),
    );
    expect(r.created).toBe(0);
    expect(r.skipped.map((s) => s.id)).toEqual([1, 2, 3]);
    expect(r.skipped[1].reason).toContain("JPY");
    expect(mocks.productCreate).not.toHaveBeenCalled();
  });

  it("solo lee productos vinculados (manuales nunca se tocan)", async () => {
    await syncHotmartProducts(client([]));
    const where = mocks.productFindMany.mock.calls[0][0].where;
    expect(where).toEqual({ externalId: { not: null } });
  });

  it("si Hotmart falla al listar, no escribe nada", async () => {
    const failing: SyncClient = {
      listProducts: vi.fn().mockRejectedValue(new Error("Hotmart caído")),
      listProductOffers: vi.fn(),
    };
    await expect(syncHotmartProducts(failing)).rejects.toThrow("Hotmart caído");
    expect(mocks.platformUpsert).not.toHaveBeenCalled();
    expect(mocks.productCreate).not.toHaveBeenCalled();
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });

  it("el fallo de un producto no detiene a los demás", async () => {
    const r = await syncHotmartProducts(client([hp(1), hp(2)], { 1: new Error("boom") }));
    expect(r.errors).toEqual([{ id: 1, message: "boom" }]);
    expect(r.created).toBe(1);
  });

  it("candado: una segunda sync concurrente falla y luego se libera", async () => {
    let release: (v: HotmartProduct[]) => void = () => {};
    const slow: SyncClient = {
      listProducts: () => new Promise((res) => (release = res)),
      listProductOffers: vi.fn(),
    };
    const first = syncHotmartProducts(slow);
    await expect(syncHotmartProducts(client([]))).rejects.toBeInstanceOf(SyncInProgressError);
    release([]);
    await first;
    await expect(syncHotmartProducts(client([]))).resolves.toBeDefined();
  });
});
