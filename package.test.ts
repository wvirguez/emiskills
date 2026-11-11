// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  engines?: { node?: string };
  scripts: Record<string, string>;
};

describe("package.json (despliegue)", () => {
  it("fija Node 22.x (Hostinger lee la versión de aquí)", () => {
    expect(pkg.engines?.node).toBe("22.x");
  });

  it("define db:deploy con migrate deploy (nunca migrate dev)", () => {
    expect(pkg.scripts["db:deploy"]).toBe("prisma migrate deploy");
  });

  it("define el seed de producción", () => {
    expect(pkg.scripts["db:seed:prod"]).toBe("tsx prisma/seed.production.ts");
  });

  it("start respeta el puerto del panel (PORT)", () => {
    expect(pkg.scripts.start).toBe("next start -p ${PORT:-3000}");
  });

  it("generate del cliente Prisma ocurre en postinstall", () => {
    expect(pkg.scripts.postinstall).toBe("prisma generate");
  });
});
