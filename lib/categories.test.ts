// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@/generated/prisma/client";

const mocks = vi.hoisted(() => ({
  categoryFindMany: vi.fn(),
  categoryFindUnique: vi.fn(),
  categoryCreate: vi.fn(),
  categoryUpdate: vi.fn(),
  categoryDelete: vi.fn(),
  productCount: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    category: {
      findMany: mocks.categoryFindMany,
      findUnique: mocks.categoryFindUnique,
      create: mocks.categoryCreate,
      update: mocks.categoryUpdate,
      delete: mocks.categoryDelete,
    },
    product: {
      count: mocks.productCount,
    },
  },
}));

import {
  listCategoriesWithCount,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("listCategoriesWithCount", () => {
  it("devuelve categorías con conteo de productos ordenadas por nombre", async () => {
    mocks.categoryFindMany.mockResolvedValue([
      { id: 1, slug: "a", name: "A", _count: { products: 3 } },
      { id: 2, slug: "b", name: "B", _count: { products: 5 } },
    ]);

    const res = await listCategoriesWithCount();

    expect(res).toEqual([
      { id: 1, slug: "a", name: "A", productCount: 3 },
      { id: 2, slug: "b", name: "B", productCount: 5 },
    ]);
    expect(mocks.categoryFindMany.mock.calls[0][0]).toEqual({
      select: {
        id: true,
        slug: true,
        name: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });
  });

  it("devuelve array vacío si no hay categorías", async () => {
    mocks.categoryFindMany.mockResolvedValue([]);
    expect(await listCategoriesWithCount()).toEqual([]);
  });
});

describe("getCategoryById", () => {
  it("devuelve la categoría si existe", async () => {
    mocks.categoryFindUnique.mockResolvedValue({ id: 1, slug: "cursos", name: "Cursos" });

    const res = await getCategoryById(1);

    expect(res).toEqual({ id: 1, slug: "cursos", name: "Cursos" });
    expect(mocks.categoryFindUnique.mock.calls[0][0]).toEqual({
      where: { id: 1 },
      select: { id: true, slug: true, name: true },
    });
  });

  it("devuelve null si no existe", async () => {
    mocks.categoryFindUnique.mockResolvedValue(null);
    expect(await getCategoryById(999)).toBeNull();
  });

  it("devuelve null con id inválido (0)", async () => {
    expect(await getCategoryById(0)).toBeNull();
    expect(mocks.categoryFindUnique).not.toHaveBeenCalled();
  });

  it("devuelve null con id negativo", async () => {
    expect(await getCategoryById(-5)).toBeNull();
    expect(mocks.categoryFindUnique).not.toHaveBeenCalled();
  });

  it("devuelve null con id no entero", async () => {
    expect(await getCategoryById(1.5)).toBeNull();
    expect(mocks.categoryFindUnique).not.toHaveBeenCalled();
  });

  it("devuelve null con id como string numérico", async () => {
    // @ts-expect-error testing runtime behavior with invalid input
    expect(await getCategoryById("abc")).toBeNull();
    expect(mocks.categoryFindUnique).not.toHaveBeenCalled();
  });
});

describe("createCategory", () => {
  it("crea la categoría derivando el slug del nombre", async () => {
    mocks.categoryCreate.mockResolvedValue({ id: 1, slug: "nueva-categoria", name: "Nueva Categoría" });

    const res = await createCategory({ name: "Nueva Categoría" });

    expect(res).toEqual({ ok: true, category: { id: 1, slug: "nueva-categoria", name: "Nueva Categoría" } });
    expect(mocks.categoryCreate.mock.calls[0][0]).toEqual({
      data: { name: "Nueva Categoría", slug: "nueva-categoria" },
      select: { id: true, slug: true, name: true },
    });
  });

  it("recorta espacios del nombre", async () => {
    mocks.categoryCreate.mockResolvedValue({ id: 1, slug: "curso", name: "Curso" });

    const res = await createCategory({ name: "  Curso  " });

    expect(res.ok).toBe(true);
    expect(mocks.categoryCreate.mock.calls[0][0].data.name).toBe("Curso");
  });

  it("devuelve error slug-exists si el slug ya existe (P2002)", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
      code: "P2002",
      clientVersion: "1.0.0",
    });
    mocks.categoryCreate.mockRejectedValue(error);

    const res = await createCategory({ name: "Curso" });

    expect(res).toEqual({ ok: false, error: "slug-exists" });
  });

  it("propaga otros errores de Prisma", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Other error", {
      code: "P2003",
      clientVersion: "1.0.0",
    });
    mocks.categoryCreate.mockRejectedValue(error);

    await expect(createCategory({ name: "Curso" })).rejects.toThrow();
  });

  it("devuelve error slug-exists si el nombre genera slug vacío", async () => {
    const res = await createCategory({ name: "@@@" });
    expect(res).toEqual({ ok: false, error: "slug-exists" });
    expect(mocks.categoryCreate).not.toHaveBeenCalled();
  });

  it("devuelve error slug-exists si el nombre es muy corto", async () => {
    const res = await createCategory({ name: "a" });
    expect(res).toEqual({ ok: false, error: "slug-exists" });
    expect(mocks.categoryCreate).not.toHaveBeenCalled();
  });

  it("devuelve error slug-exists si el nombre es muy largo", async () => {
    const res = await createCategory({ name: "a".repeat(101) });
    expect(res).toEqual({ ok: false, error: "slug-exists" });
    expect(mocks.categoryCreate).not.toHaveBeenCalled();
  });
});

