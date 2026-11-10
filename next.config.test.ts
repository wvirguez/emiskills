import { afterEach, describe, expect, it, vi } from "vitest";

async function loadHeaders(nodeEnv: string) {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", nodeEnv);
  const config = (await import("./next.config")).default;
  const rules = await config.headers!();
  return Object.fromEntries(rules[0].headers.map((h) => [h.key, h.value]));
}

describe("next.config headers", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("aplica cabeceras de seguridad a todas las rutas", async () => {
    vi.resetModules();
    const config = (await import("./next.config")).default;
    const rules = await config.headers!();
    expect(rules[0].source).toBe("/:path*");
    const headers = await loadHeaders("development");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });

  it("HSTS solo en producción", async () => {
    expect((await loadHeaders("development"))["Strict-Transport-Security"]).toBeUndefined();
    expect((await loadHeaders("production"))["Strict-Transport-Security"]).toMatch(/max-age=/);
  });
});
