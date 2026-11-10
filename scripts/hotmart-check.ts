import { config } from "dotenv";
import { getHotmartEnv } from "../lib/env";
import { getBaseUrl, listProductOffers, listProducts } from "../lib/hotmart";
import { formatSummary } from "../lib/hotmart/summary";

config();

async function main(): Promise<void> {
  const env = getHotmartEnv();
  console.log(`Entorno: ${env.HOTMART_ENV} (${getBaseUrl(env)})`);
  const products = await listProducts();
  const offers = products[0] ? await listProductOffers(products[0].ucode) : [];
  console.log(formatSummary(products, offers));
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`✘ ${msg}`);
  process.exit(1);
});
