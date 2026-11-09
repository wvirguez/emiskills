import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { getPlatforms, type PlatformDTO } from "@/lib/products";
import { type Currency, type LanguageCode, type GradientPresetValue, isValidCurrency, isValidLanguage, isValidGradient, getDefaultGradient } from "@/lib/product-options";

/** Capa de datos de administración de productos (solo servidor). */

export type AdminProductListItem = {
  id: number;
  slug: string;
  title: string;
  category: { slug: string; name: string };
  platform: { slug: string; name: string };
  price: string;
  isActive: boolean;
  clickCount: number;
};

export type AdminProductDetail = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  description: string | null;
  price: number;
  currency: Currency;
  language: LanguageCode;
  imageUrl: string | null;
  imageGradient: GradientPresetValue | null;
  affiliateUrl: string;
  isActive: boolean;
  categoryId: number;
  platformId: number;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductInput = {
  title: string;
  shortDescription: string;
  description?: string | null;
  price: number;
  currency: Currency;
  language: LanguageCode;
  imageUrl?: string | null;
  imageGradient?: GradientPresetValue | null;
  affiliateUrl: string;
  categoryId: number;
  platformId: number;
};

export type UpdateProductInput = Partial<{
  title: string;
  shortDescription: string;
  description: string | null;
  price: number;
  currency: Currency;
  language: LanguageCode;
  imageUrl: string | null;
  imageGradient: GradientPresetValue | null;
  affiliateUrl: string;
  categoryId: number;
  platformId: number;
  isActive: boolean;
}>;

export type CreateProductResult =
  | { ok: true; product: { id: number; slug: string } }
  | { ok: false; error: "slug-exists" | "invalid-category" | "invalid-platform" | "invalid-currency" | "invalid-language" | "invalid-gradient" };

export type UpdateProductResult =
  | { ok: true; product: AdminProductDetail }
  | { ok: false; error: "not-found" | "invalid-category" | "invalid-platform" | "invalid-currency" | "invalid-language" | "invalid-gradient" };

export type SetProductActiveResult =
  | { ok: true; isActive: boolean }
  | { ok: false; error: "not-found" };

export type DeleteProductResult =
  | { ok: true }
  | { ok: false; error: "has-clicks"; count: number }
  | { ok: false; error: "not-found" };

const adminProductSelect = {
  id: true,
  slug: true,
  title: true,
  shortDescription: true,
  description: true,
  price: true,
  currency: true,
  language: true,
  imageUrl: true,
  imageGradient: true,
  affiliateUrl: true,
  isActive: true,
  categoryId: true,
  platformId: true,
  _count: { select: { clicks: true } },
  createdAt: true,
  updatedAt: true,
  category: { select: { slug: true, name: true } },
  platform: { select: { slug: true, name: true } },
} as const;

type AdminProductRow = {
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
  affiliateUrl: string;
  isActive: boolean;
  categoryId: number;
  platformId: number;
  _count: { clicks: number };
  createdAt: Date;
  updatedAt: Date;
  category: { slug: string; name: string };
  platform: { slug: string; name: string };
};

function toAdminProductListItem(row: AdminProductRow): AdminProductListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: { slug: row.category.slug, name: row.category.name },
    platform: { slug: row.platform.slug, name: row.platform.name },
    price: row.price.toString(),
    isActive: row.isActive,
    clickCount: row._count.clicks,
  };
}

function toAdminProductDetail(row: AdminProductRow): AdminProductDetail {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    description: row.description,
    price: Number(row.price),
    currency: row.currency as Currency,
    language: row.language as LanguageCode,
    imageUrl: row.imageUrl,
    imageGradient: row.imageGradient as GradientPresetValue | null,
    affiliateUrl: row.affiliateUrl,
    isActive: row.isActive,
    categoryId: row.categoryId,
    platformId: row.platformId,
    clickCount: row._count.clicks,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/** Lista todos los productos para la vista de administración, ordenados por createdAt desc. */
export async function listProductsForAdmin(): Promise<AdminProductListItem[]> {
  const rows = await db.product.findMany({
    select: adminProductSelect,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toAdminProductListItem);
}

/** Obtiene un producto por ID para la vista de administración (incluye todos los campos). */
export async function getProductForAdmin(id: number): Promise<AdminProductDetail | null> {
  if (!Number.isInteger(id) || id <= 0) return null;

  const row = await db.product.findUnique({
    where: { id },
    select: adminProductSelect,
  });

  return row ? toAdminProductDetail(row) : null;
}

/** Lista plataformas para selects (reutiliza getCategories de lib/products.ts). */
export async function listPlatforms(): Promise<PlatformDTO[]> {
  return getPlatforms();
}

/** Crea un producto. Deriva el slug del título. */
export async function createProduct(input: CreateProductInput): Promise<CreateProductResult> {
  const title = input.title.trim();
  const shortDescription = input.shortDescription.trim();
  const slug = slugify(title);

  if (!slug) {
    return { ok: false, error: "slug-exists" };
  }

  // Validar moneda e idioma
  if (!isValidCurrency(input.currency)) {
    return { ok: false, error: "invalid-currency" };
  }
  if (!isValidLanguage(input.language)) {
    return { ok: false, error: "invalid-language" };
  }

  // Validar categoryId y platformId existen
  const [category, platform] = await Promise.all([
    db.category.findUnique({ where: { id: input.categoryId }, select: { id: true } }),
    db.platform.findUnique({ where: { id: input.platformId }, select: { id: true } }),
  ]);

  if (!category) {
    return { ok: false, error: "invalid-category" };
  }
  if (!platform) {
    return { ok: false, error: "invalid-platform" };
  }

  const gradient = input.imageGradient ?? getDefaultGradient();
  if (!isValidGradient(gradient)) {
    return { ok: false, error: "invalid-gradient" };
  }

  try {
    const created = await db.product.create({
      data: {
        title,
        slug,
        shortDescription,
        description: input.description ?? null,
        price: input.price,
        currency: input.currency,
        language: input.language,
        imageUrl: input.imageUrl ?? null,
        imageGradient: gradient,
        affiliateUrl: input.affiliateUrl,
        isActive: true,
        categoryId: input.categoryId,
        platformId: input.platformId,
      },
      select: { id: true, slug: true },
    });
    return { ok: true, product: { id: created.id, slug: created.slug } };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        // Unique constraint violation - check if it's on slug field
        const target = e.meta?.target;
        const isSlug = Array.isArray(target) && target.includes("slug");
        if (isSlug) {
          return { ok: false, error: "slug-exists" };
        }
        // Other unique constraint - rethrow
        throw e;
      }
      if (e.code === "P2003") {
        // Foreign key constraint violation (categoryId or platformId)
        const field = (e.meta?.field_name as string) ?? "";
        if (field.includes("categoryId")) return { ok: false, error: "invalid-category" };
        if (field.includes("platformId")) return { ok: false, error: "invalid-platform" };
        return { ok: false, error: "invalid-category" };
      }
    }
    throw e;
  }
}

