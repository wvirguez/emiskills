// @vitest-environment node
import { config } from "dotenv";
import { afterAll, describe, expect, it } from "vitest";

config();

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("conexión MySQL (integración)", () => {
  afterAll(async () => {
    const { db } = await import("@/lib/db");
    await db.$disconnect();
  });

  it("ejecuta SELECT 1", async () => {
    const { db } = await import("@/lib/db");
    const rows = await db.$queryRaw<{ ok: bigint | number }[]>`SELECT 1 AS ok`;
    expect(Number(rows[0].ok)).toBe(1);
  });
});
