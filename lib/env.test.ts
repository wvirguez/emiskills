import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

describe("parseEnv", () => {
  it("acepta una DATABASE_URL de MySQL válida", () => {
    const env = parseEnv({ DATABASE_URL: "mysql://u:p@localhost:3306/emiskills" });
    expect(env.DATABASE_URL).toContain("mysql://");
  });

  it("falla con mensaje claro si falta DATABASE_URL", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it("falla si no es una URL mysql://", () => {
    expect(() => parseEnv({ DATABASE_URL: "postgres://x" })).toThrow(/mysql:\/\//);
  });
});
