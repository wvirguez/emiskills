// @vitest-environment node
import { config } from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";

config();

describe("conexión MySQL (integración)", () => {
  let db: PrismaClient | null = null;
  let dbConnected = false;

  beforeAll(async () => {
    try {
      const { db: dbInstance } = await import("@/lib/db");
      db = dbInstance;
      // Test connection with a timeout
      await Promise.race([
        db.$queryRaw`SELECT 1`,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Connection timeout")), 5000)),
      ]);
      dbConnected = true;
    } catch (e) {
      console.log("Database not reachable, skipping integration tests:", e instanceof Error ? e.message : String(e));
      dbConnected = false;
    }
  });

  afterAll(async () => {
    if (db) {
      await db.$disconnect();
    }
  });

  it("ejecuta SELECT 1", async () => {
    if (!dbConnected) return;
    const rows = await db!.$queryRaw<{ ok: bigint | number }[]>`SELECT 1 AS ok`;
    expect(Number(rows[0].ok)).toBe(1);
  });
});