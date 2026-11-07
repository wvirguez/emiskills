import { z } from "zod";

/** Parámetros de búsqueda del catálogo, ya normalizados. */
export type SearchFilters = {
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

const pageSchema = z.coerce.number().int().min(1).catch(1);

/** Normaliza la query string sin lanzar: valores inválidos se descartan. */
export function parseSearchParams(raw: RawParams): SearchFilters {
  return {
    q: qSchema.parse(first(raw.q)),
    categoria: categoriaSchema.parse(first(raw.categoria)),
    page: pageSchema.parse(first(raw.page) ?? 1),
  };
}

/** Construye la URL de /productos conservando filtros. */
export function buildProductsHref(filters: {
  q?: string;
  categoria?: string;
  page?: number;
}): string {
  const sp = new URLSearchParams();
  if (filters.q) sp.set("q", filters.q);
  if (filters.categoria) sp.set("categoria", filters.categoria);
  if (filters.page && filters.page > 1) sp.set("page", String(filters.page));
  const qs = sp.toString();
  return qs ? `/productos?${qs}` : "/productos";
}
