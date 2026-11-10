import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { getEnv } from "@/lib/env";
import { seedBase } from "./seed-base";

// Seed de producción: solo plataformas y categorías base, sin productos de ejemplo.
const prisma = new PrismaClient({ adapter: new PrismaMariaDb(getEnv().DATABASE_URL) });

seedBase(prisma)
  .then(() => console.log("Seed de producción aplicado (plataformas y categorías base)."))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
