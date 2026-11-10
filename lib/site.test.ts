import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("absoluteUrl", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("SITE_URL", "https://emiskills.com/");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("añade barra final y base absoluta", async () => {
    const { absoluteUrl } = await import("@/lib/site");
    expect(absoluteUrl("/productos")).toBe("https://emiskills.com/productos/");
    expect(absoluteUrl("productos/curso-a")).toBe("https://emiskills.com/productos/curso-a/");
  });

  it("la raíz termina en /", async () => {
    const { absoluteUrl } = await import("@/lib/site");
    expect(absoluteUrl("/")).toBe("https://emiskills.com/");
    expect(absoluteUrl()).toBe("https://emiskills.com/");
  });
});
