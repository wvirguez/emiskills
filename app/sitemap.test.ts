// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const getSitemapProducts = vi.fn();
vi.mock("@/lib/products", () => ({
  getSitemapProducts: () => getSitemapProducts(),
}));
vi.mock("next/server", () => ({ connection: async () => undefined }));
vi.stubEnv("SITE_URL", "https://emiskills.com");

import sitemap from "./sitemap";

describe("sitemap", () => {
  beforeEach(() => getSitemapProducts.mockReset());

  it("incluye home, catálogo y productos activos con URL absoluta y barra final", async () => {
    const updatedAt = new Date("2026-02-01");
    getSitemapProducts.mockResolvedValue([{ slug: "curso-a", updatedAt }]);
    const entries = await sitemap();
    expect(entries.map((e) => e.url)).toEqual([
      "https://emiskills.com/",
      "https://emiskills.com/productos/",
      "https://emiskills.com/productos/curso-a/",
    ]);
    expect(entries[2].lastModified).toBe(updatedAt);
  });

  it("sin productos solo lista las páginas fijas", async () => {
    getSitemapProducts.mockResolvedValue([]);
    expect(await sitemap()).toHaveLength(2);
  });
});
