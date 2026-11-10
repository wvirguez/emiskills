// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  count: vi.fn(),
  groupBy: vi.fn(),
  productFindMany: vi.fn(),
  categoryFindMany: vi.fn(),
  queryRaw: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => ({
  db: {
    click: { count: mocks.count, groupBy: mocks.groupBy },
    product: { findMany: mocks.productFindMany },
    category: { findMany: mocks.categoryFindMany },
    $queryRaw: mocks.queryRaw,
  },
}));

import {
  getClickTotals,
  getClicksByCategory,
  getClicksByDay,
  getClicksByProduct,
  getRangeStart,
  parseRange,
} from "@/lib/click-metrics";

const NOW = new Date("2026-11-09T15:30:00Z");

beforeEach(() => {
  vi.resetAllMocks();
});

describe("parseRange", () => {
  it.each([undefined, "", "xyz", ["7d", "30d"], null, 7])("valor %j → 30d", (v) => {
    expect(parseRange(v)).toBe("30d");
  });
  it.each(["7d", "30d", "todo"])("acepta %s", (v) => {
    expect(parseRange(v)).toBe(v);
  });
});

describe("getRangeStart", () => {
  it("7d = 00:00 UTC de hace 6 días", () => {
    expect(getRangeStart("7d", NOW)?.toISOString()).toBe("2026-11-03T00:00:00.000Z");
  });
  it("30d = 00:00 UTC de hace 29 días", () => {
    expect(getRangeStart("30d", NOW)?.toISOString()).toBe("2026-10-11T00:00:00.000Z");
  });
  it("todo = null", () => {
    expect(getRangeStart("todo", NOW)).toBeNull();
  });
});

describe("getClickTotals", () => {
  it("sin filtro de fecha en todo", async () => {
    mocks.count.mockResolvedValue(5);
    expect(await getClickTotals("todo")).toBe(5);
    expect(mocks.count).toHaveBeenCalledWith({ where: {} });
  });
  it("filtra por createdAt con rango", async () => {
    mocks.count.mockResolvedValue(2);
    await getClickTotals("7d");
    const where = mocks.count.mock.calls[0][0].where;
    expect(where.createdAt.gte).toBeInstanceOf(Date);
  });
});

describe("getClicksByProduct", () => {
  it("incluye ceros y ordena por clics desc. y nombre", async () => {
    mocks.groupBy.mockResolvedValue([
      { productId: 2, _count: { _all: 7 } },
      { productId: 3, _count: { _all: 7 } },
    ]);
    mocks.productFindMany.mockResolvedValue([
      { id: 1, title: "Cero", category: { name: "A" } },
      { id: 3, title: "Beta", category: { name: "B" } },
      { id: 2, title: "Alfa", category: { name: "A" } },
    ]);
    expect(await getClicksByProduct("todo")).toEqual([
      { id: 2, name: "Alfa", categoryName: "A", clicks: 7 },
      { id: 3, name: "Beta", categoryName: "B", clicks: 7 },
      { id: 1, name: "Cero", categoryName: "A", clicks: 0 },
    ]);
  });
});

describe("getClicksByCategory", () => {
  it("agrega por categoría e incluye las que tienen 0", async () => {
    mocks.groupBy.mockResolvedValue([
      { productId: 1, _count: { _all: 3 } },
      { productId: 2, _count: { _all: 4 } },
    ]);
    mocks.productFindMany.mockResolvedValue([
      { id: 1, categoryId: 10 },
      { id: 2, categoryId: 10 },
      { id: 3, categoryId: 11 },
    ]);
    mocks.categoryFindMany.mockResolvedValue([
      { id: 11, name: "Vacía" },
      { id: 10, name: "Cursos" },
    ]);
    expect(await getClicksByCategory("todo")).toEqual([
      { id: 10, name: "Cursos", clicks: 7 },
      { id: 11, name: "Vacía", clicks: 0 },
    ]);
  });
});

describe("getClicksByDay", () => {
  it("7d devuelve 7 filas, más reciente primero, con ceros", async () => {
    mocks.queryRaw.mockResolvedValue([
      { day: new Date("2026-11-09T00:00:00Z"), clicks: BigInt(4) },
      { day: "2026-11-07", clicks: 2 },
    ]);
    const result = await getClicksByDay("7d", NOW);
    expect(result).toHaveLength(7);
    expect(result[0]).toEqual({ date: "2026-11-09", clicks: 4 });
    expect(result[1]).toEqual({ date: "2026-11-08", clicks: 0 });
    expect(result[2]).toEqual({ date: "2026-11-07", clicks: 2 });
    expect(result[6].date).toBe("2026-11-03");
  });
  it("30d devuelve 30 filas", async () => {
    mocks.queryRaw.mockResolvedValue([]);
    expect(await getClicksByDay("30d", NOW)).toHaveLength(30);
  });
  it("todo solo devuelve días con clics, desc.", async () => {
    mocks.queryRaw.mockResolvedValue([
      { day: new Date("2026-01-02T00:00:00Z"), clicks: BigInt(1) },
      { day: new Date("2026-03-05T00:00:00Z"), clicks: BigInt(3) },
    ]);
    expect(await getClicksByDay("todo", NOW)).toEqual([
      { date: "2026-03-05", clicks: 3 },
      { date: "2026-01-02", clicks: 1 },
    ]);
  });
  it("la fecha de inicio va como parámetro, no interpolada", async () => {
    mocks.queryRaw.mockResolvedValue([]);
    await getClicksByDay("7d", NOW);
    const sql = mocks.queryRaw.mock.calls[0][0];
    expect(sql.values).toHaveLength(1);
    expect(sql.sql).not.toContain("2026");
  });
});