describe("updateCategory", () => {
  it("actualiza el nombre de la categoría (no toca el slug)", async () => {
    mocks.categoryUpdate.mockResolvedValue({ id: 1, slug: "curso-original", name: "Nuevo Nombre" });

    const res = await updateCategory(1, { name: "Nuevo Nombre" });

    expect(res).toEqual({ ok: true, category: { id: 1, slug: "curso-original", name: "Nuevo Nombre" } });
    expect(mocks.categoryUpdate.mock.calls[0][0]).toEqual({
      where: { id: 1 },
      data: { name: "Nuevo Nombre" },
      select: { id: true, slug: true, name: true },
    });
  });

  it("recorta espacios del nombre", async () => {
    mocks.categoryUpdate.mockResolvedValue({ id: 1, slug: "curso", name: "Curso" });

    const res = await updateCategory(1, { name: "  Curso  " });

    expect(res.ok).toBe(true);
    expect(mocks.categoryUpdate.mock.calls[0][0].data.name).toBe("Curso");
  });

  it("devuelve not-found si la categoría no existe (P2025)", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "1.0.0",
    });
    mocks.categoryUpdate.mockRejectedValue(error);

    const res = await updateCategory(999, { name: "Nuevo" });

    expect(res).toEqual({ ok: false, error: "not-found" });
  });

  it("propaga otros errores de Prisma", async () => {
    const error = new Prisma.PrismaClientKnownRequestError("Other error", {
      code: "P2003",
      clientVersion: "1.0.0",
    });
    mocks.categoryUpdate.mockRejectedValue(error);

    await expect(updateCategory(1, { name: "Nuevo" })).rejects.toThrow();
  });

  it("devuelve not-found con id inválido (0)", async () => {
    const res = await updateCategory(0, { name: "Nuevo" });
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.categoryUpdate).not.toHaveBeenCalled();
  });

  it("devuelve not-found con id negativo", async () => {
    const res = await updateCategory(-5, { name: "Nuevo" });
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.categoryUpdate).not.toHaveBeenCalled();
  });

  it("devuelve not-found con nombre muy corto", async () => {
    const res = await updateCategory(1, { name: "a" });
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.categoryUpdate).not.toHaveBeenCalled();
  });

  it("devuelve not-found con nombre muy largo", async () => {
    const res = await updateCategory(1, { name: "a".repeat(101) });
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.categoryUpdate).not.toHaveBeenCalled();
  });
});

describe("deleteCategory", () => {
  it("elimina la categoría si no tiene productos", async () => {
    mocks.productCount.mockResolvedValue(0);
    mocks.categoryDelete.mockResolvedValue({});

    const res = await deleteCategory(1);

    expect(res).toEqual({ ok: true });
    expect(mocks.productCount.mock.calls[0][0]).toEqual({ where: { categoryId: 1 } });
    expect(mocks.categoryDelete.mock.calls[0][0]).toEqual({ where: { id: 1 } });
  });

  it("devuelve has-products con el conteo si hay productos", async () => {
    mocks.productCount.mockResolvedValue(5);

    const res = await deleteCategory(1);

    expect(res).toEqual({ ok: false, error: "has-products", count: 5 });
    expect(mocks.categoryDelete).not.toHaveBeenCalled();
  });

  it("devuelve not-found si la categoría no existe (P2025)", async () => {
    mocks.productCount.mockResolvedValue(0);
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "1.0.0",
    });
    mocks.categoryDelete.mockRejectedValue(error);

    const res = await deleteCategory(999);

    expect(res).toEqual({ ok: false, error: "not-found" });
  });

  it("devuelve has-products si hay carrera y aparece P2003", async () => {
    mocks.productCount.mockResolvedValueOnce(0); // primera verificación
    const error = new Prisma.PrismaClientKnownRequestError("Foreign key constraint failed", {
      code: "P2003",
      clientVersion: "1.0.0",
    });
    mocks.categoryDelete.mockRejectedValue(error);
    mocks.productCount.mockResolvedValueOnce(3); // verificación tras carrera

    const res = await deleteCategory(1);

    expect(res).toEqual({ ok: false, error: "has-products", count: 3 });
  });

  it("propaga otros errores de Prisma", async () => {
    mocks.productCount.mockResolvedValue(0);
    const error = new Prisma.PrismaClientKnownRequestError("Other error", {
      code: "P2002",
      clientVersion: "1.0.0",
    });
    mocks.categoryDelete.mockRejectedValue(error);

    await expect(deleteCategory(1)).rejects.toThrow();
  });

  it("devuelve not-found con id inválido (0)", async () => {
    const res = await deleteCategory(0);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.productCount).not.toHaveBeenCalled();
    expect(mocks.categoryDelete).not.toHaveBeenCalled();
  });

  it("devuelve not-found con id negativo", async () => {
    const res = await deleteCategory(-5);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.productCount).not.toHaveBeenCalled();
    expect(mocks.categoryDelete).not.toHaveBeenCalled();
  });

  it("devuelve not-found con id no entero", async () => {
    const res = await deleteCategory(1.5);
    expect(res).toEqual({ ok: false, error: "not-found" });
    expect(mocks.productCount).not.toHaveBeenCalled();
    expect(mocks.categoryDelete).not.toHaveBeenCalled();
  });
});