/** Actualiza un producto (no toca el slug). */
export async function updateProduct(id: number, input: UpdateProductInput): Promise<UpdateProductResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, error: "not-found" };
  }

  // Validar categoryId si se proporciona
  if (input.categoryId !== undefined) {
    const category = await db.category.findUnique({ where: { id: input.categoryId }, select: { id: true } });
    if (!category) return { ok: false, error: "invalid-category" };
  }

  // Validar platformId si se proporciona
  if (input.platformId !== undefined) {
    const platform = await db.platform.findUnique({ where: { id: input.platformId }, select: { id: true } });
    if (!platform) return { ok: false, error: "invalid-platform" };
  }

  // Validar currency si se proporciona
  if (input.currency !== undefined && !isValidCurrency(input.currency)) {
    return { ok: false, error: "invalid-currency" };
  }

  // Validar language si se proporciona
  if (input.language !== undefined && !isValidLanguage(input.language)) {
    return { ok: false, error: "invalid-language" };
  }

  // Validar gradient si se proporciona
  if (input.imageGradient !== undefined && input.imageGradient !== null && !isValidGradient(input.imageGradient)) {
    return { ok: false, error: "invalid-gradient" };
  }

  const data: Prisma.ProductUpdateInput = {};
  if (input.title !== undefined) data.title = input.title.trim();
  if (input.shortDescription !== undefined) data.shortDescription = input.shortDescription.trim();
  if (input.description !== undefined) data.description = input.description;
  if (input.price !== undefined) data.price = input.price;
  if (input.currency !== undefined) data.currency = input.currency;
  if (input.language !== undefined) data.language = input.language;
  if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl;
  if (input.imageGradient !== undefined) data.imageGradient = input.imageGradient;
  if (input.affiliateUrl !== undefined) data.affiliateUrl = input.affiliateUrl;
  if (input.isActive !== undefined) data.isActive = input.isActive;
  if (input.categoryId !== undefined) data.category = { connect: { id: input.categoryId } };
  if (input.platformId !== undefined) data.platform = { connect: { id: input.platformId } };

  try {
    const updated = await db.product.update({
      where: { id },
      data,
      select: adminProductSelect,
    });
    return { ok: true, product: toAdminProductDetail(updated) };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        // Record not found
        return { ok: false, error: "not-found" };
      }
      if (e.code === "P2003") {
        // Foreign key constraint violation
        const field = typeof e.meta?.field_name === "string" ? e.meta.field_name : "";
        if (field.includes("categoryId")) return { ok: false, error: "invalid-category" };
        if (field.includes("platformId")) return { ok: false, error: "invalid-platform" };
        return { ok: false, error: "invalid-category" };
      }
    }
    throw e;
  }
}

/** Activa o desactiva un producto. */
export async function setProductActive(id: number, isActive: boolean): Promise<SetProductActiveResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, error: "not-found" };
  }

  try {
    await db.product.update({
      where: { id },
      data: { isActive },
      select: { id: true },
    });
    return { ok: true, isActive };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, error: "not-found" };
    }
    throw e;
  }
}

/** Elimina un producto. Bloquea si tiene clics registrados. */
export async function deleteProduct(id: number): Promise<DeleteProductResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, error: "not-found" };
  }

  // Verificar si tiene clics antes de intentar borrar
  const clickCount = await db.click.count({
    where: { productId: id },
  });

  if (clickCount > 0) {
    return { ok: false, error: "has-clicks", count: clickCount };
  }

  try {
    await db.product.delete({ where: { id } });
    return { ok: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        // Record not found
        return { ok: false, error: "not-found" };
      }
      if (e.code === "P2003") {
        // Foreign key constraint (race condition: clicks added between check and delete)
        const currentCount = await db.click.count({ where: { productId: id } });
        return { ok: false, error: "has-clicks", count: currentCount };
      }
    }
    throw e;
  }
}