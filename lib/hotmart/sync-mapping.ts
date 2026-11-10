import { isValidCurrency, type Currency } from "../product-options";
import { slugify } from "../slug";
import type { HotmartOffer } from "./schemas";

/** Funciones puras del mapeo Hotmart → catálogo. */

export const FALLBACK_CATEGORY_SLUG = "sin-categoria";
export const FALLBACK_CATEGORY_NAME = "Sin categoría";

/** Oferta principal; si ninguna lo es, la primera; sin ofertas → null. */
export function pickMainOffer(offers: HotmartOffer[]): HotmartOffer | null {
  return offers.find((o) => o.isMain) ?? offers[0] ?? null;
}

const FORMAT_TO_CATEGORY: Record<string, string> = {
  ONLINE_COURSE: "curso",
  EBOOK: "ebook",
  TEMPLATES: "plantilla",
  COMMUNITY: "membresia",
};

export function mapFormatToCategorySlug(format: string | null, isSubscription: boolean): string {
  if (format === "COMMUNITY" || isSubscription) return "membresia";
  return (format && FORMAT_TO_CATEGORY[format]) || FALLBACK_CATEGORY_SLUG;
}

export function isSupportedCurrency(currency: string): currency is Currency {
  return isValidCurrency(currency);
}

/** Slug único: `slugify(name)`; si ya existe, añade `-<externalId>`. */
export function buildSlug(name: string, externalId: string, exists: (slug: string) => boolean): string {
  const base = slugify(name) || `producto-${externalId}`;
  if (!exists(base)) return base;
  return `${base}-${externalId}`;
}
