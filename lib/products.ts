import { z } from "zod";
import { db } from "@/lib/db";

/** Capa de datos de productos (solo servidor). Devuelve DTO planos, sin tipos de Prisma. */

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

export type RelationDTO = { slug: string; name: string };

export type ProductDTO = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string | null;
  price: number;
  currency: string;
  language: string;
  imageUrl: string | null;
  imageGradient: string | null;
  category: RelationDTO;
  platform: RelationDTO;
};

export type ProductPage = {
  items: ProductDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CategoryDTO = { id: number; slug: string; name: string };
export type PlatformDTO = { id: number; slug: string; name: string };

export type GetProductsParams = {
  page?: number;
  pageSize?: number;
  /** Texto a buscar en título y descripción corta. */
  q?: string;
  /** Slug de categoría. */
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  /** Código ISO de moneda (ej. "USD"). */
  currency?: string;
  /** Código de idioma de 2 letras. */
  language?: string;
  platformSlug?: string;
};

export type FilterOptions = { currencies: string[]; languages: string[] };

const pageSchema = z.number().int().min(1).catch(1);
const pageSizeSchema = z
  .number()
  .int()
  .min(1)
  .max(MAX_PAGE_SIZE)
  .catch(DEFAULT_PAGE_SIZE);

/** Escapa los comodines de LIKE (% _ \\) para que el texto se busque literalmente. */
export function escapeLike(text: string): string {
  return text.replace(/[\\%_]/g, (c) => `\\${c}`);
}

const productInclude = {
  category: { select: { slug: true, name: true } },
  platform: { select: { slug: true, name: true } },
} as const;

type ProductRow = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string | null;
  price: { toString(): string } | number;
  currency: string;
  language: string;
  imageUrl: string | null;
  imageGradient: string | null;
  category: RelationDTO;
  platform: RelationDTO;
};

function toProductDTO(row: ProductRow): ProductDTO {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    price: Number(row.price),
    currency: row.currency,
    language: row.language,
    imageUrl: row.imageUrl,
    imageGradient: row.imageGradient,
    category: { slug: row.category.slug, name: row.category.name },
    platform: { slug: row.platform.slug, name: row.platform.name },
  };
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<ProductPage> {
  const page = pageSchema.parse(params.page);
  const pageSize = pageSizeSchema.parse(params.pageSize ?? DEFAULT_PAGE_SIZE);
  const q = params.q?.trim() ? escapeLike(params.q.trim()) : undefined;
  const where = {
    isActive: true,
    ...(params.categorySlug
      ? { category: { slug: params.categorySlug } }
      : {}),
    ...(params.platformSlug
      ? { platform: { slug: params.platformSlug } }
      : {}),
    ...(params.currency ? { currency: params.currency } : {}),
    ...(params.language ? { language: params.language } : {}),
    ...(params.minPrice !== undefined || params.maxPrice !== undefined
      ? {
          price: {
            ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
            ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { shortDescription: { contains: q } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.product.count({ where }),
  ]);

  return {
    items: rows.map(toProductDTO),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDTO | null> {
  const parsed = z.string().min(1).max(150).safeParse(slug);
  if (!parsed.success) return null;

  const row = await db.product.findFirst({
    where: { slug: parsed.data, isActive: true },
    include: productInclude,
  });
  return row ? toProductDTO(row) : null;
}

export type SitemapProduct = { slug: string; updatedAt: Date };

/** Productos activos para el sitemap (solo slug y fecha de actualización). */
export async function getSitemapProducts(): Promise<SitemapProduct[]> {
  return db.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
    orderBy: { id: "asc" },
  });
}

export async function getAffiliateUrlBySlug(slug: string): Promise<string | null> {
  const parsed = z.string().min(1).max(150).safeParse(slug);
  if (!parsed.success) return null;

  const row = await db.product.findFirst({
    where: { slug: parsed.data, isActive: true },
    select: { affiliateUrl: true },
  });
  return row?.affiliateUrl ?? null;
}

export async function getAffiliateTargetBySlug(slug: string): Promise<{ id: number; affiliateUrl: string } | null> {
  const parsed = z.string().min(1).max(150).safeParse(slug);
  if (!parsed.success) return null;

  const row = await db.product.findFirst({
    where: { slug: parsed.data, isActive: true },
    select: { id: true, affiliateUrl: true },
  });
  return row ? { id: row.id, affiliateUrl: row.affiliateUrl } : null;
}

export async function getCategories(): Promise<CategoryDTO[]> {
  return db.category.findMany({
    select: { id: true, slug: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getPlatforms(): Promise<PlatformDTO[]> {
  return db.platform.findMany({
    select: { id: true, slug: true, name: true },
    orderBy: { name: "asc" },
  });
}

/** Monedas (más comunes primero) e idiomas presentes en productos activos. */
export async function getFilterOptions(): Promise<FilterOptions> {
  const [currencies, languages] = await Promise.all([
    db.product.groupBy({
      by: ["currency"],
      where: { isActive: true },
      _count: { _all: true },
      orderBy: { _count: { currency: "desc" } },
    }),
    db.product.groupBy({
      by: ["language"],
      where: { isActive: true },
      orderBy: { language: "asc" },
    }),
  ]);
  return {
    currencies: currencies.map((c) => c.currency),
    languages: languages.map((l) => l.language),
  };
}
