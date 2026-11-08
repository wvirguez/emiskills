// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  clickCreate: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    click: {
      create: mocks.clickCreate,
    },
  },
}));

import { recordClick } from "@/lib/clicks";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("recordClick", () => {
  it("crea el clic con productId y referer válido", async () => {
    mocks.clickCreate.mockResolvedValue({ id: 1, productId: 42, referer: "https://example.com/producto", createdAt: new Date() });

    await recordClick({ productId: 42, referer: "https://example.com/producto" });

    expect(mocks.clickCreate).toHaveBeenCalledTimes(1);
    expect(mocks.clickCreate.mock.calls[0][0]).toEqual({
      data: { productId: 42, referer: "https://example.com/producto" },
    });
  });

  it("trunca el referer a 500 caracteres cuando es muy largo", async () => {
    const longReferer = "a".repeat(600);
    const truncated = "a".repeat(500);
    mocks.clickCreate.mockResolvedValue({ id: 1, productId: 1, referer: truncated, createdAt: new Date() });

    await recordClick({ productId: 1, referer: longReferer });

    expect(mocks.clickCreate.mock.calls[0][0].data.referer).toBe(truncated);
    expect(mocks.clickCreate.mock.calls[0][0].data.referer).toHaveLength(500);
  });

  it("guarda referer como null cuando no se proporciona", async () => {
    mocks.clickCreate.mockResolvedValue({ id: 1, productId: 1, referer: null, createdAt: new Date() });

    await recordClick({ productId: 1 });

    expect(mocks.clickCreate.mock.calls[0][0].data.referer).toBeNull();
  });

  it("guarda referer como null cuando se pasa null explícitamente", async () => {
    mocks.clickCreate.mockResolvedValue({ id: 1, productId: 1, referer: null, createdAt: new Date() });

    await recordClick({ productId: 1, referer: null });

    expect(mocks.clickCreate.mock.calls[0][0].data.referer).toBeNull();
  });

  it("rechaza productId inválido (0)", async () => {
    await expect(recordClick({ productId: 0, referer: "https://example.com" })).rejects.toThrow();
    expect(mocks.clickCreate).not.toHaveBeenCalled();
  });

  it("rechaza productId inválido (negativo)", async () => {
    await expect(recordClick({ productId: -5, referer: "https://example.com" })).rejects.toThrow();
    expect(mocks.clickCreate).not.toHaveBeenCalled();
  });

  it("rechaza productId no entero", async () => {
    await expect(recordClick({ productId: 1.5, referer: "https://example.com" })).rejects.toThrow();
    expect(mocks.clickCreate).not.toHaveBeenCalled();
  });
});