// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  productFindMany: vi.fn(),
  productFindFirst: vi.fn(),
  productCount: vi.fn(),
  categoryFindMany: vi.fn(),
  platformFindMany: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    product: {
      findMany: mocks.productFindMany,
      findFirst: mocks.productFindFirst,
      count: mocks.productCount,
    },
    category: { findMany: mocks.categoryFindMany },
    platform: { findMany: mocks.platformFindMany },
  },
}));

import {
  getCategories,
  getPlatforms,
  getProductBySlug,
  getProducts,
} from "@/lib/products";

const row = {
  id: 1,
  slug: "curso-a",
  title: "Curso A",
  shortDescription: "Corta",
  description: null,
  price: { toString: () => "19.90", valueOf: () => 19.9 },
  currency: "USD",
  language: "es",
  imageUrl: null,
  imageGradient: null,
  affiliateUrl: "https://example.com/x",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { slug: "cursos", name: "Cursos", id: 9 },
  platform: { slug: "hotmart", name: "Hotmart", id: 8 },
};

beforeEach(() => {
  vi.resetAllMocks();
  mocks.productFindMany.mockResolvedValue([row]);
  mocks.productCount.mockResolvedValue(30);
});

describe("getProducts", () => {
  it("usa valores por defecto", async () => {
    const res = await getProducts();
    const args = mocks.productFindMany.mock.calls[0][0];
    expect(args.skip).toBe(0);
    expect(args.take).toBe(12);
    expect(args.where).toEqual({ isActive: true });
    expect(args.orderBy).toEqual([{ createdAt: "desc" }, { id: "desc" }]);
    expect(res).toMatchObject({ page: 1, pageSize: 12, total: 30, totalPages: 3 });
  });

  it("pagina con page y pageSize", async () => {
    const res = await getProducts({ page: 2, pageSize: 5 });
    const args = mocks.productFindMany.mock.calls[0][0];
    expect(args.skip).toBe(5);
    expect(args.take).toBe(5);
    expect(res.totalPages).toBe(6);
  });

  it.each([
    [{ page: 0 }, 1, 12],
    [{ page: Number.NaN }, 1, 12],
    [{ pageSize: 999 }, 1, 12],
    [{ pageSize: 0 }, 1, 12],
    [{ page: 1.5, pageSize: 2.5 }, 1, 12],
  ])("normaliza parámetros inválidos %j", async (params, page, pageSize) => {
    const res = await getProducts(params);
    expect(res.page).toBe(page);
    expect(res.pageSize).toBe(pageSize);
  });

  it("página fuera de rango devuelve items vacíos y total correcto", async () => {
    mocks.productFindMany.mockResolvedValue([]);
    const res = await getProducts({ page: 99 });
    expect(res.items).toEqual([]);
    expect(res.total).toBe(30);
  });

  it("mapea a DTO sin campos internos", async () => {
    const { items } = await getProducts();
    expect(typeof items[0].price).toBe("number");
    expect(items[0].price).toBe(19.9);
    expect(items[0].category).toEqual({ slug: "cursos", name: "Cursos" });
    for (const key of ["affiliateUrl", "isActive", "createdAt", "updatedAt"]) {
      expect(items[0]).not.toHaveProperty(key);
    }
  });
});

describe("getProductBySlug", () => {
  it("devuelve el DTO y filtra por activo", async () => {
    mocks.productFindFirst.mockResolvedValue(row);
    const res = await getProductBySlug("curso-a");
    expect(res?.slug).toBe("curso-a");
    expect(mocks.productFindFirst.mock.calls[0][0].where).toEqual({
      slug: "curso-a",
      isActive: true,
    });
  });

  it("devuelve null si no existe", async () => {
    mocks.productFindFirst.mockResolvedValue(null);
    expect(await getProductBySlug("nada")).toBeNull();
  });

  it("devuelve null con slug vacío sin consultar", async () => {
    expect(await getProductBySlug("")).toBeNull();
    expect(mocks.productFindFirst).not.toHaveBeenCalled();
  });
});

describe("getCategories / getPlatforms", () => {
  it("ordenan por nombre", async () => {
    mocks.categoryFindMany.mockResolvedValue([{ id: 1, slug: "a", name: "A" }]);
    mocks.platformFindMany.mockResolvedValue([{ id: 1, slug: "h", name: "H" }]);
    expect(await getCategories()).toHaveLength(1);
    expect(await getPlatforms()).toHaveLength(1);
    expect(mocks.categoryFindMany.mock.calls[0][0].orderBy).toEqual({ name: "asc" });
    expect(mocks.platformFindMany.mock.calls[0][0].orderBy).toEqual({ name: "asc" });
  });
});
