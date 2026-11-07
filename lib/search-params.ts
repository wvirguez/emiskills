import { z } from "zod";

/** Parámetros de búsqueda del catálogo, ya normalizados. */
export type ExtraFilters = {
  precioMin?: number;
  precioMax?: number;
  moneda?: string;
  idioma?: string;
  plataforma?: string;
};

export type SearchFilters = ExtraFilters & {
  q?: string;
  categoria?: string;
  page: number;
};

export const MAX_QUERY_LENGTH = 100;

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const qSchema = z
  .string()
  .transform((v) => v.trim().slice(0, MAX_QUERY_LENGTH).trim())
  .transform((v) => (v === "" ? undefined : v))
  .optional()
  .catch(undefined);

const categoriaSchema = z
  .string()
  .regex(/^[a-z0-9-]{1,50}$/)
  .optional()
  .catch(undefined);

const priceSchema = z
  .string()
  .trim()
  .regex(/^\d{1,7}(\.\d{1,2})?$/)
  .transform(Number)
  .optional()
  .catch(undefined);

const monedaSchema = z
  .string()
  .regex(/^[A-Z]{3}$/)
  .optional()
  .catch(undefined);

const idiomaSchema = z
  .string()
  .regex(/^[a-z]{2}$/)
  .optional()
  .catch(undefined);

const pageSchema = z.coerce.number().int().min(1).catch(1);

/** Normaliza la query string sin lanzar: valores inválidos se descartan. */
export function parseSearchParams(raw: RawParams): SearchFilters {
  const precioMin = priceSchema.parse(first(raw.precioMin));
  let precioMax = priceSchema.parse(first(raw.precioMax));
  if (precioMin !== undefined && precioMax !== undefined && precioMax < precioMin) {
    precioMax = undefined;
  }
  return {
    q: qSchema.parse(first(raw.q)),
    categoria: categoriaSchema.parse(first(raw.categoria)),
    precioMin,
    precioMax,
    moneda: monedaSchema.parse(first(raw.moneda)),
    idioma: idiomaSchema.parse(first(raw.idioma)),
    plataforma: categoriaSchema.parse(first(raw.plataforma)),
    page: pageSchema.parse(first(raw.page) ?? 1),
  };
}

/** Construye la URL de /productos conservando filtros. */
export function buildProductsHref(
  filters: ExtraFilters & { q?: string; categoria?: string; page?: number },
): string {
  const sp = new URLSearchParams();
  if (filters.q) sp.set("q", filters.q);
  if (filters.categoria) sp.set("categoria", filters.categoria);
  if (filters.precioMin !== undefined) sp.set("precioMin", String(filters.precioMin));
  if (filters.precioMax !== undefined) sp.set("precioMax", String(filters.precioMax));
  if (filters.moneda) sp.set("moneda", filters.moneda);
  if (filters.idioma) sp.set("idioma", filters.idioma);
  if (filters.plataforma) sp.set("plataforma", filters.plataforma);
  if (filters.page && filters.page > 1) sp.set("page", String(filters.page));
  const qs = sp.toString();
  return qs ? `/productos?${qs}` : "/productos";
}

/** Construye el href de la sección Categorías en la home.
 *  - Sin slug: `/#categorias`
 *  - Con slug: `/?categoria=<slug>#categorias`
 */
export function buildHomeCategoryHref(slug?: string): string {
  if (!slug) return "/#categorias";
  return `/?categoria=${slug}#categorias`;
}
