// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { BASE_CATEGORIES, BASE_PLATFORMS, seedBase } from "./seed-base";

function makeClient() {
  const platform = { upsert: vi.fn().mockResolvedValue({}) };
  const category = { upsert: vi.fn().mockResolvedValue({}) };
  return { platform, category };
}

describe("seedBase", () => {
  it("crea solo plataformas y categorías base, sin tocar productos", async () => {
    const client = makeClient();
    await seedBase(client);
    expect(client.platform.upsert).toHaveBeenCalledTimes(BASE_PLATFORMS.length);
    expect(client.category.upsert).toHaveBeenCalledTimes(BASE_CATEGORIES.length);
    expect(Object.keys(client)).toEqual(["platform", "category"]);
    expect(BASE_PLATFORMS.map((p) => p.slug)).toEqual(["hotmart", "manual"]);
    expect(BASE_CATEGORIES.map((c) => c.slug)).toEqual(["curso", "ebook", "plantilla", "membresia"]);
  });

  it("es idempotente y no pisa datos: update vacío en cada upsert", async () => {
    const client = makeClient();
    await seedBase(client);
    await seedBase(client);
    for (const call of [...client.platform.upsert.mock.calls, ...client.category.upsert.mock.calls]) {
      expect(call[0].update).toEqual({});
    }
  });
});
