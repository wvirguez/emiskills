import type { HotmartOffer, HotmartProduct } from "./schemas";

/** Resumen legible (español) para `npm run hotmart:check`. Sin secretos. */
export function formatSummary(products: HotmartProduct[], firstProductOffers: HotmartOffer[]): string {
  const lines = ["✔ Autenticación y lectura correctas", `Productos encontrados: ${products.length}`];
  for (const p of products.slice(0, 5)) {
    lines.push(`  - #${p.id} ${p.name} [${p.status}${p.format ? ` · ${p.format}` : ""}]`);
  }
  if (products[0]) {
    lines.push(`Ofertas del primer producto (${products[0].name}): ${firstProductOffers.length}`);
    for (const o of firstProductOffers) {
      lines.push(`  - ${o.code}${o.isMain ? " (principal)" : ""}: ${o.price.value} ${o.price.currency}`);
    }
  }
  return lines.join("\n");
}
