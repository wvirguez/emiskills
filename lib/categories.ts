import "server-only";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";

/** Capa de datos de categorías (solo servidor). Devuelve DTO planos, sin tipos de Prisma. */

export const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre no puede exceder 100 caracteres"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export type CategoryDTO = {
  id: number;
  slug: string;
  name: string;
};

export type CategoryWithCountDTO = CategoryDTO & {
  productCount: number;
};

export type CreateCategoryResult =
  | { ok: true; category: CategoryDTO }
  | { ok: false; error: "slug-exists" };

export type UpdateCategoryResult =
  | { ok: true; category: CategoryDTO }
  | { ok: false; error: "not-found" };

export type DeleteCategoryResult =
  | { ok: true }
  | { ok: false; error: "has-products"; count: number }
  | { ok: false; error: "not-found" };

/** Lista todas las categorías con su conteo de productos, ordenadas por nombre. */
export async function listCategoriesWithCount(): Promise<CategoryWithCountDTO[]> {
  const rows = await db.category.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    productCount: row._count.products,
  }));
}

/** Obtiene una categoría por ID. */
export async function getCategoryById(id: number): Promise<CategoryDTO | null> {
  if (!Number.isInteger(id) || id <= 0) return null;

  const row = await db.category.findUnique({
    where: { id },
    select: { id: true, slug: true, name: true },
  });

  return row ?? null;
}

/** Crea una categoría. Deriva el slug del nombre. */
export async function createCategory(input: { name: string }): Promise<CreateCategoryResult> {
  const name = input.name.trim();
  if (name.length < 2 || name.length > 100) {
    return { ok: false, error: "slug-exists" }; // validation happens at boundary; this is a safeguard
  }

  const slug = slugify(name);
  if (!slug) {
    return { ok: false, error: "slug-exists" };
  }

  try {
    const created = await db.category.create({
      data: { name, slug },
      select: { id: true, slug: true, name: true },
    });
    return { ok: true, category: created };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // Unique constraint violation on slug
      return { ok: false, error: "slug-exists" };
    }
    throw e;
  }
}

/** Actualiza el nombre de una categoría (no toca el slug). */
export async function updateCategory(
  id: number,
  input: { name: string },
): Promise<UpdateCategoryResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, error: "not-found" };
  }

  const name = input.name.trim();
  if (name.length < 2 || name.length > 100) {
    return { ok: false, error: "not-found" };
  }

  try {
    const updated = await db.category.update({
      where: { id },
      data: { name },
      select: { id: true, slug: true, name: true },
    });
    return { ok: true, category: updated };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      // Record not found
      return { ok: false, error: "not-found" };
    }
    throw e;
  }
}

/** Elimina una categoría. Bloquea si tiene productos asociados. */
export async function deleteCategory(id: number): Promise<DeleteCategoryResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false, error: "not-found" };
  }

  // Verificar si tiene productos antes de intentar borrar
  const productCount = await db.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    return { ok: false, error: "has-products", count: productCount };
  }

  try {
    await db.category.delete({ where: { id } });
    return { ok: true };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        // Record not found
        return { ok: false, error: "not-found" };
      }
      if (e.code === "P2003") {
        // Foreign key constraint (race condition: products added between check and delete)
        const currentCount = await db.product.count({ where: { categoryId: id } });
        return { ok: false, error: "has-products", count: currentCount };
      }
    }
    throw e;
  }
}