import { config } from "dotenv";

config();

async function main(): Promise<void> {
  // Import dinámico: `config()` debe cargar .env antes de que lib/db lea DATABASE_URL.
  const { getHotmartEnv } = await import("../lib/env");
  const { syncHotmartProducts } = await import("../lib/hotmart/sync");
  const { formatSyncResult } = await import("../lib/hotmart/summary");
  const { db } = await import("../lib/db");

  getHotmartEnv();
  try {
    console.log(formatSyncResult(await syncHotmartProducts()));
  } finally {
    await db.$disconnect();
  }
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`✘ ${msg}`);
  process.exit(1);
});
