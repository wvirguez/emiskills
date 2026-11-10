import type { HotmartOffer, HotmartProduct } from "./schemas";
import type { SyncResult } from "./sync";

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

/** Resumen (español) de `npm run hotmart:sync`. */
export function formatSyncResult(r: SyncResult): string {
  const lines = [
    "✔ Sincronización terminada",
    `Creados: ${r.created} · Actualizados: ${r.updated} · Desactivados: ${r.deactivated} · Sin cambios: ${r.unchanged}`,
  ];
  if (r.created > 0) {
    lines.push("Los productos nuevos quedan inactivos y con el enlace del productor: añade tu enlace de afiliado antes de activarlos.");
  }
  if (r.skipped.length) {
    lines.push(`Omitidos (${r.skipped.length}):`, ...r.skipped.map((s) => `  - #${s.id} ${s.name}: ${s.reason}`));
  }
  if (r.errors.length) {
    lines.push(`Errores (${r.errors.length}):`, ...r.errors.map((e) => `  - #${e.id}: ${e.message}`));
  }
  return lines.join("\n");
}
