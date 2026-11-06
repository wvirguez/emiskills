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

export type GetProductsParams = { page?: number; pageSize?: number };

const pageSchema = z.number().int().min(1).catch(1);
const pageSizeSchema = z
  .number()
  .int()
  .min(1)
  .max(MAX_PAGE_SIZE)
  .catch(DEFAULT_PAGE_SIZE);

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
  const where = { isActive: true };

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
