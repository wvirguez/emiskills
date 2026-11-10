// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.stubEnv("SITE_URL", "https://emiskills.com/");

import robots from "./robots";

describe("robots", () => {
  it("bloquea admin, redirecciones de afiliado y API; permite el resto", () => {
    const { rules, sitemap } = robots();
    const rule = Array.isArray(rules) ? rules[0] : rules;
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toEqual(["/admin/", "/go/", "/api/"]);
    expect(sitemap).toBe("https://emiskills.com/sitemap.xml");
  });
});
