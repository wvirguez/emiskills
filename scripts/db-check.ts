import { config } from "dotenv";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { parseEnv } from "../lib/env";

config();

async function main(): Promise<void> {
  const { DATABASE_URL } = parseEnv(process.env);
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(DATABASE_URL) });
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("✔ Conexión a MySQL OK");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`✘ ${msg}`);
  process.exit(1);
});
